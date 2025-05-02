// models/Order.ts
import mongoose, { Schema, Document, models } from 'mongoose';

interface IOrderItem {
  food: mongoose.Types.ObjectId;
  quantity: number;
  specialInstructions?: string;
}

interface IOrder extends Document {
  userId: string;
  cafeId: mongoose.Types.ObjectId;
  foodItems: IOrderItem[];
  totalAmount: number;
  isCompleted: boolean;
  status: string;  // we'll add a status field for order state (e.g., "preparing", "ready", "completed")
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  food: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true },
  specialInstructions: String
}, { _id: false }); // _id: false to not create subdocument IDs for each item

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  cafeId: { type: Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  foodItems: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'preparing', 'ready', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Order || mongoose.model<IOrder>('Order', OrderSchema);
