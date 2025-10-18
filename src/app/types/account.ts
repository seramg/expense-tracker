import { IUserRef } from './user';

export interface IAccount {
  name: string;
  type: 'bank' | 'cash' | 'wallet' | 'credit';
  balance?: number;
  currency?: string;
  createdBy?: IUserRef;
}
