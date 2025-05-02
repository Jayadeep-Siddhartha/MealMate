// models/Food.ts
import mongoose, { Schema, Document, models } from 'mongoose';

interface IFood extends Document {
  foodName: string;
  cafeteriaId: mongoose.Types.ObjectId;
  price: number;
  foodImage: string;
  availability: boolean;
  rating: number;
  category: string;
}

const FoodSchema = new Schema<IFood>({
  foodName: { type: String, required: true },
  cafeteriaId: { type: Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  price: { type: Number, required: true },
  foodImage: { type: String, required: true },  // URL from Supabase
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  category: { type: String, required: true }
});

export default models.Food || mongoose.model<IFood>('Food', FoodSchema);
