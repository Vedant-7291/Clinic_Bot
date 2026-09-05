'use client';

import { useState } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Box,
  Tag,
  IndianRupee,
  Calendar,
  Filter,
  X,
} from 'lucide-react';

// ============================================
// DATA MODEL — Inventory items with stock details
// ============================================
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  supplier: string;
  expiryDate?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
  lastUpdated: string;
  createdAt: string;
}

const inventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Medications',
    description: 'Pain relief and fever reducer tablets',
    sku: 'MED-001',
    quantity: 450,
    unit: 'Tablets',
    minStock: 100,
    maxStock: 500,
    costPrice: 0.50,
    sellingPrice: 1.50,
    location: 'Pharmacy Aisle 3',
    supplier: 'MediPharm Distributors',
    expiryDate: '2027-12-31',
    status: 'In Stock',
    lastUpdated: '2026-09-04T10:30:00Z',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Surgical Gloves (Large)',
    category: 'Medical Supplies',
    description: 'Sterile latex surgical gloves, box of 100',
    sku: 'SUP-002',
    quantity: 80,
    unit: 'Boxes',
    minStock: 50,
    maxStock: 200,
    costPrice: 12.00,
    sellingPrice: 25.00,
    location: 'Storage Room B',
    supplier: 'SafeCare Supplies',
    expiryDate: '2027-06-30',
    status: 'In Stock',
    lastUpdated: '2026-09-03T14:15:00Z',
    createdAt: '2025-02-20T10:00:00Z',
  },
  {
    id: '3',
    name: 'Face Masks (Surgical)',
    category: 'Medical Supplies',
    description: 'Disposable surgical masks, pack of 50',
    sku: 'SUP-003',
    quantity: 30,
    unit: 'Packs',
    minStock: 40,
    maxStock: 150,
    costPrice: 8.00,
    sellingPrice: 15.00,
    location: 'Storage Room A',
    supplier: 'SafeCare Supplies',
    expiryDate: '2027-08-15',
    status: 'Low Stock',
    lastUpdated: '2026-09-02T09:00:00Z',
    createdAt: '2025-03-10T11:30:00Z',
  },
  {
    id: '4',
    name: 'Blood Pressure Monitor',
    category: 'Equipment',
    description: 'Digital upper arm blood pressure monitor',
    sku: 'EQP-004',
    quantity: 15,
    unit: 'Units',
    minStock: 5,
    maxStock: 30,
    costPrice: 45.00,
    sellingPrice: 89.00,
    location: 'Equipment Room',
    supplier: 'MedTech Solutions',
    lastUpdated: '2026-09-01T16:45:00Z',
    createdAt: '2025-04-05T13:00:00Z',
    status: 'In Stock',
  },
  {
    id: '5',
    name: 'Amoxicillin 250mg',
    category: 'Medications',
    description: 'Antibiotic capsules, 30 per box',
    sku: 'MED-005',
    quantity: 0,
    unit: 'Boxes',
    minStock: 20,
    maxStock: 80,
    costPrice: 15.00,
    sellingPrice: 35.00,
    location: 'Pharmacy Aisle 1',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2027-03-31',
    status: 'Out of Stock',
    lastUpdated: '2026-08-28T11:00:00Z',
    createdAt: '2025-05-12T09:00:00Z',
  },
  {
    id: '6',
    name: 'Bandages (Assorted)',
    category: 'Medical Supplies',
    description: 'Assorted adhesive bandages, box of 100',
    sku: 'SUP-006',
    quantity: 120,
    unit: 'Boxes',
    minStock: 30,
    maxStock: 100,
    costPrice: 6.00,
    sellingPrice: 12.00,
    location: 'Pharmacy Aisle 2',
    supplier: 'MediPharm Distributors',
    expiryDate: '2028-01-15',
    status: 'In Stock',
    lastUpdated: '2026-09-04T08:30:00Z',
    createdAt: '2025-06-18T14:30:00Z',
  },
  {
    id: '7',
    name: 'Stethoscope (Premium)',
    category: 'Equipment',
    description: 'Professional grade stethoscope',
    sku: 'EQP-007',
    quantity: 8,
    unit: 'Units',
    minStock: 3,
    maxStock: 15,
    costPrice: 120.00,
    sellingPrice: 250.00,
    location: 'Equipment Room',
    supplier: 'MedTech Solutions',
    lastUpdated: '2026-09-01T10:00:00Z',
    createdAt: '2025-07-22T08:15:00Z',
    status: 'In Stock',
  },
  {
    id: '8',
    name: 'Insulin Syringes',
    category: 'Medical Supplies',
    description: 'U-100 insulin syringes, box of 100',
    sku: 'SUP-008',
    quantity: 25,
    unit: 'Boxes',
    minStock: 40,
    maxStock: 120,
    costPrice: 10.00,
    sellingPrice: 22.00,
    location: 'Storage Room B',
    supplier: 'SafeCare Supplies',
    expiryDate: '2027-09-30',
    status: 'Low Stock',
    lastUpdated: '2026-08-30T13:20:00Z',
    createdAt: '2025-08-10T11:00:00Z',
  },
  {
    id: '9',
    name: 'Ibuprofen 400mg',
    category: 'Medications',
    description: 'Anti-inflammatory pain relief tablets',
    sku: 'MED-009',
    quantity: 200,
    unit: 'Tablets',
    minStock: 50,
    maxStock: 300,
    costPrice: 0.75,
    sellingPrice: 2.00,
    location: 'Pharmacy Aisle 3',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2027-11-30',
    status: 'In Stock',
    lastUpdated: '2026-09-04T09:45:00Z',
    createdAt: '2025-09-15T10:00:00Z',
  },
  {
    id: '10',
    name: 'Oxygen Masks',
    category: 'Medical Supplies',
    description: 'Adult oxygen masks with tubing',
    sku: 'SUP-010',
    quantity: 5,
    unit: 'Boxes',
    minStock: 20,
    maxStock: 60,
    costPrice: 18.00,
    sellingPrice: 40.00,
    location: 'Storage Room A',
    supplier: 'MediPharm Distributors',
    expiryDate: '2027-10-15',
    status: 'Low Stock',
    lastUpdated: '2026-08-25T15:30:00Z',
    createdAt: '2025-10-01T09:00:00Z',
  },
  {
    id: '11',
    name: 'Dental Syringe',
    category: 'Equipment',
    description: 'Dental anesthesia syringe, reusable',
    sku: 'EQP-011',
    quantity: 12,
    unit: 'Units',
    minStock: 5,
    maxStock: 20,
    costPrice: 85.00,
    sellingPrice: 180.00,
    location: 'Equipment Room',
    supplier: 'DentalTech Supplies',
    lastUpdated: '2026-08-28T12:00:00Z',
    createdAt: '2025-11-05T13:30:00Z',
    status: 'In Stock',
  },
  {
    id: '12',
    name: 'Expired Test Strips',
    category: 'Medical Supplies',
    description: 'Blood glucose test strips (EXPIRED)',
    sku: 'SUP-012',
    quantity: 45,
    unit: 'Boxes',
    minStock: 10,
    maxStock: 50,
    costPrice: 5.00,
    sellingPrice: 0.00,
    location: 'Storage Room C',
    supplier: 'SafeCare Supplies',
    expiryDate: '2025-12-31',
    status: 'Expired',
    lastUpdated: '2026-01-15T10:00:00Z',
    createdAt: '2024-12-01T08:00:00Z',
  },
  {
    id: '13',
    name: 'Loratadine 10mg',
    category: 'Medications',
    description: 'Antihistamine allergy relief tablets',
    sku: 'MED-013',
    quantity: 120,
    unit: 'Tablets',
    minStock: 30,
    maxStock: 200,
    costPrice: 1.20,
    sellingPrice: 3.00,
    location: 'Pharmacy Aisle 2',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2028-02-15',
    status: 'In Stock',
    lastUpdated: '2026-09-02T10:00:00Z',
    createdAt: '2025-10-15T09:00:00Z',
  },
  {
    id: '14',
    name: 'IV Cannula 18G',
    category: 'Medical Supplies',
    description: 'Intravenous cannula, box of 50',
    sku: 'SUP-014',
    quantity: 18,
    unit: 'Boxes',
    minStock: 25,
    maxStock: 80,
    costPrice: 22.00,
    sellingPrice: 45.00,
    location: 'Storage Room B',
    supplier: 'SafeCare Supplies',
    expiryDate: '2027-11-30',
    status: 'Low Stock',
    lastUpdated: '2026-08-29T14:30:00Z',
    createdAt: '2025-11-20T10:00:00Z',
  },
  {
    id: '15',
    name: 'ECG Electrodes',
    category: 'Medical Supplies',
    description: 'Disposable ECG electrodes, pack of 100',
    sku: 'SUP-015',
    quantity: 60,
    unit: 'Packs',
    minStock: 20,
    maxStock: 100,
    costPrice: 8.00,
    sellingPrice: 18.00,
    location: 'Storage Room A',
    supplier: 'MediPharm Distributors',
    expiryDate: '2028-03-15',
    status: 'In Stock',
    lastUpdated: '2026-09-03T11:00:00Z',
    createdAt: '2025-12-01T09:30:00Z',
  },
  {
    id: '16',
    name: 'Salbutamol Inhaler',
    category: 'Medications',
    description: 'Asthma relief inhaler, 200 doses',
    sku: 'MED-016',
    quantity: 0,
    unit: 'Units',
    minStock: 10,
    maxStock: 40,
    costPrice: 14.00,
    sellingPrice: 30.00,
    location: 'Pharmacy Aisle 1',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2027-08-31',
    status: 'Out of Stock',
    lastUpdated: '2026-09-01T08:00:00Z',
    createdAt: '2025-12-15T11:00:00Z',
  },
  {
    id: '17',
    name: 'Cetirizine 10mg',
    category: 'Medications',
    description: 'Antihistamine for allergy relief',
    sku: 'MED-017',
    quantity: 85,
    unit: 'Tablets',
    minStock: 25,
    maxStock: 150,
    costPrice: 0.90,
    sellingPrice: 2.50,
    location: 'Pharmacy Aisle 2',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2028-04-30',
    status: 'In Stock',
    lastUpdated: '2026-09-04T11:00:00Z',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: '18',
    name: 'Surgical Scissors',
    category: 'Equipment',
    description: 'Stainless steel surgical scissors, 5.5"',
    sku: 'EQP-018',
    quantity: 22,
    unit: 'Units',
    minStock: 8,
    maxStock: 30,
    costPrice: 35.00,
    sellingPrice: 75.00,
    location: 'Equipment Room',
    supplier: 'MedTech Solutions',
    lastUpdated: '2026-09-02T15:00:00Z',
    createdAt: '2026-01-20T10:30:00Z',
    status: 'In Stock',
  },
  {
    id: '19',
    name: 'N95 Respirator Masks',
    category: 'Medical Supplies',
    description: 'N95 filtering facepiece respirators, box of 20',
    sku: 'SUP-019',
    quantity: 45,
    unit: 'Boxes',
    minStock: 30,
    maxStock: 100,
    costPrice: 25.00,
    sellingPrice: 55.00,
    location: 'Storage Room A',
    supplier: 'SafeCare Supplies',
    expiryDate: '2028-01-31',
    status: 'In Stock',
    lastUpdated: '2026-09-03T09:30:00Z',
    createdAt: '2026-02-01T11:00:00Z',
  },
  {
    id: '20',
    name: 'Omeprazole 20mg',
    category: 'Medications',
    description: 'Proton pump inhibitor for acid reflux',
    sku: 'MED-020',
    quantity: 150,
    unit: 'Capsules',
    minStock: 40,
    maxStock: 200,
    costPrice: 0.60,
    sellingPrice: 1.80,
    location: 'Pharmacy Aisle 3',
    supplier: 'MediPharm Distributors',
    expiryDate: '2028-05-15',
    status: 'In Stock',
    lastUpdated: '2026-09-04T08:00:00Z',
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: '21',
    name: 'Thermometer (Digital)',
    category: 'Equipment',
    description: 'Digital infrared forehead thermometer',
    sku: 'EQP-021',
    quantity: 7,
    unit: 'Units',
    minStock: 5,
    maxStock: 20,
    costPrice: 30.00,
    sellingPrice: 65.00,
    location: 'Equipment Room',
    supplier: 'MedTech Solutions',
    lastUpdated: '2026-08-31T16:00:00Z',
    createdAt: '2026-03-01T08:30:00Z',
    status: 'In Stock',
  },
  {
    id: '22',
    name: 'Sterile Gauze Pads',
    category: 'Medical Supplies',
    description: '4x4 sterile gauze pads, pack of 100',
    sku: 'SUP-022',
    quantity: 35,
    unit: 'Packs',
    minStock: 20,
    maxStock: 80,
    costPrice: 7.00,
    sellingPrice: 16.00,
    location: 'Storage Room B',
    supplier: 'SafeCare Supplies',
    expiryDate: '2028-06-30',
    status: 'Low Stock',
    lastUpdated: '2026-08-28T11:30:00Z',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: '23',
    name: 'Metformin 500mg',
    category: 'Medications',
    description: 'Antidiabetic medication for type 2 diabetes',
    sku: 'MED-023',
    quantity: 90,
    unit: 'Tablets',
    minStock: 30,
    maxStock: 120,
    costPrice: 0.45,
    sellingPrice: 1.20,
    location: 'Pharmacy Aisle 1',
    supplier: 'PharmaPlus Wholesalers',
    expiryDate: '2028-02-28',
    status: 'In Stock',
    lastUpdated: '2026-09-01T14:00:00Z',
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: '24',
    name: 'Wheelchair (Standard)',
    category: 'Equipment',
    description: 'Standard manual wheelchair with footrests',
    sku: 'EQP-024',
    quantity: 3,
    unit: 'Units',
    minStock: 2,
    maxStock: 8,
    costPrice: 180.00,
    sellingPrice: 350.00,
    location: 'Equipment Room',
    supplier: 'MedTech Solutions',
    lastUpdated: '2026-08-30T10:00:00Z',
    createdAt: '2026-04-15T08:00:00Z',
    status: 'In Stock',
  },
];

// ============================================
// Helper Functions
// ============================================
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStatusColor(status: InventoryItem['status']): string {
  switch (status) {
    case 'In Stock':
      return 'bg-green-100 text-green-700';
    case 'Low Stock':
      return 'bg-yellow-100 text-yellow-700';
    case 'Out of Stock':
      return 'bg-red-100 text-red-700';
    case 'Expired':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getStatusIcon(status: InventoryItem['status']) {
  switch (status) {
    case 'In Stock':
      return <CheckCircle size={14} className="text-green-600" />;
    case 'Low Stock':
      return <AlertCircle size={14} className="text-yellow-600" />;
    case 'Out of Stock':
      return <AlertCircle size={14} className="text-red-600" />;
    case 'Expired':
      return <Clock size={14} className="text-gray-600" />;
    default:
      return null;
  }
}

function getStockHealth(item: InventoryItem): number {
  if (item.quantity >= item.maxStock) return 100;
  if (item.quantity <= 0) return 0;
  const range = item.maxStock - item.minStock;
  if (range <= 0) return 50;
  const percentage = ((item.quantity - item.minStock) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

// ============================================
// Main Component
// ============================================
export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const itemsPerPage = 9; // 3 rows of 3 cards each

  // Get unique categories
  const categories = ['All', ...new Set(inventoryData.map(item => item.category))];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Expired'];

  // Apply filters
  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // KPI Calculations
  const totalItems = inventoryData.length;
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const lowStockItems = inventoryData.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = inventoryData.filter(item => item.status === 'Out of Stock').length;
  const expiredItems = inventoryData.filter(item => item.status === 'Expired').length;

  // Reset page when filters change
  const handleFilterChange = (filterType: 'category' | 'status', value: string) => {
    if (filterType === 'category') setCategoryFilter(value);
    else setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1628]">Inventory Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track and manage all medical supplies, medications, and equipment
          </p>
        </div>
        <button className="mt-3 lg:mt-0 bg-[#0A1628] text-white px-5 py-2.5 rounded-lg hover:bg-[#1A3A5C] transition-colors inline-flex items-center gap-2 text-sm font-medium">
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <Package size={16} /> Total Items
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">{totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <IndianRupee size={16} /> Total Value
          </div>
          <p className="text-2xl font-bold text-[#0A1628]">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <TrendingDown size={16} /> Low Stock
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <AlertCircle size={16} /> Critical
          </div>
          <p className="text-2xl font-bold text-red-600">{outOfStockItems + expiredItems}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, SKU, category, or supplier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
          />
        </div>
        
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
          className="sm:hidden px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-[#0A1628] font-medium text-sm inline-flex items-center gap-2"
        >
          <Filter size={18} /> Filters
        </button>

        {/* Desktop Filters */}
        <div className="hidden sm:flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {(categoryFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium inline-flex items-center gap-1 transition-colors"
            >
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-xl w-full max-h-[70vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A1628]">Filters</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                }}
                className="w-full bg-[#0A1628] text-white py-2.5 rounded-lg font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Grid - 3 columns with larger cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map((item) => {
          const stockHealth = getStockHealth(item);
          return (
            <div key={item.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-[#0A1628]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Box size={20} className="text-[#0A1628]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#0A1628] text-base truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Qty</p>
                  <p className="font-medium text-[#0A1628]">{item.quantity} {item.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Cost</p>
                  <p className="font-medium text-[#0A1628]">{formatCurrency(item.costPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Sell</p>
                  <p className="font-medium text-[#0A1628]">{formatCurrency(item.sellingPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Min</p>
                  <p className="font-medium text-[#0A1628]">{item.minStock}</p>
                </div>
              </div>

              {/* Stock Health Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Stock Level</span>
                  <span>{stockHealth}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stockHealth >= 70 ? 'bg-green-500' :
                      stockHealth >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stockHealth}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#0A1628]">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-1.5 bg-[#0A1628] text-white rounded-lg hover:bg-[#1A3A5C] transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="font-medium">No items found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="mt-5 px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of{' '}
            {filteredItems.length} items
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3 && currentPage < totalPages - 1) {
                  pageNum = currentPage - 2 + i;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 4 + i;
                }
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-1.5 rounded-lg transition-colors text-sm ${
                    currentPage === pageNum ? 'bg-[#0A1628] text-white' : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
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

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0A1628]/5 rounded-lg flex items-center justify-center">
                  <Box size={28} className="text-[#0A1628]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1628]">{selectedItem.name}</h2>
                  <p className="text-sm text-gray-400 font-mono">{selectedItem.sku}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="font-medium">{selectedItem.category}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                    {getStatusIcon(selectedItem.status)}
                    {selectedItem.status}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="font-medium">{selectedItem.quantity} {selectedItem.unit}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-medium">{selectedItem.location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Cost Price</p>
                  <p className="font-medium">{formatCurrency(selectedItem.costPrice)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Selling Price</p>
                  <p className="font-medium">{formatCurrency(selectedItem.sellingPrice)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-xs text-gray-400">Supplier</p>
                  <p className="font-medium">{selectedItem.supplier}</p>
                </div>
                {selectedItem.expiryDate && (
                  <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                    <p className="text-xs text-gray-400">Expiry Date</p>
                    <p className="font-medium">{selectedItem.expiryDate}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-xs text-gray-400">Description</p>
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}