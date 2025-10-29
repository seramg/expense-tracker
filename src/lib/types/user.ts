export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string | null;
  isAdmin?: boolean;
  image?: string | null;
  provider?: string; // for Google, etc.
  googleId?: string | null;
}

export interface IUserRef {
  id: string;
  name: string;
  email?: string;
  image?: string;
}
