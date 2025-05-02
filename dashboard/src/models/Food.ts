// models/Food.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IFood extends Document {
  foodName: string;
  cafeteriaId: mongoose.Types.ObjectId;
  price: number;
  foodImage: string;
  availability: number;
  rating: number;
  category: string;
}

const FoodSchema = new Schema<IFood>({
  foodName: { type: String, required: true },
  cafeteriaId: { type: Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  price: { type: Number, required: true },
  foodImage: String,
  availability: { type: Number, default: 1 },
  rating: { type: Number, default: 1 },
  category: { type: String, required: true },
}, { timestamps: true, collection: 'FoodItems' });

export default models.Food || mongoose.model<IFood>('Food', FoodSchema);
