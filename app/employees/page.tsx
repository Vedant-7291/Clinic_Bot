'use client';

import { useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  Users,
  Heart,
  Baby,
  Activity,
  Smile,
  Ear,
  Sparkles,
  Venus,
  Stethoscope,
  MoreVertical,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
}

// ============================================
// One staff member covering each department the WhatsApp bot lets
// patients book into, so every booking has somewhere to route to.
// ============================================
const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Anil Kapoor',
    role: 'General Physician',
    department: 'General Medicine',
    email: 'anil.kapoor@clinic.com',
    phone: '+1 (555) 111-2233',
    specialization: 'Family & Internal Medicine',
  },
  {
    id: '2',
    name: 'Dr. Neha Verma',
    role: 'Dentist',
    department: 'Dental Care',
    email: 'neha.verma@clinic.com',
    phone: '+1 (555) 222-3344',
    specialization: 'General & Cosmetic Dentistry',
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    role: 'Pediatrician',
    department: 'Pediatrics',
    email: 'emily.davis@clinic.com',
    phone: '+1 (555) 345-6789',
    specialization: 'General Pediatrics',
  },
  {
    id: '4',
    name: 'Dr. Sarah Johnson',
    role: 'Senior Physician',
    department: 'Cardiology',
    email: 'sarah.johnson@clinic.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Interventional Cardiology',
  },
  {
    id: '5',
    name: 'Dr. James Wilson',
    role: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    email: 'james.wilson@clinic.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Sports Medicine',
  },
  {
    id: '6',
    name: 'Dr. Maria Garcia',
    role: 'Gynecologist',
    department: 'Gynecology',
    email: 'maria.garcia@clinic.com',
    phone: '+1 (555) 567-8901',
    specialization: "Women's Health",
  },
  {
    id: '7',
    name: 'Dr. Michael Chen',
    role: 'ENT Specialist',
    department: 'ENT',
    email: 'michael.chen@clinic.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Ear, Nose & Throat Surgery',
  },
  {
    id: '8',
    name: 'Dr. Ritu Malhotra',
    role: 'Dermatologist',
    department: 'Dermatology',
    email: 'ritu.malhotra@clinic.com',
    phone: '+1 (555) 678-9012',
    specialization: 'Medical & Cosmetic Dermatology',
  },
];

const departments = [
  'All Staff',
  'General Medicine',
  'Dental Care',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Gynecology',
  'ENT',
  'Dermatology',
];

const departmentIcons: Record<string, any> = {
  'General Medicine': Stethoscope,
  'Dental Care': Smile,
  Pediatrics: Baby,
  Cardiology: Heart,
  Orthopedics: Activity,
  Gynecology: Venus,
  ENT: Ear,
  Dermatology: Sparkles,
};

function getDepartmentIcon(dept: string) {
  return departmentIcons[dept] || User;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedDepartment, setSelectedDepartment] = useState('All Staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: departments[0],
    email: '',
    phone: '',
    specialization: '',
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = selectedDepartment === 'All Staff' || emp.department === selectedDepartment;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.department) {
      const employee: Employee = {
        id: Date.now().toString(),
        name: newEmployee.name,
        role: newEmployee.role,
        department: newEmployee.department || departments[0],
        email: newEmployee.email || '',
        phone: newEmployee.phone || '',
        specialization: newEmployee.specialization || '',
      };
      setEmployees([...employees, employee]);
      setShowAddModal(false);
      setNewEmployee({
        name: '',
        role: '',
        department: departments[0],
        email: '',
        phone: '',
        specialization: '',
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Staff Directory</h1>
          <p className="text-gray-500 text-sm mt-1">
            One doctor per department offered in the WhatsApp booking flow
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 lg:mt-0 btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {departments.map((dept) => {
          const isActive = selectedDepartment === dept;
          const Icon = dept === 'All Staff' ? Users : getDepartmentIcon(dept);
          return (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`
                px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium
                ${
                  isActive
                    ? 'bg-[#0A1628] text-white shadow-lg'
                    : 'bg-white text-[#0A1628] border border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={16} />
              {dept}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const DeptIcon = getDepartmentIcon(employee.department);
          return (
            <div key={employee.id} className="card p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0A1628] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {employee.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0A1628]">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DeptIcon size={14} className="text-[#1A3A5C]" />
                      <span className="text-xs text-[#1A3A5C] font-medium">{employee.department}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="mt-4 space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full flex-shrink-0" />
                  <span className="text-xs text-gray-500">{employee.specialization}</span>
                </div>
              </div>

              {/* Updated Action Buttons Section - Side by Side */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="flex-1 btn-primary text-sm flex items-center justify-center gap-2 py-2.5">
                    <Calendar size={14} />
                    Schedule
                  </button>
                  <button
                    onClick={() => handleDeleteClick(employee)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No staff members found matching your criteria</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0A1628]">Confirm Delete</h3>
              <button
                onClick={cancelDelete}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{employeeToDelete?.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0A1628]">Add New Employee</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="e.g., General Physician"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                >
                  {departments.filter(d => d !== 'All Staff').map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="email@clinic.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={newEmployee.specialization}
                  onChange={(e) => setNewEmployee({ ...newEmployee, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="e.g., Family & Internal Medicine"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-[#0A1628] hover:bg-[#1A3A5C] text-white rounded-lg transition-colors"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}