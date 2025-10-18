'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { SignInForm } from '@/components/pages/auth/signIn';
import { SignupForm } from '@/components/pages/auth/signUp/Form';

export default function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className='w-[380px] rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-sm'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='text-2xl font-semibold tracking-tight'>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode='wait'>
            {isSignUp ? (
              <motion.div
                key='signup'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                <SignupForm toggle={() => setIsSignUp(false)} />
              </motion.div>
            ) : (
              <motion.div
                key='signin'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
              >
                <SignInForm toggle={() => setIsSignUp(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
