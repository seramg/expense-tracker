import { CURRENCY_OPTIONS } from '@/constants/accounts';
import INRIcon from '@/constants/icons/INR';
import USDIcon from '@/constants/icons/USD';
import { formatAmount } from '@/utils/formatAmount';
import { CurrencyType } from '@prisma/client';

interface IAmountWithCurrencyIcon {
  currency?: CurrencyType;
  amount?: number;
  iconClassName?: string;
}

const AmountWithCurrencyIcon = ({
  currency = CurrencyType.INR,
  amount,
  iconClassName = '',
}: IAmountWithCurrencyIcon) => {
  const getCurrencyOption = (type?: CurrencyType) =>
    CURRENCY_OPTIONS.find((currencyOption) => currencyOption.value === type);

  const isINR = getCurrencyOption(currency)?.value === CurrencyType.INR;
  const isUSD = getCurrencyOption(currency)?.value === CurrencyType.USD;

  const getIcon = () => {
    if (isINR) {
      return <INRIcon className={`h-full max-h-4 w-full max-w-4 ${iconClassName}`} />;
    } else if (isUSD) {
      return <USDIcon className={`h-full max-h-4 w-full max-w-4 ${iconClassName}`} />;
    }
  };

  return (
    <div className='flex items-center justify-center'>
      {getIcon()}
      {formatAmount(amount ?? 0)}
    </div>
  );
};

export default AmountWithCurrencyIcon;
