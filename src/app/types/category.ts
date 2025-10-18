import { IUserRef } from './user';

export interface ICategory {
  name: string;
  type: 'credit' | 'debit' | 'transaction';
  createdBy?: IUserRef;
  createdAt: Date;
  updatedAt: Date;
}
