'use client';
import { useGetQuery } from '@/hooks/reactQuery/useGetQuery';
import { IAccount } from '@/lib/types/account';
import React from 'react';

const AccountsList = () => {
  const { data, isLoading, error } = useGetQuery<IAccount[]>(`/api/accounts`);

  if (isLoading) return <p>Loading accounts...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {' '}
      <div>AccountsList</div>{' '}
      <ul>
        {data?.data?.map((acc) => (
          <li key={acc.name}>
            {acc.name} - {acc.balance}
          </li>
        ))}
      </ul>
    </>
  );
};

export default AccountsList;
