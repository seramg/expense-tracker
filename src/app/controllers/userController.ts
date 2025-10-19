// src/controllers/userController.ts
import { connectDB } from '@/lib/mongodb';
import User from '../models/User';
import { IUser } from '../../lib/types/user';
import { UserValidator } from '@/lib/validations';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email });
}

export async function createUser(userData: Partial<IUser>) {
  await connectDB();
  const validated = await UserValidator.validate(userData, { abortEarly: false });
  console.log(validated);
  const user = new User(validated);
  await user.save();
  return user;
}

export async function updateUser(id: string, userData: Partial<IUser>) {
  await connectDB();
  const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
  return updatedUser;
}
