// // src/controllers/userController.ts
// import { connectDB } from '@/lib/mongodb';
// import User from '../models/User';
// import { IUser } from '../../lib/types/user';
// import { UserValidator } from '@/lib/validations';

// export async function getUserByEmail(email: string): Promise<IUser | null> {
//   await connectDB();
//   return User.findOne({ email });
// }

// export async function createUser(userData: Partial<IUser>) {
//   await connectDB();
//   const validated = await UserValidator.validate(userData, { abortEarly: false });
//   console.log(validated);
//   const user = new User(validated);
//   await user.save();
//   return user;
// }

// export async function updateUser(id: string, userData: Partial<IUser>) {
//   await connectDB();
//   const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
//   return updatedUser;
// }
import prisma from '@/lib/prisma/prisma';
import { IUser } from '@/lib/types/user';
/*
 * Mongoose is a stateful driver for MongoDB
 * It doesn’t automatically maintain a global connection pool
 * You can have multiple mongoose instances, each connected separately.
 * It needs to “attach” models to that specific connection.
 */

// ✅ Creates a connection pool (a set of database connections)
// ✅ Keeps them alive between queries
// ✅ Automatically reconnects if dropped
// ✅ Handles concurrency & pooling under the hood
// ✅ Get user by email
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// ✅ Create user
export async function createUser(userData: IUser) {
  // Prisma validates this based on your schema
  const user = await prisma.user.create({
    data: userData,
  });
  return user;
}

// ✅ Update user
export async function updateUser(id: string, userData: IUser) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });
  return updatedUser;
}
