'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { usePostMutation } from '@/hooks/reactQuery/usePostMutation';
import IAuthInfoProps from '../authInfo.interface';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import { SignupValidator } from '@/lib/validations';

type SignupFormData = Yup.InferType<typeof SignupValidator>;

const SignupForm = ({ toggle }: IAuthInfoProps) => {
  const form = useForm({
    resolver: yupResolver(SignupValidator),
  });
  const { handleSubmit, reset } = form;
  const mutation = usePostMutation<SignupFormData>('/api/users/signup');
  const { mutate, isPending } = mutation;

  const onSubmitHandler = (data: SignupFormData) => {
    mutate(data, {
      onSuccess() {
        toast.success('User created successfully!', {
          description: 'Please sign in to continue.',
        });
        toggle();
      },
      onError(error) {
        throw new Error(error?.message || 'Signup failed');
      },
      onSettled() {
        reset();
      },
    });
  };

  return (
    <div className='w-80 px-6'>
      <FormProvider {...form}>
        <form className='space-y-3'>
          <FormInput name='name' placeholder='Enter Full Name' label='Full Name' required />
          <FormInput name='email' type='email' placeholder='Enter Email' label='Email' required />
          <FormInput
            name='password'
            type='password'
            placeholder='Enter Password'
            label='Password'
            required
          />

          <Button
            type='submit'
            disabled={isPending}
            color='green'
            className='w-full'
            onClick={handleSubmit(onSubmitHandler)}
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </FormProvider>
      <p className='mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Button
          onClick={toggle}
          className='cursor-pointer bg-transparent p-1 text-blue-600 hover:bg-transparent hover:underline'
        >
          Sign in
        </Button>
      </p>
    </div>
  );
};

export default SignupForm;
