import { IUser } from "../types/user";

export const mapUser = (user: IUser | null): IUser | null => {
  if (!user) return null;

  return {
    id: user.id?.toString(),
    name: user.name,
    email: user.email,
    phone: user?.phone,
    isAdmin: user.isAdmin || false,
    image: user?.image,
  };
};
