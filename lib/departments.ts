// Single source of truth for departments. The WhatsApp bot uses DEPARTMENTS
// (with the numbered labels) to build its list message; the dashboard uses
// SERVICE_CATALOG for names/descriptions/prices. Keep both in sync.

export interface DepartmentOption {
  id: string; // sent back as interactive list/button id
  label: string; // shown to the patient
}

export const DEPARTMENTS: DepartmentOption[] = [
  { id: 'general_medicine', label: 'General Medicine' },
  { id: 'dental_care', label: 'Dental Care' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'orthopedics', label: 'Orthopedics' },
  { id: 'gynecology', label: 'Gynecology' },
  { id: 'ent', label: 'ENT' },
  { id: 'dermatology', label: 'Dermatology' },
  { id: 'other', label: 'Other / Not sure' },
];

export const SERVICE_CATALOG = [
  {
    name: 'General Medicine Consultation',
    description: 'Standard consultation with a general physician',
    price: 150,
    category: 'General Medicine',
  },
  {
    name: 'Dental Checkup & Cleaning',
    description: 'Routine oral exam, cleaning, and cavity check',
    price: 120,
    category: 'Dental Care',
  },
  {
    name: 'Pediatric Visit',
    description: "Children's health examination and consultation",
    price: 180,
    category: 'Pediatrics',
  },
  {
    name: 'Cardiology Checkup',
    description: 'Comprehensive heart health evaluation',
    price: 350,
    category: 'Cardiology',
  },
  {
    name: 'Orthopedic Consultation',
    description: 'Musculoskeletal system evaluation',
    price: 300,
    category: 'Orthopedics',
  },
  {
    name: 'Gynecology Consultation',
    description: "Women's health exam and consultation",
    price: 220,
    category: 'Gynecology',
  },
  {
    name: 'ENT Consultation',
    description: 'Ear, nose, and throat evaluation',
    price: 200,
    category: 'ENT',
  },
  {
    name: 'Dermatology Consultation',
    description: 'Skin, hair, and nail health assessment',
    price: 250,
    category: 'Dermatology',
  },
];

// "Other / Not sure" isn't billable, so it's intentionally excluded from
// SERVICE_CATALOG. Front-desk staff price it manually once triaged.
export function getServiceByDepartment(department?: string) {
  if (!department) return undefined;

  return SERVICE_CATALOG.find(
    (s) => s.category.toLowerCase() === department.toLowerCase()
  );
}

export function findDepartmentLabel(idOrLabel: string): string {
  const match = DEPARTMENTS.find(
    (d) =>
      d.id === idOrLabel ||
      d.label.toLowerCase() === idOrLabel.toLowerCase()
  );
  return match ? match.label : idOrLabel;
}
