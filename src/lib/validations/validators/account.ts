import * as Yup from 'yup';
import { Messages } from '../messages';
import { IAccount } from '@/lib/types/account';

export const AccountValidator = Yup.object({
  name: Yup.string().required(Messages.REQUIRED('Account Name')),
  type: Yup.mixed<IAccount['type']>()
    .oneOf(['bank', 'cash', 'wallet', 'credit'], Messages.INVALID_ACCOUNT)
    .required(Messages.REQUIRED('Account type')),
  balance: Yup.number()
    .min(0, Messages.INVALID_AMOUNT('Balance'))
    .required(Messages.REQUIRED('Balance')),
  currency: Yup.string()
    .length(3, Messages.INVALID_CURRENCY)
    .required(Messages.REQUIRED('Currency')),
});
