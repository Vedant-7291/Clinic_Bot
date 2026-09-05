import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session, { BookingStep, ISession } from '@/models/Session';
import Appointment from '../../../models/Appointments';
import {
  DEPARTMENTS,
  findDepartmentLabel,
  getServiceByDepartment,
} from '@/lib/departments';
import {
  sendWhatsAppText,
  sendWhatsAppButtons,
  sendWhatsAppList,
  extractIncomingMessage,
} from '@/lib/whatsapp';

// ============================================
// Meta requires this GET endpoint for webhook verification, done once when
// you paste the callback URL + verify token into the developer console.
// ============================================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN ?? process.env.VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// ============================================
// POST receives every inbound message event from Meta. We keep the
// conversation state (which question we're on + answers so far) in a
// Session document keyed by phone number, since serverless functions
// don't retain memory (global.appointments/global.sessions) between calls.
// ============================================
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    await connectDB();

    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    // Ignore status callbacks (delivered/read receipts) — only handle
    // actual inbound messages.
    if (!message) {
      return NextResponse.json({ status: 'ignored' });
    }

    const from: string = message.from; // e.g. "919876543210"
    const { text, replyId } = extractIncomingMessage(message);
    const userInput = (replyId ?? text ?? '').trim();

    let session = await Session.findOne({ phoneNumber: from });

    // Brand new conversation
    if (!session) {
      session = await Session.create({
        phoneNumber: from,
        step: 'ASK_PATIENT_TYPE',
        data: {},
      });
      await sendWhatsAppButtons(
        from,
        "👋 Welcome! I'm the booking assistant. Are you a new or returning patient?",
        [
          { id: 'New Patient', title: 'New Patient' },
          { id: 'Returning Patient', title: 'Returning Patient' },
        ]
      );
      return NextResponse.json({ status: 'started' });
    }

    // Let a patient restart at any time
    if (/^(restart|start over|hi|hello)$/i.test(userInput)) {
      session.step = 'ASK_PATIENT_TYPE';
      session.data = {};
      await saveSession(session);
      await sendWhatsAppButtons(
        from,
        "Let's start again. Are you a new or returning patient?",
        [
          { id: 'New Patient', title: 'New Patient' },
          { id: 'Returning Patient', title: 'Returning Patient' },
        ]
      );
      return NextResponse.json({ status: 'restarted' });
    }

    await handleStep(from, userInput, session);
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always 200 back to Meta so it doesn't disable/retry-storm the webhook;
    // errors are logged server-side instead.
    return NextResponse.json({ status: 'error' });
  }
}

async function saveSession(session: ISession) {
  session.markModified('data');
  await session.save();
}

async function handleStep(from: string, input: string, session: ISession) {
  const step: BookingStep = session.step;

  switch (step) {
    case 'ASK_PATIENT_TYPE': {
      const patientType = /new/i.test(input)
        ? 'New Patient'
        : 'Returning Patient';
      session.data.patientType = patientType;
      session.step = 'ASK_DEPARTMENT';
      await saveSession(session);

      await sendWhatsAppList(
        from,
        'Which department would you like to book with?',
        'Choose department',
        DEPARTMENTS.map((d) => ({ id: d.id, title: d.label }))
      );
      break;
    }

    case 'ASK_DEPARTMENT': {
      const departmentLabel = findDepartmentLabel(input);
      session.data.department = departmentLabel;
      session.step = 'ASK_NAME';
      await saveSession(session);

      await sendWhatsAppText(from, "Great. What's the patient's full name?");
      break;
    }

    case 'ASK_NAME': {
      session.data.patientName = input;
      session.step = 'ASK_DATE';
      await saveSession(session);

      await sendWhatsAppText(
        from,
        'What date would you prefer? (e.g. 2026-09-20)'
      );
      break;
    }

    case 'ASK_DATE': {
      session.data.preferredDate = input;
      session.step = 'ASK_TIME';
      await saveSession(session);

      await sendWhatsAppButtons(from, 'Which time slot works best?', [
        { id: 'Morning (9 AM - 12 PM)', title: 'Morning' },
        { id: 'Afternoon (12 PM - 4 PM)', title: 'Afternoon' },
        { id: 'Evening (4 PM - 7 PM)', title: 'Evening' },
      ]);
      break;
    }

    case 'ASK_TIME': {
      session.data.preferredTime = input;
      session.step = 'ASK_SYMPTOMS';
      await saveSession(session);

      await sendWhatsAppText(
        from,
        'Briefly describe the reason for the visit or any symptoms (or reply "skip").'
      );
      break;
    }

    case 'ASK_SYMPTOMS': {
      session.data.symptoms = /^skip$/i.test(input) ? 'Not provided' : input;
      session.step = 'ASK_INSURANCE';
      await saveSession(session);

      await sendWhatsAppButtons(from, 'Do you have insurance coverage?', [
        { id: 'Yes', title: 'Yes' },
        { id: 'No', title: 'No' },
      ]);
      break;
    }

    case 'ASK_INSURANCE': {
      const hasInsurance = /^y/i.test(input) ? 'Yes' : 'No';
      const { data } = session;

      if (!data.department) {
        await Session.deleteOne({ phoneNumber: from });
        await sendWhatsAppText(
          from,
          'Your booking session was incomplete. Reply "hi" to start again.'
        );
        break;
      }

      const service = getServiceByDepartment(data.department);

      const appointment = await Appointment.create({
        patientName: data.patientName,
        phoneNumber: from,
        patientType: data.patientType,
        department: data.department,
        assignedDoctor: null,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        symptoms: data.symptoms,
        hasInsurance,
        status: 'Confirmed',
        price: service?.price ?? 0,
      });

      // Conversation finished — remove the session so a future message
      // starts a fresh booking rather than resuming ASK_INSURANCE.
      await Session.deleteOne({ phoneNumber: from });

      await sendWhatsAppText(
        from,
        `✅ Booking confirmed!\n\n` +
          `Patient: ${appointment.patientName}\n` +
          `Department: ${appointment.department}\n` +
          `Date: ${appointment.preferredDate}\n` +
          `Time: ${appointment.preferredTime}\n\n` +
          `Our staff will assign a doctor and reach out if anything changes. Reply "restart" any time to book another appointment.`
      );
      break;
    }

    default: {
      await Session.deleteOne({ phoneNumber: from });
      await sendWhatsAppText(from, 'Reply "hi" to start a new booking.');
    }
  }
}
