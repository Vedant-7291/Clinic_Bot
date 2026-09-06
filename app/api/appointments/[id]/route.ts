import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '../../../../models/Appointments';

// PATCH /api/appointments/:id — used by the dashboard to mark an
// appointment Completed/Cancelled or to assign a doctor.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
   const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();

    const allowedUpdates: Record<string, unknown> = {};
    if (body.status) allowedUpdates.status = body.status;
    if (body.assignedDoctor !== undefined)
      allowedUpdates.assignedDoctor = body.assignedDoctor;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      allowedUpdates,
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('PATCH /api/appointments/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Appointment.findByIdAndDelete(params.id);
    return NextResponse.json({ status: 'deleted' });
  } catch (error) {
    console.error('DELETE /api/appointments/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
