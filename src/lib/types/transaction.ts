export interface ITransaction {
  merchant: string;
  amount: number;
  date: Date;
  categoryId?: string;
  fromAccountId?: string;
  toAccountId?: string;
}
