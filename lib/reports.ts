import { IAppointment } from '../models/Appointments';

export interface ReportDefinition {
  id: 'bookings' | 'department-demand' | 'insurance' | 'revenue';
  title: string;
  description: string;
  type: 'Bookings' | 'Insurance' | 'Financial';
  filename: string;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'bookings',
    title: 'WhatsApp Booking Report',
    description: 'Every appointment booked through the bot, with patient type and status',
    type: 'Bookings',
    filename: 'whatsapp-booking-report.csv',
  },
  {
    id: 'department-demand',
    title: 'Department Demand Report',
    description: 'Which departments patients are requesting most via WhatsApp',
    type: 'Bookings',
    filename: 'department-demand-report.csv',
  },
  {
    id: 'insurance',
    title: 'Insurance Coverage Report',
    description: 'Share of bookings made with vs. without insurance, by department',
    type: 'Insurance',
    filename: 'insurance-coverage-report.csv',
  },
  {
    id: 'revenue',
    title: 'Monthly Revenue Report',
    description: 'Detailed breakdown of revenue by department',
    type: 'Financial',
    filename: 'monthly-revenue-report.csv',
  },
];

function csvEscape(value: string | number): string {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(row.map(csvEscape).join(','));
  return lines.join('\n');
}

export function buildBookingsCsv(appointments: IAppointment[]): string {
  return toCsv(
    ['Patient Name', 'Phone', 'Patient Type', 'Department', 'Assigned Doctor', 'Date', 'Time', 'Status', 'Has Insurance', 'Price'],
    appointments.map((a) => [
      a.patientName,
      a.phoneNumber,
      a.patientType,
      a.department,
      a.assignedDoctor ?? 'Unassigned',
      a.preferredDate,
      a.preferredTime,
      a.status,
      a.hasInsurance,
      a.price,
    ])
  );
}

export function buildDepartmentDemandCsv(appointments: IAppointment[]): string {
  const counts = new Map<string, number>();
  for (const a of appointments) counts.set(a.department, (counts.get(a.department) ?? 0) + 1);
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return toCsv(['Department', 'Bookings'], rows);
}

export function buildInsuranceCsv(appointments: IAppointment[]): string {
  const byDept = new Map<string, { insured: number; uninsured: number }>();
  for (const a of appointments) {
    const entry = byDept.get(a.department) ?? { insured: 0, uninsured: 0 };
    if (a.hasInsurance === 'Yes') entry.insured += 1;
    else entry.uninsured += 1;
    byDept.set(a.department, entry);
  }
  const rows = [...byDept.entries()].map(([dept, v]) => {
    const total = v.insured + v.uninsured;
    const pct = total > 0 ? Math.round((v.insured / total) * 100) : 0;
    return [dept, v.insured, v.uninsured, `${pct}%`];
  });
  return toCsv(['Department', 'Insured', 'Not Insured', 'Insured %'], rows);
}

export function buildRevenueCsv(appointments: IAppointment[]): string {
  // Only count Completed visits as recognized revenue; Confirmed is still
  // pending and Cancelled never happened.
  const byDept = new Map<string, { revenue: number; visits: number }>();
  for (const a of appointments) {
    if (a.status !== 'Completed') continue;
    const entry = byDept.get(a.department) ?? { revenue: 0, visits: 0 };
    entry.revenue += a.price ?? 0;
    entry.visits += 1;
    byDept.set(a.department, entry);
  }
  const rows = [...byDept.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([dept, v]) => [dept, v.visits, v.revenue.toFixed(2)]);
  return toCsv(['Department', 'Completed Visits', 'Revenue'], rows);
}

export function buildReportCsv(reportId: ReportDefinition['id'], appointments: IAppointment[]): string {
  switch (reportId) {
    case 'bookings':
      return buildBookingsCsv(appointments);
    case 'department-demand':
      return buildDepartmentDemandCsv(appointments);
    case 'insurance':
      return buildInsuranceCsv(appointments);
    case 'revenue':
      return buildRevenueCsv(appointments);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
