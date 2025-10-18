import * as Yup from 'yup';
import { CategoryValidator } from './category';
import { Messages } from '../messages';
import { ICategory } from '@/app/types/category';
import { UserValidator } from './user';

export const TransactionValidator = Yup.object({
  merchant: Yup.string().required(Messages.REQUIRED('Merchant')),
  category: CategoryValidator.required(Messages.REQUIRED('Category')),
  type: Yup.mixed<ICategory['type']>()
    .oneOf(['credit', 'debit', 'transaction'], Messages.INVALID_TYPE)
    .required(Messages.REQUIRED('Transaction type')),
  amount: Yup.number()
    .positive(Messages.INVALID_AMOUNT('Amount'))
    .required(Messages.REQUIRED('Amount')),
  date: Yup.date().required(Messages.REQUIRED('Date')),
  createdBy: UserValidator.pick(['id', 'name', 'email']).required(Messages.REQUIRED('CreatedBy')),
});
