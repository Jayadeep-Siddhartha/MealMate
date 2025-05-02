import mongoose, { Schema, Document, models } from 'mongoose';

export interface ICafeOwner extends Document {
  firebaseId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  upiId?: string;
  cafeteria: mongoose.Types.ObjectId;
}

const CafeOwnerSchema = new Schema<ICafeOwner>({
  firebaseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  upiId: String,
  cafeteria: { type: Schema.Types.ObjectId, ref: 'Cafeteria' },
});

export default models.CafeOwner || mongoose.model<ICafeOwner>('CafeOwner', CafeOwnerSchema);
