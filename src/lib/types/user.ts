export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  phone?: string;
  isAdmin?: boolean;
  image?: string;
  provider?: string; // for Google, etc.
  googleId?: string;
}

export interface IUserRef {
  id: string;
  name: string;
  email?: string;
  image?: string;
}
