import * as Yup from 'yup';
import { Messages } from '../messages';
import { ICategory } from '@/lib/types/category';
import { CATEGORY_TYPES } from '@/constants/categories';
export const CategoryValidator = Yup.object({
  name: Yup.string().required(Messages.REQUIRED('Category name')),
  type: Yup.mixed<ICategory['type']>()
    .oneOf(CATEGORY_TYPES, Messages.INVALID_TYPE)
    .required(Messages.REQUIRED('Category type')),
});
