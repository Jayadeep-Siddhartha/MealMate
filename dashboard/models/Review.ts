// models/Review.ts
import mongoose, { Schema, Document, models } from 'mongoose';

interface IReview extends Document {
  userId: string;
  cafeteriaId: mongoose.Types.ObjectId;
  foodId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: String, required: true },
  cafeteriaId: { type: Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  foodId: { type: Schema.Types.ObjectId, ref: 'Food' },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.Review || mongoose.model<IReview>('Review', ReviewSchema);
