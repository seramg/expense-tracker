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
