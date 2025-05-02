// models/Cafeteria.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICafeteria extends Document {
  cafeteriaName: string;
  location: { latitude: number; longitude: number };
  menu: mongoose.Types.ObjectId[];
  availableSeats: number;
  rating: number;
  openStatus: boolean;
  cafeImage?: string; // ✅ NEW
}

const CafeteriaSchema = new Schema<ICafeteria>({
  cafeteriaName: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
  },
  menu: [{ type: Schema.Types.ObjectId, ref: 'Food' }],
  availableSeats: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  openStatus: { type: Boolean, default: true },
  cafeImage: String, // ✅ NEW
}, { collection: 'Cafeterias' });

export default models.Cafeteria || mongoose.model<ICafeteria>('Cafeteria', CafeteriaSchema);
