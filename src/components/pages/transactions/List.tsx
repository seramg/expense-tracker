'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { useGetQuery } from '@/hooks/reactQuery/useGetQuery';
import React from 'react';
import { ITransaction } from '@/lib/types/transaction';
import { formatDate } from '@/utils/formatDate';
import { CurrencyType, TransactionType } from '@prisma/client';
import { CURRENCY_OPTIONS } from '@/constants/accounts';
import formatAccount from '@/utils/formatAmount';
import INRIcon from '@/constants/icons/INR';
import USDIcon from '@/constants/icons/USD';
import TransactionForm from './Form';
import { CATEGORY_OPTIONS } from '@/constants/categories';

const TransactionsList = () => {
  const { data, isLoading, error, refetch } = useGetQuery<ITransaction[]>(`/api/transactions`);

  const getCurrencyOption = (type?: CurrencyType) =>
    CURRENCY_OPTIONS.find((currencyOption) => currencyOption.value === type);
  const getCategoryOption = (type?: TransactionType) =>
    CATEGORY_OPTIONS.find((categoryOption) => categoryOption.value === type);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className='flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:justify-between'>
        <h1 className='text-3xl font-bold'>My Transactions</h1>
        <TransactionForm refetchList={refetch} />
      </div>
      {isLoading ? (
        <p className='mt-5'>Loading transactions...</p>
      ) : (
        <div className='mt-5 overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Merchant Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(transaction.createdAt!)}</TableCell>
                  <TableCell>{transaction.merchant}</TableCell>

                  <TableCell>{transaction.category?.name}</TableCell>
                  <TableCell>{getCategoryOption(transaction.category?.type)?.label}</TableCell>
                  <TableCell className='flex items-center justify-end text-right'>
                    {getCurrencyOption(transaction.currency)?.value === CurrencyType.INR && (
                      <INRIcon className='h-full max-h-4 w-full max-w-4' />
                    )}
                    {getCurrencyOption(transaction.currency)?.value === CurrencyType.USD && (
                      <USDIcon className='h-full max-h-4 w-full max-w-4' />
                    )}
                    {formatAccount(transaction.amount ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default TransactionsList;
