import { AccountType, CurrencyType } from '@prisma/client';
import { IUserRef } from './user';

export interface IAccount {
  id?: string;
  name: string;
  type: AccountType;
  balance?: number;
  currency: CurrencyType;
  createdBy?: IUserRef;
}
