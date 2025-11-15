import prisma from '@/lib/prisma/prisma';
import { IAccount } from '@/lib/types/account';

// ✅ Create account
export async function createAccount(accountData: IAccount, userId?: string) {
  // Prisma validates this based on your schema
  const account = await prisma.account.create({
    data: { ...accountData, user: { connect: { id: userId } } },
    include: {
      user: true,
      fromTransactions: true,
      toTransactions: true,
      //   🟢 createdAt & updatedAt are already returned automatically
    },
  });
  return account;
}

// ✅ Get all accounts
export async function getAllAccounts(userId?: string) {
  // Prisma validates this based on your schema
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return accounts;
}

//✅ Find a account
export async function getAccount(accountName?: string) {
  const account = await prisma.account.findFirst({
    where: { name: accountName },
  });
  return account;
}

//✅ Update account
export async function updateAccount(
  tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>,
  accountId?: string,
  balance?: {
    increment?: number;
    decrement?: number;
  },
) {
  return await tx.account.update({
    where: { id: accountId },
    data: {
      balance,
    },
  });
}
