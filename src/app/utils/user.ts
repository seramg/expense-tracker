import { User } from '@prisma/client';

export const mapUser = (user: User): User | null => {
  if (!user) return null;

  return {
    ...user,
    password: null,
    phone: null,
    isAdmin: user.isAdmin || false,
    googleId: null,
  };
};
