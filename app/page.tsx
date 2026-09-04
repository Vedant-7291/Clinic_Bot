'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'on-duty' | 'off-duty' | 'on-call';
}

const staffMembers: StaffMember[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Senior Physician', department: 'Cardiology', status: 'on-duty' },
  { id: '2', name: 'Dr. Michael Chen', role: 'Neurologist', department: 'Neurology', status: 'on-duty' },
  { id: '3', name: 'Dr. Emily Davis', role: 'Pediatrician', department: 'Pediatrics', status: 'on-call' },
  { id: '4', name: 'Dr. James Wilson', role: 'Orthopedic Surgeon', department: 'Orthopedics', status: 'off-duty' },
  { id: '5', name: 'Dr. Maria Garcia', role: 'Cardiologist', department: 'Cardiology', status: 'on-duty' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty': return 'bg-green-500';
      case 'off-duty': return 'bg-gray-400';
      case 'on-call': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: StaffMember['status']) => {
    switch (status) {
      case 'on-duty': return 'On Duty';
      case 'off-duty': return 'Off Duty';
      case 'on-call': return 'On Call';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">Manage appointments and staff shifts</p>
        </div>
        <button className="mt-4 lg:mt-0 btn-accent flex items-center gap-2">
          <Plus size={18} />
          New Appointment
        </button>
      </div>

     
    </div>
  );
}