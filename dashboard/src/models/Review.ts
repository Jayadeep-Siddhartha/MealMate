// models/Review.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  cafeteriaId?: mongoose.Types.ObjectId;
  foodId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cafeteriaId: { type: Schema.Types.ObjectId, ref: 'Cafeteria' },
  foodId: { type: Schema.Types.ObjectId, ref: 'Food' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

export default models.Review || mongoose.model<IReview>('Review', ReviewSchema);
