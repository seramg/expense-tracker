'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountValidator } from '@/lib/validations/validators/account';
import { Form, FormProvider, useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';
import { CURRENCY_TYPES, ACCOUNT_TYPES } from '@/constants/accounts';

type AccountFormData = Yup.InferType<typeof AccountValidator>;

const AccountForm = () => {
  const form = useForm({
    resolver: yupResolver(AccountValidator),
  });
  const { register, handleSubmit, reset } = form;
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
        <FormProvider {...form}>
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
              <FormInput
                placeholder='Enter Account Name'
                name='name'
                label='Account Name'
                required
              />
              <FormSelect name='type' label='Bank' required options={ACCOUNT_TYPES} />
              <FormInput
                type='number'
                name='balance'
                placeholder='Enter Opening Balance'
                label='Opening Balance'
              />
              <FormSelect
                name='currency'
                placeholder='Select Currency Type'
                label='Select Currency Type'
                options={CURRENCY_TYPES}
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
        </FormProvider>
      </Dialog>
    </div>
  );
};

export default AccountForm;
