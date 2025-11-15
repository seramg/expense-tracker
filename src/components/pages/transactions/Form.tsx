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
import { CURRENCY_TYPES, ACCOUNT_OPTIONS, CURRENCY_OPTIONS } from '@/constants/accounts';
import { CategoryValidator, TransactionValidator } from '@/lib/validations';
import { TransactionType } from '@prisma/client';
import { CATEGORY_OPTIONS } from '@/constants/categories';
import { useGetQuery } from '@/hooks/reactQuery/useGetQuery';
import { ICategory } from '@/lib/types/category';
import { IOptions } from '@/components/forms/forms.interface';
import { IAccount } from '@/lib/types/account';
import { ICONS } from '@/constants/icons';

type TransactionFormData = Yup.InferType<typeof TransactionValidator>;

const TransactionForm = ({ refetchList }: { refetchList?: () => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: yupResolver(TransactionValidator),
    defaultValues: {
      merchant: '',
      amount: 0,
    },
  });
  const { handleSubmit, reset, watch, formState } = form;
  const { mutate, isPending } = usePostMutation<TransactionFormData>('/api/transactions');
  console.log(formState.errors);
  const submitHandler = (data: TransactionFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success('Transaction Created!');
        reset();
        setIsDialogOpen(false);
        refetchList?.();
      },
      onError(err) {
        toast.error(err?.message || 'Failed to create a transaction');
      },
    });
  };
  const categoryType = watch('type');
  const { data: categoryList, isLoading: categoryListLoading } = useGetQuery<ICategory[]>(
    `/api/categories?type=${categoryType}`,
    { options: { enabled: categoryType != undefined } },
  );

  const categoryListOptions: IOptions[] | undefined = categoryList?.data.map((category) => ({
    label: category.name,
    value: category.id ?? '',
  }));

  const { data: accountList, isLoading: accountListLoading } =
    useGetQuery<IAccount[]>(`/api/accounts`);
  const accountListOptions: IOptions[] | undefined = accountList?.data.map((account) => ({
    label: account.name,
    value: account.id ?? '',
    icon: ICONS[account.type],
  }));

  return (
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
            <Button variant='outline' className='w-min cursor-pointer text-lg'>
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <FormInput
              placeholder='Enter Merchant Name'
              name='merchant'
              label='Merchant Name'
              required
            />
            <div className='flex gap-2'>
              <FormSelect
                name='currency'
                placeholder='Select Currency Type'
                label='Select Currency Type'
                options={CURRENCY_OPTIONS}
              />
              <FormInput type='number' name='amount' placeholder='Enter Amount' label='Amount' />
            </div>
            <FormSelect name='type' label='Category Type' required options={CATEGORY_OPTIONS} />
            <FormSelect
              name='categoryId'
              label='Category ID'
              required
              options={categoryListOptions}
              isLoading={categoryListLoading}
            />
            {categoryType != undefined && categoryType !== TransactionType.credit && (
              <FormSelect
                name='fromAccountId'
                label='From Account'
                required
                options={accountListOptions}
                isLoading={accountListLoading}
              />
            )}
            {categoryType != undefined && categoryType !== TransactionType.debit && (
              <FormSelect
                name='toAccountId'
                label='To Account'
                required
                options={accountListOptions}
                isLoading={accountListLoading}
              />
            )}
            <Button
              type='submit'
              disabled={isPending}
              color='green'
              className='w-full'
              onClick={handleSubmit(submitHandler)}
            >
              {isPending ? 'Saving...' : 'Save Transaction'}
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
  );
};

export default TransactionForm;
