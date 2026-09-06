import { Schema, models, model, Document } from 'mongoose';

export type BookingStep =
  | 'ASK_PATIENT_TYPE'
  | 'ASK_DEPARTMENT'
  | 'ASK_NAME'
  | 'ASK_DATE'
  | 'ASK_TIME'
  | 'ASK_SYMPTOMS'
  | 'ASK_INSURANCE';

export interface SessionData {
  patientType?: string;
  department?: string;
  patientName?: string;
  preferredDate?: string;
  preferredTime?: string;
  symptoms?: string;
  hasInsurance?: string;
}

export interface ISession extends Document {
  phoneNumber: string;
  step: BookingStep;
  data: SessionData;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    step: { type: String, required: true, default: 'ASK_PATIENT_TYPE' },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default models.Session || model<ISession>('Session', SessionSchema);
