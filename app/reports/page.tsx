'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  MessageCircle,
  Users,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

// ============================================
// The report *list* below is still a static catalog of downloadable report
// types (generating actual PDFs/CSVs is a separate build-out). The quick
// stats strip, however, is now live — pulled from /api/reports/stats,
// which aggregates real bookings out of MongoDB.
// ============================================
const reports = [
  {
    id: '1',
    title: 'WhatsApp Booking Report',
    description: 'Every appointment booked through the bot, with patient type and status',
    date: '2026-08-29',
    type: 'Bookings',
    downloads: 45,
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Department Demand Report',
    description: 'Which departments patients are requesting most via WhatsApp',
    date: '2026-08-25',
    type: 'Bookings',
    downloads: 32,
    size: '1.8 MB',
  },
  {
    id: '3',
    title: 'Insurance Coverage Report',
    description: 'Share of bookings made with vs. without insurance, by department',
    date: '2026-08-22',
    type: 'Insurance',
    downloads: 28,
    size: '1.1 MB',
  },
  {
    id: '4',
    title: 'Monthly Revenue Report',
    description: 'Detailed breakdown of revenue by department',
    date: '2026-08-01',
    type: 'Financial',
    downloads: 19,
    size: '2.7 MB',
  },
];

const reportTypes = ['All Types', 'Bookings', 'Insurance', 'Financial'];

interface Stats {
  totalBookings: number;
  newPatients30d: number;
  insuredPercent: number;
}

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      try {
        const res = await fetch('/api/reports/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load stats');
        const data: Stats = await res.json();
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setIsLoadingStats(false);
      }
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickStats = [
    {
      label: 'Bookings via WhatsApp',
      value: stats?.totalBookings ?? '—',
      icon: MessageCircle,
    },
    {
      label: 'New Patients (30d)',
      value: stats?.newPatients30d ?? '—',
      icon: Users,
    },
    {
      label: 'Insured Bookings',
      value: stats ? `${stats.insuredPercent}%` : '—',
      icon: ShieldCheck,
    },
  ];

  const filteredReports =
    typeFilter === 'All Types' ? reports : reports.filter((r) => r.type === typeFilter);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage clinic reports</p>
        </div>
        <button className="mt-4 lg:mt-0 btn-accent flex items-center gap-2">
          <FileText size={18} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Icon size={14} />
                    {stat.label}
                  </div>
                  {isLoadingStats ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-2xl font-bold text-[#0A1628]">{stat.value}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              {reportTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-2">
              <Download size={16} />
              Export All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header">Report</th>
                <th className="table-header hidden md:table-cell">Type</th>
                <th className="table-header hidden lg:table-cell">Date</th>
                <th className="table-header hidden sm:table-cell">Downloads</th>
                <th className="table-header hidden lg:table-cell">Size</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-[#0A1628]">{report.title}</p>
                      <p className="text-xs text-gray-500">{report.description}</p>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="px-2 py-1 bg-[#0A1628] text-white text-xs rounded-lg">
                      {report.type}
                    </span>
                  </td>
                  <td className="table-cell hidden lg:table-cell">{report.date}</td>
                  <td className="table-cell hidden sm:table-cell">{report.downloads}</td>
                  <td className="table-cell hidden lg:table-cell">{report.size}</td>
                  <td className="table-cell text-center">
                    <button className="p-2 bg-[#1A3A5C] text-white rounded-lg hover:bg-[#2A5A8C] transition-colors inline-flex items-center gap-1">
                      <Download size={16} />
                      <span className="text-xs hidden sm:inline">Download</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No reports under {typeFilter}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
