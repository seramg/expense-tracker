import { TransactionType } from '@prisma/client';
import { IUserRef } from './user';

export interface ICategory {
  name: string;
  type: TransactionType;
  createdBy?: IUserRef;
}
