import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '../../../../models/Appointments';

export async function GET() {
  try {
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalBookings, newPatients30d, insuredCount, totalCount] =
      await Promise.all([
        Appointment.countDocuments({}),
        Appointment.countDocuments({
          patientType: 'New Patient',
          createdAt: { $gte: thirtyDaysAgo },
        }),
        Appointment.countDocuments({ hasInsurance: 'Yes' }),
        Appointment.countDocuments({}),
      ]);

    const insuredPercent =
      totalCount > 0 ? Math.round((insuredCount / totalCount) * 100) : 0;

    const byDepartment = await Appointment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      totalBookings,
      newPatients30d,
      insuredPercent,
      byDepartment: byDepartment.map((d) => ({
        department: d._id,
        count: d.count,
      })),
    });
  } catch (error) {
    console.error('GET /api/reports/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to compute stats' },
      { status: 500 }
    );
  }
}
