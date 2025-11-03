import { PrismaClient } from '@/generated/prisma';
import { Prisma } from '@/generated/prisma'; // gives you Prisma.UserCreateInput, etc.
const prisma = new PrismaClient();

// ✅ Create account
export async function createAccount(accountData: Prisma.AccountCreateInput) {
  // Prisma validates this based on your schema
  const account = await prisma.account.create({
    data: accountData,
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
