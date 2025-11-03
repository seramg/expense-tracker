import { PrismaClient } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma'; // gives you Prisma.UserCreateInput, etc.
const prisma = new PrismaClient();

// ✅ Create transaction
export async function createTransaction(transactionData: Prisma.TransactionCreateInput) {
  // Prisma validates this based on your schema
  const transaction = await prisma.transaction.create({
    data: transactionData,
    include: {
      user: true,
      category: true,
      fromAccount: true,
      toAccount: true,
      //   🟢 createdAt & updatedAt are already returned automatically
    },
  });
  return transaction;
}

// ✅ Update transaction
