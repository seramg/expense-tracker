'use client';
import { useGetQuery } from '@/hooks/reactQuery/useGetQuery';
import { IAccount } from '@/lib/types/account';
import React from 'react';
import AccountForm from './Form';
import { ACCOUNT_OPTIONS, CURRENCY_OPTIONS } from '@/constants/accounts';
import { AccountType, CurrencyType } from '@prisma/client';
import Image from 'next/image';
import INRIcon from '@/constants/icons/INR';
import USDIcon from '@/constants/icons/USD';
import colors from './accounts.constants';
import useUSDToINRRate from '@/hooks/useUSDToINRRate';
import AmountWithCurrencyIcon from '@/components/atoms/AmountWithCurrencyIcon';
import { formatAmount } from '@/utils/formatAmount';

const AccountsList = () => {
  const usdToInrRate = useUSDToINRRate();

  const { data, isLoading, error, refetch } = useGetQuery<IAccount[]>(`/api/accounts`);

  if (error) return <p>Error: {error.message}</p>;

  const getAccountOption = (type: AccountType) =>
    ACCOUNT_OPTIONS.find((accountOption) => accountOption.value === type);

  const getBalance = () => {
    return (
      data?.data?.reduce((sum, account) => {
        const bal = account.balance ?? 0;
        if (account.currency === CurrencyType.USD) {
          return sum + bal * usdToInrRate;
        } else {
          return sum + bal;
        }
      }, 0) ?? 0
    );
  };

  return (
    <>
      <div className='flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:justify-between'>
        <h1 className='text-3xl font-bold'>My Accounts</h1>
        <AccountForm refetchList={refetch} />
      </div>
      {isLoading ? (
        <p className='mt-5'>Loading accounts...</p>
      ) : (
        <>
          <div className='mt-5 flex items-center text-xl font-bold'>
            <h2 className='mr-2'>Total Balance:</h2>
            <INRIcon className='h-6 w-6' />
            <h2>{formatAmount(getBalance())}</h2>
          </div>
          <ul className='xs:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] mt-10 grid w-full gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {data?.data?.map((acc, index) => (
              <li
                key={acc.name}
                className={`flex min-w-0 flex-col gap-2 rounded-2xl ${colors[index % colors.length]} p-5 text-gray-200`}
              >
                <div className='flex w-full justify-between gap-2'>
                  <h2 className='text-lg font-semibold'>{getAccountOption(acc.type)?.label}</h2>{' '}
                  <div className='relative h-full max-h-8 w-full max-w-8'>
                    <Image
                      src={getAccountOption(acc.type)?.icon || ''}
                      alt={acc.name}
                      fill
                      className='object-contain'
                    />
                  </div>
                </div>

                <h3 className='text-xl font-semibold uppercase'>{acc.name}</h3>
                <h3 className='mt-20 flex gap-2 text-3xl font-semibold break-all uppercase'>
                  <AmountWithCurrencyIcon
                    iconClassName='!max-w-8 !max-h-8'
                    currency={acc.currency}
                    amount={acc.balance}
                  />
                </h3>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default AccountsList;
