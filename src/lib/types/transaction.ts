import { CurrencyType, TransactionType } from '@prisma/client';
import { ICategory } from './category';
import { IAccount } from './account';

export interface ITransaction {
  merchant: string;
  amount: number;
  type: TransactionType;
  currency: CurrencyType;
  categoryId?: string;
  category?: ICategory;
  fromAccountId?: string;
  toAccountId?: string;
  fromAccount?: IAccount;
  toAccount?: IAccount;
  createdAt?: string;
  updatedAt?: string;
}
