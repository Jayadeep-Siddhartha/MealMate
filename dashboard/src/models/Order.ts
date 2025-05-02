// models/Order.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IOrderItem {
  foodId: mongoose.Types.ObjectId;
  quantity: number;
  specialInstructions?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  cafeId: mongoose.Types.ObjectId;
  foodItems: IOrderItem[];
  totalAmount: number;
  isCompleted: boolean;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cafeId: { type: Schema.Types.ObjectId, ref: 'Cafeteria' },
  foodItems: [
    {
      foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, default: 1 },
      specialInstructions: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Order || mongoose.model<IOrder>('Order', OrderSchema);
