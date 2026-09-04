'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CircleDot,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  ShieldCheck,
  ShieldOff,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';

// ============================================
// Every field below comes straight out of AppointmentData in the WhatsApp
// webhook (patientType, patientName, department, preferredDate,
// preferredTime, symptoms, hasInsurance) plus phoneNumber as the record
// key. "Assigned Doctor" is the one addition — staff pick this after a
// booking comes in, since the bot itself doesn't assign a doctor.
// ============================================
interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  patientType: 'New Patient' | 'Returning Patient';
  department: string;
  assignedDoctor: string | null;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  hasInsurance: 'Yes' | 'No';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

const appointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Robert Anderson',
    phoneNumber: '+91 98765 43210',
    patientType: 'Returning Patient',
    department: 'Cardiology',
    assignedDoctor: 'Dr. Sarah Johnson',
    preferredDate: '2026-08-25',
    preferredTime: 'Morning (9 AM - 12 PM)',
    symptoms: 'Occasional chest tightness after exercise',
    hasInsurance: 'Yes',
    status: 'Confirmed',
  },
  {
    id: '2',
    patientName: 'Emma Wilson',
    phoneNumber: '+91 91234 56780',
    patientType: 'New Patient',
    department: 'Pediatrics',
    assignedDoctor: 'Dr. Emily Davis',
    preferredDate: '2026-08-20',
    preferredTime: 'Morning (9 AM - 12 PM)',
    symptoms: 'Persistent cough, mild fever for 2 days',
    hasInsurance: 'No',
    status: 'Confirmed',
  },
  {
    id: '3',
    patientName: 'James Thompson',
    phoneNumber: '+91 90000 11223',
    patientType: 'Returning Patient',
    department: 'Orthopedics',
    assignedDoctor: null,
    preferredDate: '2026-09-01',
    preferredTime: 'Evening (4 PM - 7 PM)',
    symptoms: 'Lower back pain, worsens when sitting',
    hasInsurance: 'Yes',
    status: 'Confirmed',
  },
  {
    id: '4',
    patientName: 'Olivia Martinez',
    phoneNumber: '+91 99887 76655',
    patientType: 'New Patient',
    department: 'Dermatology',
    assignedDoctor: null,
    preferredDate: '2026-08-30',
    preferredTime: 'Afternoon (12 PM - 4 PM)',
    symptoms: 'Not provided',
    hasInsurance: 'No',
    status: 'Confirmed',
  },
  {
    id: '5',
    patientName: 'William Chen',
    phoneNumber: '+91 93456 12780',
    patientType: 'Returning Patient',
    department: 'ENT',
    assignedDoctor: 'Dr. Michael Chen',
    preferredDate: '2026-06-15',
    preferredTime: 'Morning (9 AM - 12 PM)',
    symptoms: 'Recurring ear discomfort',
    hasInsurance: 'Yes',
    status: 'Completed',
  },
  {
    id: '6',
    patientName: 'Priya Nair',
    phoneNumber: '+91 98123 44556',
    patientType: 'New Patient',
    department: 'Gynecology',
    assignedDoctor: null,
    preferredDate: '2026-08-19',
    preferredTime: 'Afternoon (12 PM - 4 PM)',
    symptoms: 'Annual checkup',
    hasInsurance: 'Yes',
    status: 'Cancelled',
  },
];

function statusStyle(status: Appointment['status']) {
  switch (status) {
    case 'Confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
  }
}

function statusIcon(status: Appointment['status']) {
  switch (status) {
    case 'Confirmed':
      return <CircleDot size={14} />;
    case 'Completed':
      return <CheckCircle2 size={14} />;
    case 'Cancelled':
      return <XCircle size={14} />;
  }
}

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.phoneNumber.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''));
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
            <MessageCircle size={14} className="text-green-600" />
            Bookings confirmed through the WhatsApp assistant
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient name or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {paginatedAppointments.map((appt) => (
          <div key={appt.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {appt.patientName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#0A1628]">{appt.patientName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        appt.patientType === 'New Patient'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {appt.patientType}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {appt.phoneNumber}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[#1A3A5C] font-medium flex items-center gap-1">
                      <Stethoscope size={12} /> {appt.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {appt.assignedDoctor ? (
                      <>Assigned to <span className="text-gray-700 font-medium">{appt.assignedDoctor}</span></>
                    ) : (
                      <span className="text-orange-600 font-medium">Doctor not yet assigned</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 max-w-md">
                    <span className="text-gray-400">Reason for visit:</span> {appt.symptoms}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{appt.preferredDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{appt.preferredTime}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusStyle(
                      appt.status
                    )}`}
                  >
                    {statusIcon(appt.status)}
                    {appt.status}
                  </span>
                  {appt.hasInsurance === 'Yes' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700">
                      <ShieldCheck size={12} /> Insured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                      <ShieldOff size={12} /> No insurance
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {paginatedAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500 card">
            No appointments match your filters.
          </div>
        )}
      </div>

      {filteredAppointments.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of{' '}
            {filteredAppointments.length} appointments
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === i + 1 ? 'bg-[#0A1628] text-white' : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}