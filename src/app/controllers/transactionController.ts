import prisma from '@/lib/prisma/prisma';
import { ITransaction } from '@/lib/types/transaction';
import { TransactionType } from '@prisma/client';
import { updateAccount } from './accountController';

// ✅ Create transaction
async function createTransactionInstance(
  tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>,
  transactionData: ITransaction,
  userId?: string,
) {
  const transaction = await tx.transaction.create({
    data: {
      merchant: transactionData.merchant,
      amount: transactionData.amount,
      type: transactionData.type,
      currency: transactionData.currency,

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
      fromAccount: true,
      toAccount: true,
    },
  });
  return transaction;
}
export async function createTransaction(transactionData: ITransaction, userId?: string) {
  return await prisma.$transaction(async (tx) => {
    /*If you did:
    const t = await prisma.transaction.create(...)
    await prisma.account.update(...)
    await prisma.account.update(...)
    
    and the second update fails →
    the transaction is created but balances are wrong.
    That is a serious BUG.*/

    // 1️⃣ Create the transaction
    const transaction = await createTransactionInstance(tx, transactionData, userId);

    // 2️⃣ Update account balances based on type
    const amount = transactionData.amount;

    if (transactionData.type === TransactionType.credit && transactionData.toAccountId) {
      await updateAccount(tx, transactionData.toAccountId!, { increment: amount });
    }

    if (transactionData.type === TransactionType.debit && transactionData.fromAccountId) {
      await updateAccount(tx, transactionData.fromAccountId!, { decrement: amount });
    }

    if (
      transactionData.type === TransactionType.transfer &&
      (transactionData.fromAccountId || transactionData.toAccountId)
    ) {
      await updateAccount(tx, transactionData.fromAccountId!, { decrement: amount });
      await updateAccount(tx, transactionData.toAccountId!, { increment: amount });
    }

    return transaction;
  });
}

// ✅ Get all transaction
export async function getAllTransactions(userId?: string) {
  // Prisma validates this based on your schema
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      user: true,
      fromAccount: true,
      toAccount: true,
    },
  });
  return transactions;
}
