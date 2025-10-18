import * as Yup from 'yup';
import { Messages } from '../messages';
import { ICategory } from '@/app/types/category';
export const CategoryValidator = Yup.object({
  name: Yup.string().required(Messages.REQUIRED('Category name')),
  type: Yup.mixed<ICategory['type']>()
    .oneOf(['credit', 'debit'], Messages.INVALID_TYPE)
    .required(Messages.REQUIRED('Category type')),
});
