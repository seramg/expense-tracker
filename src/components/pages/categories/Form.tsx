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
import { CategoryValidator } from '@/lib/validations';
import { TransactionType } from '@prisma/client';
import { CATEGORY_OPTIONS } from '@/constants/categories';

type CategoryFormData = Yup.InferType<typeof CategoryValidator>;

const CategoryForm = ({ refetchList }: { refetchList?: () => void }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    resolver: yupResolver(CategoryValidator),
    defaultValues: {
      name: '',
      type: TransactionType.debit,
    },
  });
  const { handleSubmit, reset } = form;
  const { mutate, isPending } = usePostMutation<CategoryFormData>('/api/categories');

  const submitHandler = (data: CategoryFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success('Category Created!');
        reset();
        setIsDialogOpen(false);
        refetchList?.();
      },
      onError(err) {
        toast.error(err?.message || 'Failed to create a category');
      },
    });
  };

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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <FormInput
              placeholder='Enter Category Name'
              name='name'
              label='Category Name'
              required
            />
            <FormSelect name='type' label='Category Type' required options={CATEGORY_OPTIONS} />
            <Button
              type='submit'
              disabled={isPending}
              color='green'
              className='w-full'
              onClick={handleSubmit(submitHandler)}
            >
              {isPending ? 'Saving...' : 'Save Category'}
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

export default CategoryForm;
