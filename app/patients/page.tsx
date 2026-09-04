'use client';

import { useState } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Calendar,
  Clock,
  Stethoscope,
  ShieldCheck,
  ShieldOff,
  MessageCircle,
  Users,
  UserPlus,
} from 'lucide-react';

// ============================================
// DATA MODEL — mirrors AppointmentData in the WhatsApp webhook exactly.
// A "patient" here is every phone number the bot has taken a booking from,
// grouped together with each of their confirmed appointments.
// ============================================
interface BotAppointment {
  id: string;
  department: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  hasInsurance: 'Yes' | 'No';
  createdAt: string;
}

interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  patientType: 'New Patient' | 'Returning Patient';
  appointments: BotAppointment[];
}

const patients: Patient[] = [
  {
    id: '1',
    name: 'Robert Anderson',
    phoneNumber: '+91 98765 43210',
    patientType: 'Returning Patient',
    appointments: [
      {
        id: 'a1',
        department: 'Cardiology',
        preferredDate: '2026-08-25',
        preferredTime: 'Morning (9 AM - 12 PM)',
        symptoms: 'Occasional chest tightness after exercise',
        hasInsurance: 'Yes',
        createdAt: '2026-08-18T09:12:00Z',
      },
      {
        id: 'a0',
        department: 'Cardiology',
        preferredDate: '2026-06-02',
        preferredTime: 'Afternoon (12 PM - 4 PM)',
        symptoms: 'Routine follow-up',
        hasInsurance: 'Yes',
        createdAt: '2026-05-28T11:40:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Emma Wilson',
    phoneNumber: '+91 91234 56780',
    patientType: 'New Patient',
    appointments: [
      {
        id: 'a2',
        department: 'Pediatrics',
        preferredDate: '2026-08-20',
        preferredTime: 'Morning (9 AM - 12 PM)',
        symptoms: 'Persistent cough, mild fever for 2 days',
        hasInsurance: 'No',
        createdAt: '2026-08-17T14:05:00Z',
      },
    ],
  },
  {
    id: '3',
    name: 'James Thompson',
    phoneNumber: '+91 90000 11223',
    patientType: 'Returning Patient',
    appointments: [
      {
        id: 'a3',
        department: 'Orthopedics',
        preferredDate: '2026-09-01',
        preferredTime: 'Evening (4 PM - 7 PM)',
        symptoms: 'Lower back pain, worsens when sitting',
        hasInsurance: 'Yes',
        createdAt: '2026-08-15T08:30:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Olivia Martinez',
    phoneNumber: '+91 99887 76655',
    patientType: 'New Patient',
    appointments: [
      {
        id: 'a4',
        department: 'Dermatology',
        preferredDate: '2026-08-30',
        preferredTime: 'Afternoon (12 PM - 4 PM)',
        symptoms: 'Not provided',
        hasInsurance: 'No',
        createdAt: '2026-08-19T16:22:00Z',
      },
    ],
  },
  {
    id: '5',
    name: 'William Chen',
    phoneNumber: '+91 93456 12780',
    patientType: 'Returning Patient',
    appointments: [
      {
        id: 'a5',
        department: 'ENT',
        preferredDate: '2026-06-15',
        preferredTime: 'Morning (9 AM - 12 PM)',
        symptoms: 'Recurring ear discomfort',
        hasInsurance: 'Yes',
        createdAt: '2026-06-10T10:00:00Z',
      },
    ],
  },
  {
    id: '6',
    name: 'Priya Nair',
    phoneNumber: '+91 98123 44556',
    patientType: 'New Patient',
    appointments: [
      {
        id: 'a6',
        department: 'Gynecology',
        preferredDate: '2026-09-03',
        preferredTime: 'Morning (9 AM - 12 PM)',
        symptoms: 'Annual checkup',
        hasInsurance: 'Yes',
        createdAt: '2026-08-21T12:10:00Z',
      },
    ],
  },
];

function latestAppointment(p: Patient): BotAppointment {
  return [...p.appointments].sort(
    (a, b) => new Date(b.preferredDate).getTime() - new Date(a.preferredDate).getTime()
  )[0];
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phoneNumber.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''))
  );

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const totalPatients = patients.length;
  const newPatients = patients.filter((p) => p.patientType === 'New Patient').length;
  const withInsurance = patients.filter((p) => latestAppointment(p).hasInsurance === 'Yes').length;
  const insuranceRate = totalPatients ? Math.round((withInsurance / totalPatients) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Patients</h1>
          <p className="text-gray-500 text-sm mt-1">
            Everyone who has booked with the clinic through WhatsApp
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
            <Users size={14} /> Total Patients
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">{totalPatients}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
            <UserPlus size={14} /> New Patients
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">{newPatients}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
            <ShieldCheck size={14} /> With Insurance
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">{insuranceRate}%</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
            <MessageCircle size={14} /> Booked via WhatsApp
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">100%</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or phone number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header">Patient</th>
                <th className="table-header hidden md:table-cell">Type</th>
                <th className="table-header hidden lg:table-cell">Department</th>
                <th className="table-header hidden lg:table-cell">Next / Last Visit</th>
                <th className="table-header hidden sm:table-cell">Insurance</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient) => {
                const latest = latestAppointment(patient);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {initials(patient.name)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0A1628]">{patient.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone size={11} /> {patient.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.patientType === 'New Patient'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {patient.patientType}
                      </span>
                    </td>
                    <td className="table-cell hidden lg:table-cell">{latest.department}</td>
                    <td className="table-cell hidden lg:table-cell">
                      <p className="text-sm">{latest.preferredDate}</p>
                      <p className="text-xs text-gray-400">{latest.preferredTime}</p>
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      {latest.hasInsurance === 'Yes' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                          <ShieldCheck size={12} /> Insured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          <ShieldOff size={12} /> None
                        </span>
                      )}
                    </td>
                    <td className="table-cell text-center">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="p-2 bg-[#0A1628] text-white rounded-lg hover:bg-[#1A3A5C] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span className="text-xs hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No patients match &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPatients.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of{' '}
              {filteredPatients.length} patients
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

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {initials(selectedPatient.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1628]">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedPatient.patientType === 'New Patient'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedPatient.patientType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <MessageCircle size={11} /> WhatsApp
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={18} className="text-[#1A3A5C]" />
                <div>
                  <p className="text-xs text-gray-500">Phone (WhatsApp)</p>
                  <p className="text-sm font-medium">{selectedPatient.phoneNumber}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#0A1628] mb-3 flex items-center gap-2">
                  <Stethoscope size={18} className="text-[#1A3A5C]" />
                  Appointment History ({selectedPatient.appointments.length})
                </h3>
                <div className="space-y-3">
                  {selectedPatient.appointments
                    .slice()
                    .sort((a, b) => new Date(b.preferredDate).getTime() - new Date(a.preferredDate).getTime())
                    .map((appt) => (
                      <div key={appt.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-medium text-[#0A1628]">{appt.department}</span>
                          {appt.hasInsurance === 'Yes' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                              <ShieldCheck size={12} /> Insured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              <ShieldOff size={12} /> No insurance
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-400" /> {appt.preferredDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-400" /> {appt.preferredTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="text-gray-400">Reason for visit:</span> {appt.symptoms}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}