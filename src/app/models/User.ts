// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../lib/types/user';

type userSchemaType = IUser & Document;
const userSchema = new Schema<userSchemaType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    image: { type: String },
    provider: { type: String, default: 'credentials' },
    googleId: { type: String, required: false },
  },
  { timestamps: true },
);

let UserModel: mongoose.Model<IUser>;
try {
  // Try to get the existing model from mongoose
  UserModel = mongoose.model<IUser>('User');
} catch {
  // If the model doesn't exist, define it
  UserModel = mongoose.model<IUser>('User', userSchema);
}
export default UserModel;
