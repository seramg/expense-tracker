'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountValidator } from '@/lib/validations/validators/account';
import { useForm } from 'react-hook-form';
import { usePostMutation } from '@/hooks/reactQuery/usePostMutation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button/button';

type AccountFormData = Yup.InferType<typeof AccountValidator>;

const AccountForm = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(AccountValidator),
  });

  const { mutate, error, isError, isPending } = usePostMutation<AccountFormData>('/api/accounts');

  const submitHandler = (data: AccountFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success('Account Created!');
      },
      onError(err) {
        toast.error(err?.message || 'Failed to create account');
      },
      onSettled() {
        reset();
      },
    });
  };

  return (
    <div className='flex w-full items-center justify-center'>
      <Dialog>
        <form className='space-y-3'>
          <DialogTrigger asChild>
            <Button variant='outline' className='cursor-pointer'>
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
            </DialogHeader>
            <input
              type='text'
              placeholder='Account Name'
              className='w-full rounded border p-2 focus:ring focus:ring-blue-300 focus:outline-none'
              {...register('name')}
              required
            />

            <select
              className='w-full rounded border p-2 focus:ring focus:ring-blue-300'
              {...register('type')}
            >
              <option value='bank'>Bank</option>
              <option value='cash'>Cash</option>
              <option value='wallet'>Wallet</option>
              <option value='credit'>Credit</option>
            </select>

            <input
              type='number'
              placeholder='Opening Balance'
              className='w-full rounded border p-2 focus:ring focus:ring-blue-300 focus:outline-none'
              {...register('balance')}
            />

            <input
              type='text'
              placeholder='INR'
              className='w-full rounded border p-2 focus:ring focus:ring-blue-300 focus:outline-none'
              {...register('currency')}
            />

            {isError && <p className='text-sm text-red-500'>{error?.message}</p>}

            <button
              type='submit'
              disabled={isPending}
              className='w-full rounded bg-green-500 py-2 text-white transition hover:bg-green-600'
              onClick={handleSubmit(submitHandler)}
            >
              {isPending ? 'Saving...' : 'Save Account'}
            </button>

            <button
              type='button'
              className='w-full rounded bg-gray-300 py-2 text-gray-800 hover:bg-gray-400'
            >
              Cancel
            </button>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default AccountForm;
