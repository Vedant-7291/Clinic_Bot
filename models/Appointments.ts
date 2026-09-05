import { Schema, models, model, Document } from 'mongoose';

export type PatientType = 'New Patient' | 'Returning Patient';
export type InsuranceAnswer = 'Yes' | 'No';
export type AppointmentStatus = 'Confirmed' | 'Completed' | 'Cancelled';

export interface IAppointment extends Document {
  patientName: string;
  phoneNumber: string;
  patientType: PatientType;
  department: string;
  assignedDoctor: string | null;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  hasInsurance: InsuranceAnswer;
  status: AppointmentStatus;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, index: true, trim: true },
    patientType: {
      type: String,
      enum: ['New Patient', 'Returning Patient'],
      required: true,
    },
    department: { type: String, required: true },
    assignedDoctor: { type: String, default: null },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    symptoms: { type: String, default: 'Not provided' },
    hasInsurance: { type: String, enum: ['Yes', 'No'], default: 'No' },
    status: {
      type: String,
      enum: ['Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed',
    },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Appointment ||
  model<IAppointment>('Appointment', AppointmentSchema);
