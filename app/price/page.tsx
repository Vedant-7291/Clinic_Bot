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
  icon: any;
}

const services: Service[] = [
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

export default function PricePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredServices =
    activeCategory === 'All' ? services : services.filter((s) => s.category === activeCategory);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Pricing</h1>
        <p className="text-gray-500 text-sm mt-1">
          Service prices by department — matches the options patients see when booking on WhatsApp
        </p>
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
                  <p className="text-2xl font-bold text-[#0A1628]">${service.price}</p>
                </div>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <TrendingUp size={16} />
                  Book Now
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
            <DollarSign size={24} className="text-[#3B82F6]" />
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
    </div>
  );
}