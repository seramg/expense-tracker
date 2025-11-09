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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: yupResolver(AccountValidator),
    defaultValues: {
      name: '',
      balance: 0,
      currency: 'INR',
    },
  });
  const { handleSubmit, reset } = form;
  const { mutate, isPending } = usePostMutation<AccountFormData>('/api/accounts');

  const submitHandler = (data: AccountFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success('Account Created!');
        reset();
        setIsDialogOpen(false);
      },
      onError(err) {
        toast.error(err?.message || 'Failed to create account');
      },
    });
  };

  return (
    <div className='flex w-full items-center justify-center'>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
          }
          setIsDialogOpen(open);
        }}
      >
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
              <FormSelect name='type' label='Account Type' required options={ACCOUNT_TYPES} />
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

              <Button
                type='submit'
                disabled={isPending}
                color='green'
                className='w-full'
                onClick={handleSubmit(submitHandler)}
              >
                {isPending ? 'Saving...' : 'Save Account'}
              </Button>

              <Button
                type='button'
                color='gray'
                className='w-full'
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
};

export default AccountForm;
