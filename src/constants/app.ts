export const AppConstants = {
  authToken: "token",
} as const;
export const CookieKeys = {
  TOKEN: AppConstants.authToken?.toString(),
} as const;
