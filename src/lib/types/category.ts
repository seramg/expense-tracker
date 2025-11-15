import { TransactionType } from '@prisma/client';

export interface ICategory {
  name: string;
  type: TransactionType;
}
