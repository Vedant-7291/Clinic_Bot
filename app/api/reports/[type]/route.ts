import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '../../../../models/Appointments';
import ReportLog from '@/models/ReportLog';
import { REPORT_DEFINITIONS, buildReportCsv } from '@/lib/reports';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    await connectDB();

    const { type } = await params;
    const def = REPORT_DEFINITIONS.find((d) => d.id === type);
    if (!def) {
      return NextResponse.json({ error: 'Unknown report type' }, { status: 404 });
    }

    const appointments = await Appointment.find({}).lean();
    const csv = buildReportCsv(def.id, appointments as any);

    await ReportLog.findOneAndUpdate(
      { reportId: def.id },
      { $inc: { downloadCount: 1 }, $set: { lastGeneratedAt: new Date() } },
      { upsert: true }
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${def.filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/reports/[type] error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
