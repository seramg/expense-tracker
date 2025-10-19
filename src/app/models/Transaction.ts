// src/models/Transaction.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../../lib/types/transaction';

type transactionSchemaType = ITransaction & Document;
const transactionSchema = new Schema<transactionSchemaType>(
  {
    merchant: { type: String, required: true },
    category: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: String,
    }, // user object
  },
  { timestamps: true },
);

let TransactionModel: mongoose.Model<ITransaction>;
try {
  // Try to get the existing model from mongoose
  TransactionModel = mongoose.model<ITransaction>('Transaction');
} catch {
  // If the model doesn't exist, define it
  TransactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
}
export default TransactionModel;
