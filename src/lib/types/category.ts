import { TransactionType } from '@prisma/client';

export interface ICategory {
  id?: string;
  name: string;
  type: TransactionType;
}
