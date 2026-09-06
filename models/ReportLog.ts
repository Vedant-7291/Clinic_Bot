import { Schema, models, model, Document } from 'mongoose';

export interface IReportLog extends Document {
  reportId: string; // 'bookings' | 'department-demand' | 'insurance' | 'revenue'
  downloadCount: number;
  lastGeneratedAt: Date | null;
}

const ReportLogSchema = new Schema<IReportLog>({
  reportId: { type: String, required: true, unique: true, index: true },
  downloadCount: { type: Number, default: 0 },
  lastGeneratedAt: { type: Date, default: null },
});

export default models.ReportLog || model<IReportLog>('ReportLog', ReportLogSchema);
