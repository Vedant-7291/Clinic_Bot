import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Appointment from '../../../models/Appointments';

// GET /api/appointments — list every appointment, newest first.
// Supports optional ?status=Confirmed|Completed|Cancelled and
// ?department=Cardiology query filters used by the dashboard.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const department = searchParams.get('department');

    const filter: Record<string, string> = {};
    if (status && status !== 'all') filter.status = status;
    if (department && department !== 'All') filter.department = department;

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('GET /api/appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments — lets staff create a walk-in/phone booking
// directly from the dashboard (not just via WhatsApp).
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const appointment = await Appointment.create({
      patientName: body.patientName,
      phoneNumber: body.phoneNumber,
      patientType: body.patientType ?? 'New Patient',
      department: body.department,
      assignedDoctor: body.assignedDoctor ?? null,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      symptoms: body.symptoms ?? 'Not provided',
      hasInsurance: body.hasInsurance ?? 'No',
      status: body.status ?? 'Confirmed',
      price: body.price ?? 0,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
