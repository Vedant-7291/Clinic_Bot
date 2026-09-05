'use client';

import { useState } from 'react';
import {
  DollarSign,
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Smile,
  Ear,
  Sparkles,
  Venus,
  TrendingUp,
  Filter,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Search,
} from 'lucide-react';

// ============================================
// Services map 1:1 onto the department list the WhatsApp bot offers
// (see DEPARTMENTS in the booking webhook). "Other / Not sure" isn't
// a billable service, so it's excluded here.
// ============================================
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;

}

interface Patient {
  id: string;
  name: string;
  service: string;
  category: string;
  date: string;
  time: string;
  status: 'attended' | 'pending';
  price: number;
}

const services: Service[] = [
  {
    id: '1',
    name: 'General Medicine Consultation',
    description: 'Standard consultation with a general physician',
    price: 150,
    category: 'General Medicine',
  },
  {
    id: '2',
    name: 'Dental Checkup & Cleaning',
    description: 'Routine oral exam, cleaning, and cavity check',
    price: 120,
    category: 'Dental Care',
  },
  {
    id: '3',
    name: 'Pediatric Visit',
    description: "Children's health examination and consultation",
    price: 180,
    category: 'Pediatrics',
  },
  {
    id: '4',
    name: 'Cardiology Checkup',
    description: 'Comprehensive heart health evaluation',
    price: 350,
    category: 'Cardiology',
  },
  {
    id: '5',
    name: 'Orthopedic Consultation',
    description: 'Musculoskeletal system evaluation',
    price: 300,
    category: 'Orthopedics',
  },
  {
    id: '6',
    name: 'Gynecology Consultation',
    description: "Women's health exam and consultation",
    price: 220,
    category: 'Gynecology',
  },
  {
    id: '7',
    name: 'ENT Consultation',
    description: 'Ear, nose, and throat evaluation',
    price: 200,
    category: 'ENT',
  },
  {
    id: '8',
    name: 'Dermatology Consultation',
    description: 'Skin, hair, and nail health assessment',
    price: 250,
    category: 'Dermatology',
  },
];

// Sample patient data
const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    service: 'General Medicine Consultation',
    category: 'General Medicine',
    date: '2026-09-05',
    time: '09:30 AM',
    status: 'attended',
    price: 150,
  },
  {
    id: '2',
    name: 'Michael Chen',
    service: 'Dental Checkup & Cleaning',
    category: 'Dental Care',
    date: '2026-09-05',
    time: '10:15 AM',
    status: 'pending',
    price: 120,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    service: 'Pediatric Visit',
    category: 'Pediatrics',
    date: '2026-09-05',
    time: '11:00 AM',
    status: 'attended',
    price: 180,
  },
  {
    id: '4',
    name: 'David Kim',
    service: 'Cardiology Checkup',
    category: 'Cardiology',
    date: '2026-09-05',
    time: '01:30 PM',
    status: 'pending',
    price: 350,
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    service: 'Orthopedic Consultation',
    category: 'Orthopedics',
    date: '2026-09-06',
    time: '09:00 AM',
    status: 'pending',
    price: 300,
  },
  {
    id: '6',
    name: 'James Wilson',
    service: 'Gynecology Consultation',
    category: 'Gynecology',
    date: '2026-09-06',
    time: '10:45 AM',
    status: 'attended',
    price: 220,
  },
  {
    id: '7',
    name: 'Maria Garcia',
    service: 'ENT Consultation',
    category: 'ENT',
    date: '2026-09-06',
    time: '02:00 PM',
    status: 'attended',
    price: 200,
  },
  {
    id: '8',
    name: 'Robert Taylor',
    service: 'Dermatology Consultation',
    category: 'Dermatology',
    date: '2026-09-07',
    time: '09:30 AM',
    status: 'pending',
    price: 250,
  },
];

const categories = [
  'All',
  'General Medicine',
  'Dental Care',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Gynecology',
  'ENT',
  'Dermatology',
];

export default function PricePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [statusFilter, setStatusFilter] = useState<'all' | 'attended' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredServices =
    activeCategory === 'All' ? services : services.filter((s) => s.category === activeCategory);

  // Filter patients based on status and search
  const filteredPatients = patients.filter((patient) => {
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    return status === 'attended' ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'attended' ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        Attended
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
        Pending
      </span>
    );
  };

  // Statistics
  const totalPatients = patients.length;
  const attendedCount = patients.filter(p => p.status === 'attended').length;
  const pendingCount = patients.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Patient Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track and manage patient appointments by department
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-[#0A1628] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">Total Patients</p>
              <p className="text-2xl font-bold">{totalPatients}</p>
            </div>
            <div className="w-10 h-10 bg-[#1A3A5C] rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
        </div>
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Attended</p>
              <p className="text-2xl font-bold text-green-800">{attendedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              category === activeCategory
                ? 'bg-[#0A1628] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Services Grid */}

      {/* Patient Table Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0A1628]">Patient Appointments</h2>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1628] focus:border-transparent w-48 md:w-64"
              />
            </div>

            {/* Filter Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
                {statusFilter !== 'all' && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      statusFilter === 'all' ? 'bg-blue-50 text-[#0A1628] font-medium' : 'text-gray-700'
                    }`}
                  >
                    All Patients
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('attended');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      statusFilter === 'attended' ? 'bg-blue-50 text-[#0A1628] font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Attended
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      statusFilter === 'pending' ? 'bg-blue-50 text-[#0A1628] font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      Pending
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A1628] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-16">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-[200px]">Patient Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-[120px]">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-[110px]">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-[130px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0A1628]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0A1628] text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="truncate">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]">
                      {patient.service}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {patient.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {patient.time}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(patient.status)}
                        {getStatusBadge(patient.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No patients found with the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}