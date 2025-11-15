import * as Yup from 'yup';
import { Messages } from '../messages';
import { ITransaction } from '@/lib/types/transaction';
import { CURRENCY_TYPES } from '@/constants/accounts';
import { CATEGORY_TYPES } from '@/constants/categories';

export const TransactionValidator = Yup.object({
  merchant: Yup.string().required(Messages.REQUIRED('Merchant')),
  amount: Yup.number()
    .min(0, Messages.INVALID_AMOUNT('Amount'))
    .required(Messages.REQUIRED('Amount')),
  type: Yup.mixed<ITransaction['type']>()
    .oneOf(CATEGORY_TYPES, Messages.INVALID_CATEGORY_TYPE)
    .required(Messages.REQUIRED('Category type')),
  currency: Yup.mixed<ITransaction['currency']>()
    .oneOf(CURRENCY_TYPES, Messages.INVALID_CURRENCY)
    .required(Messages.REQUIRED('Currency')),
  categoryId: Yup.string().required(Messages.REQUIRED('Category')),
  fromAccountId: Yup.string().nullable().optional(),
  toAccountId: Yup.string().nullable().optional(),
});
