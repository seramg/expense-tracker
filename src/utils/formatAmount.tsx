import { fetchUSDToINR } from '@/lib/fetchCurrency';
import { CurrencyType } from '@prisma/client';

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const convertUSDToINR = async (
  amount: number = 0,
  currency: CurrencyType = CurrencyType.INR,
) => {
  const usdToInrRate = await fetchUSDToINR();
  if (currency === CurrencyType.USD) {
    amount *= usdToInrRate;
  }
  return amount;
};

export const convertToCurrency = async (
  amount: number = 0,
  from: CurrencyType = CurrencyType.INR,
  to: CurrencyType = CurrencyType.INR,
) => {
  if (from === to) return amount;

  const usdToInrRate = await fetchUSDToINR();

  if (from === CurrencyType.USD && to === CurrencyType.INR) {
    return amount * usdToInrRate;
  }
  if (from === CurrencyType.INR && to === CurrencyType.USD) {
    return amount / usdToInrRate;
  }
  return amount;
};
