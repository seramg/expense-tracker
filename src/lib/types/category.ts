import { TransactionType } from '@prisma/client';
import { ITransaction } from './transaction';

export interface ICategory {
  id?: string;
  name: string;
  type: TransactionType;
  transactions?: ITransaction[];
  totalAmount?: number;
}
