import { TransactionType } from '@prisma/client';

export const CATEGORY_TYPES = Object.values(TransactionType);
export const CATEGORY_OPTIONS = CATEGORY_TYPES.map((categoryType) => ({
  label: categoryType.charAt(0).toUpperCase() + categoryType.substring(1),
  value: categoryType,
}));
