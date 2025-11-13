import * as Yup from 'yup';
import { Messages } from '../messages';
import { Regex } from '../regex';

export const UserValidator = Yup.object({
  id: Yup.string().required(Messages.REQUIRED('User id')),
  name: Yup.string()
    .required(Messages.REQUIRED('Name'))
    .matches(Regex.personName, Messages.INVALID_NAME),
  email: Yup.string()
    .required(Messages.REQUIRED('Email'))
    .matches(Regex.email, Messages.INVALID_EMAIL),
  password: Yup.string().when('provider', {
    is: (provider: string) => provider === 'credentials',
    then: (schema) =>
      schema
        .required(Messages.REQUIRED('Password'))
        .matches(Regex.password, Messages.INVALID_PASSWORD),
    otherwise: (schema) => schema.optional(),
  }),
  phone: Yup.string().optional().matches(Regex.phone, Messages.INVALID_PHONE),
  image: Yup.string().url().optional(),
  provider: Yup.string().optional(),
});

export const SignupValidator = UserValidator.pick(['name', 'email', 'password']);

export const SigninValidator = UserValidator.pick(['email', 'password']);
