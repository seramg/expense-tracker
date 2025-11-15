import prisma from '@/lib/prisma/prisma';
import { ITransaction } from '@/lib/types/transaction';

// ✅ Create transaction
export async function createTransaction(transactionData: ITransaction, userId?: string) {
  // Prisma validates this based on your schema
  const transaction = await prisma.transaction.create({
    data: {
      merchant: transactionData.merchant,
      amount: transactionData.amount,
      date: transactionData.date,

      user: { connect: { id: userId } },

      category: { connect: { id: transactionData.categoryId } },

      fromAccount: transactionData.fromAccountId
        ? { connect: { id: transactionData.fromAccountId } }
        : undefined,

      toAccount: transactionData.toAccountId
        ? { connect: { id: transactionData.toAccountId } }
        : undefined,
    },
    include: {
      user: true,
      category: true,
      fromAccount: true,
      toAccount: true,
    },
  });

  return transaction;
}

// ✅ Get all transaction
export async function getAllTransactions(userId?: string) {
  // Prisma validates this based on your schema
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return transactions;
}
