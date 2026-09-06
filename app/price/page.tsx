'use client';

import { useState } from 'react';
import {
  IndianRupee,
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Smile,
  Ear,
  Sparkles,
  Venus,
  TrendingUp,
  Check,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  icon: LucideIcon;
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'General Medicine Consultation',
    description: 'Standard consultation with a general physician',
    price: 150,
    category: 'General Medicine',
    icon: Stethoscope,
  },
  {
    id: '2',
    name: 'Dental Checkup & Cleaning',
    description: 'Routine oral exam, cleaning, and cavity check',
    price: 120,
    category: 'Dental Care',
    icon: Smile,
  },
  {
    id: '3',
    name: 'Pediatric Visit',
    description: "Children's health examination and consultation",
    price: 180,
    category: 'Pediatrics',
    icon: Baby,
  },
  {
    id: '4',
    name: 'Cardiology Checkup',
    description: 'Comprehensive heart health evaluation',
    price: 350,
    category: 'Cardiology',
    icon: Heart,
  },
  {
    id: '5',
    name: 'Orthopedic Consultation',
    description: 'Musculoskeletal system evaluation',
    price: 300,
    category: 'Orthopedics',
    icon: Activity,
  },
  {
    id: '6',
    name: 'Gynecology Consultation',
    description: "Women's health exam and consultation",
    price: 220,
    category: 'Gynecology',
    icon: Venus,
  },
  {
    id: '7',
    name: 'ENT Consultation',
    description: 'Ear, nose, and throat evaluation',
    price: 200,
    category: 'ENT',
    icon: Ear,
  },
  {
    id: '8',
    name: 'Dermatology Consultation',
    description: 'Skin, hair, and nail health assessment',
    price: 250,
    category: 'Dermatology',
    icon: Sparkles,
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

const iconMap: Record<string, LucideIcon> = {
  'General Medicine': Stethoscope,
  'Dental Care': Smile,
  Pediatrics: Baby,
  Cardiology: Heart,
  Orthopedics: Activity,
  Gynecology: Venus,
  ENT: Ear,
  Dermatology: Sparkles,
};

export default function PricePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
    category: categories[0],
    icon: Stethoscope,
  });

  const filteredServices =
    activeCategory === 'All' ? services : services.filter((s) => s.category === activeCategory);

  const handleEditClick = (service: Service) => {
    setEditingId(service.id);
    setEditPrice(service.price.toString());
  };

  const handleSavePrice = (id: string) => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      setServices(services.map(service =>
        service.id === id ? { ...service, price: newPrice } : service
      ));
      setEditingId(null);
      setEditPrice('');
    } else {
      alert('Please enter a valid price (positive number)');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSavePrice(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price && newService.category) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        price: newService.price,
        category: newService.category,
        icon: iconMap[newService.category] || Stethoscope,
      };
      setServices([...services, service]);
      setShowAddModal(false);
      setNewService({
        name: '',
        description: '',
        price: 0,
        category: categories[0],
        icon: Stethoscope,
      });
    } else {
      alert('Please fill in all required fields (Name, Description, Price, Category)');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Pricing</h1>
          <p className="text-gray-500 text-sm mt-1">
            Service prices by department — matches the options patients see when booking on WhatsApp
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 lg:mt-0 btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Pricing
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          const isEditing = editingId === service.id;

          return (
            <div key={service.id} className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#0A1628] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-[#1A3A5C] bg-blue-50 px-2 py-1 rounded-lg">
                  {service.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[#0A1628] mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{service.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Starting at</p>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, service.id)}
                        className="w-24 px-2 py-1 text-2xl font-bold text-[#0A1628] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1628] focus:border-transparent"
                        min="0"
                        step="0.01"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#0A1628]">₹{service.price}</p>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSavePrice(service.id)}
                      className="btn-primary text-sm flex items-center gap-1 px-3 py-2"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm flex items-center gap-1 px-3 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(service)}
                    className="bg-black text-[#fdfdfd] hover:bg-blue-600 text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    <TrendingUp size={16} />
                    Change Pricing
                  </button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDeleteClick(service)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete Service
                </button>
              </div>
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No services listed under {activeCategory}.
          </div>
        )}
      </div>

      <div className="mt-8 card p-6 bg-[#0A1628] text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#1A3A5C] rounded-lg flex items-center justify-center flex-shrink-0">
            <IndianRupee size={24} className="text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Insurance Information</h3>
            <p className="text-[#94A3B8] text-sm">
              We accept most major health insurance plans. Patients confirm whether they have
              insurance during WhatsApp booking — if you need help verifying coverage, contact
              the billing department at (555) 123-4567.
            </p>
          </div>
        </div>
      </div>

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
                Are you sure you want to delete <span className="font-semibold">{serviceToDelete?.name}</span>?
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

      {/* Add Pricing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0A1628]">Add New Service</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="e.g., General Medicine Consultation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="Brief description of the service"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={newService.price || ''}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={newService.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    setNewService({ 
                      ...newService, 
                      category,
                      icon: iconMap[category] || Stethoscope
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                >
                  {categories.filter(c => c !== 'All').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                <p>* Required fields</p>
                <p className="mt-1">The icon will be automatically assigned based on the selected category.</p>
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
                onClick={handleAddService}
                className="flex-1 px-4 py-2 bg-[#0A1628] hover:bg-[#1A3A5C] text-white rounded-lg transition-colors"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}