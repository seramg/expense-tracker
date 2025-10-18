// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IAccount } from '../types/account';

type accountSchemaType = IAccount & Document;
const accountSchema = new Schema<accountSchemaType>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['bank', 'cash', 'wallet', 'credit'], required: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INR' },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: String,
    },
  },
  { timestamps: true },
);

let AccountModel: mongoose.Model<IAccount>;
try {
  // Try to get the existing model from mongoose
  AccountModel = mongoose.model<IAccount>('Account');
} catch {
  // If the model doesn't exist, define it
  AccountModel = mongoose.model<IAccount>('Account', accountSchema);
}
export default AccountModel;
