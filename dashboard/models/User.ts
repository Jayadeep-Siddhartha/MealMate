import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  firebaseId: string;
  savedCafeterias: mongoose.Types.ObjectId[];
  preferences: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  firebaseId: { type: String, unique: true, required: true },
  savedCafeterias: [{ type: Schema.Types.ObjectId, ref: 'Cafeteria' }],
  preferences: [{ type: Schema.Types.ObjectId, ref: 'Food' }],
}, { timestamps: true });

export default models.User || mongoose.model<IUser>('User', UserSchema);
