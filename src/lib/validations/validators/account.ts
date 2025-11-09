import * as Yup from 'yup';
import { Messages } from '../messages';
import { IAccount } from '@/lib/types/account';
import { ACCOUNT_TYPES, CURRENCY_TYPES } from '@/constants/accounts';

export const AccountValidator = Yup.object({
  name: Yup.string().required(Messages.REQUIRED('Account Name')),
  type: Yup.mixed<IAccount['type']>()
    .oneOf(ACCOUNT_TYPES, Messages.INVALID_ACCOUNT)
    .required(Messages.REQUIRED('Account type')),
  balance: Yup.number()
    .min(0, Messages.INVALID_AMOUNT('Balance'))
    .required(Messages.REQUIRED('Balance')),
  currency: Yup.mixed<IAccount['currency']>()
    .oneOf(CURRENCY_TYPES, Messages.INVALID_CURRENCY)
    .required(Messages.REQUIRED('Currency')),
});
