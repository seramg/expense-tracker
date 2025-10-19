import { ICategory } from './category';
import { IUserRef } from './user';

export interface ITransaction {
  merchant?: string;
  category?: ICategory;
  amount?: number;
  date?: Date;
  createdBy?: IUserRef;
}
