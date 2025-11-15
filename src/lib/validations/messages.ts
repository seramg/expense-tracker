// utils/messages.ts
export const Messages = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD:
    'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
  INVALID_NAME: 'Name can only contain letters, spaces, and hyphens',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_AMOUNT: (field: string) => `${field} must be a positive number`,
  INVALID_CURRENCY: 'Currency must be a valid 3-letter code (e.g. USD, INR)',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_TYPE: 'Invalid type value',
  INVALID_CATEGORY: 'Invalid category',
  INVALID_CATEGORY_TYPE: 'Invalid category type',
  INVALID_ACCOUNT: 'Invalid account',
};
