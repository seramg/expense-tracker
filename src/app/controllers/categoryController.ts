import prisma from '@/lib/prisma/prisma';
import { ICategory } from '@/lib/types/category';

// ✅ Create category
export async function createCategory(categoryData: ICategory, userId?: string) {
  // Prisma validates this based on your schema
  const category = await prisma.category.create({
    data: { ...categoryData, user: { connect: { id: userId } } },
    include: {
      user: true,
      transactions: true,
      //   🟢 createdAt & updatedAt are already returned automatically
    },
  });
  return category;
}
// ✅ Get all categories
export async function getAllCategories(userId?: string) {
  // Prisma validates this based on your schema
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return categories;
}

//✅ Find a category
export async function getCategory(categoryName?: string) {
  const account = await prisma.category.findFirst({
    where: { name: categoryName },
  });
  return account;
}
