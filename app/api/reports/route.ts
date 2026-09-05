import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '../../../models/Appointments';
import ReportLog from '@/models/ReportLog';
import { REPORT_DEFINITIONS, buildReportCsv, formatBytes } from '@/lib/reports';

// Returns the report catalog with fields computed live from real data:
// - size: actual byte size of the CSV as of right now
// - downloads: real count, incremented each time someone hits
//   /api/reports/[type] (the download endpoint)
// - date: when this report type was last actually downloaded/generated
//   (null / "Not generated yet" if nobody has downloaded it)
export async function GET() {
  try {
    await connectDB();

    const appointments = await Appointment.find({}).lean();
    const logs = await ReportLog.find({});
    const logById = new Map(logs.map((l) => [l.reportId, l]));

    const reports = REPORT_DEFINITIONS.map((def) => {
      const csv = buildReportCsv(def.id, appointments as any);
      const log = logById.get(def.id);
      return {
        id: def.id,
        title: def.title,
        description: def.description,
        type: def.type,
        size: formatBytes(Buffer.byteLength(csv, 'utf-8')),
        downloads: log?.downloadCount ?? 0,
        date: log?.lastGeneratedAt
          ? new Date(log.lastGeneratedAt).toISOString().slice(0, 10)
          : null,
      };
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 });
  }
}
