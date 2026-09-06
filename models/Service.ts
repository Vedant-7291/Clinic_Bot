import { Schema, models, model, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, unique: true },
});

export default models.Service || model<IService>('Service', ServiceSchema);
