// src/models/Category.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../../lib/types/category';

type categorySchemaType = ICategory & Document;
const categorySchema = new Schema<categorySchemaType>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['credit', 'debit', 'transaction'], required: true },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: String,
    }, // user object
  },
  { timestamps: true },
);

let CategoryModel: mongoose.Model<ICategory>;
try {
  // Try to get the existing model from mongoose
  CategoryModel = mongoose.model<ICategory>('Category');
} catch {
  // If the model doesn't exist, define it
  CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
}
export default CategoryModel;
