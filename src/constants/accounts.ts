import { AccountType, CurrencyType } from '@prisma/client';
import { ICONS } from './icons';

export const ACCOUNT_TYPES = Object.values(AccountType);
export const ACCOUNT_OPTIONS = ACCOUNT_TYPES.map((accountType) => ({
  label: accountType.charAt(0).toUpperCase() + accountType.substring(1),
  value: accountType,
  icon: ICONS[accountType],
}));

export const CURRENCY_TYPES = Object.values(CurrencyType);
export const CURRENCY_OPTIONS = CURRENCY_TYPES.map((currencyType) => ({
  label: currencyType.charAt(0).toUpperCase() + currencyType.substring(1),
  value: currencyType,
  icon: ICONS[currencyType],
}));
