import { AccountType, CurrencyType } from '@prisma/client';
import { IUserRef } from './user';

export interface IAccount {
  name: string;
  type: AccountType;
  balance?: number;
  currency: CurrencyType;
  createdBy?: IUserRef;
}
