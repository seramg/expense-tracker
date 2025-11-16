import useUSDToINRRate from '@/hooks/useUSDToINRRate';
import { fetchUSDToINR } from '@/lib/fetchCurrency';
import prisma from '@/lib/prisma/prisma';
import { ICategory } from '@/lib/types/category';
import { convertUSDToINR } from '@/utils/formatAmount';
import { CurrencyType, TransactionType } from '@prisma/client';

// ✅ Create category
export async function createCategory(categoryData: ICategory, userId?: string) {
  // Prisma validates this based on your schema
  const category = await prisma.category.create({
    data: { name: categoryData.name, type: categoryData.type, user: { connect: { id: userId } } },
    include: {
      user: true,
      transactions: true,
      //   🟢 createdAt & updatedAt are already returned automatically
    },
  });
  return category;
}
// ✅ Get all categories
export async function getAllCategories(userId?: string, type?: TransactionType) {
  // Prisma validates this based on your schema
  const categories = await prisma.category.findMany({
    where: { userId, type },
    orderBy: { createdAt: 'desc' },
    include: {
      transactions: true,
    },
  });

  const categoriesWithTotal = await Promise.all(
    categories.map(async (category) => {
      const total = await Promise.all(
        category.transactions.map(async (transaction) => {
          const convertedAmt = await convertUSDToINR(transaction.amount, transaction.currency);
          return convertedAmt;
        }),
      );
      const result = total.reduce((acc, val) => acc + val, 0);

      return {
        ...category,
        totalAmount: result,
      };
    }),
  );

  return categoriesWithTotal;
}

//✅ Find a category
export async function getCategory(categoryName?: string) {
  const account = await prisma.category.findFirst({
    where: { name: categoryName },
    include: {
      transactions: true,
    },
  });
  return account;
}
