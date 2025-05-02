// models/Cafeteria.ts
import mongoose, { Schema, Document, models } from 'mongoose';

interface ICafeteria extends Document {
  cafeteriaName: string;
  location: string;
  menu: mongoose.Types.ObjectId[];       // array of Food IDs
  availableSeats: number;
  rating: number;
  openStatus: boolean;
}

const CafeteriaSchema = new Schema<ICafeteria>({
  cafeteriaName: { type: String, required: true },
  location: { type: String, required: true },
  menu: [{ type: Schema.Types.ObjectId, ref: 'Food' }],
  availableSeats: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  openStatus: { type: Boolean, default: true }
});

export default models.Cafeteria || mongoose.model<ICafeteria>('Cafeteria', CafeteriaSchema);
