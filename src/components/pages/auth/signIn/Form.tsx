'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import IAuthInfoProps from '../authInfo.interface';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { IError } from '@/services/api/fetch/fetch';
import { useState } from 'react';
import FormInput from '@/components/forms/FormInput';
import { Button } from '@/components/ui/button';
import { SigninValidator } from '@/lib/validations/validators/user';

type SigninFormData = Yup.InferType<typeof SigninValidator>;

const SignInForm = ({ toggle }: IAuthInfoProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: yupResolver(SigninValidator),
  });
  const { handleSubmit, reset } = form;
  const credentialLoginMutation = useMutation<void, IError, SigninFormData>({
    mutationFn: async (data) => {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res) throw { message: 'No response from server' } as IError;
      if (res.error) throw { message: res.error } as IError;
    },
    onSuccess: () => {
      toast.success('Logged in successfully!');
      reset();
      router.push('/dashboard');
    },
    onError: (err) => {
      toast.error(err.message || 'Signin failed');
    },
  });

  const onSubmit = (data: SigninFormData) => {
    credentialLoginMutation.mutate(data);
  };

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // trigger next-auth signIn for Google
      const res = await signIn('google');

      // sometimes res is null because the redirect flow hasn't completed
      if (!res) return; // just ignore it

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success('Logged in with Google!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Google login error:', error);
      toast.error((error as IError)?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-80 px-6'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          <FormInput placeholder='Enter Email' label='Email' name='email' required />
          <FormInput
            type='password'
            placeholder='Enter Password'
            label='Password'
            name='password'
            required
          />

          <Button type='submit' disabled={credentialLoginMutation.isPending} className='w-full'>
            {credentialLoginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className='my-2 text-center text-sm text-gray-500'>or</p>

        <Button
          type='button'
          onClick={() => handleGoogleLogin()}
          disabled={loading}
          className='w-full bg-blue-600'
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </FormProvider>

      <p className='mt-4 text-center text-sm'>
        Don’t have an account?{' '}
        <Button
          onClick={toggle}
          className='cursor-pointer bg-transparent p-1 text-blue-600 hover:bg-transparent hover:underline'
        >
          Sign up
        </Button>
      </p>
    </div>
  );
};

export default SignInForm;
