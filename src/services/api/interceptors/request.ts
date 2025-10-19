// import { getCookie } from '@/app/utils/cookies';
// import { CookieKeys } from '@/constants/app';

/**
 * Request interceptor for FetchApi
 *
 * Previously, this added an Authorization header with a token from localStorage/cookie.
 * But we are not storing any token manually in the local storage.
 * With NextAuth we are getting a HTTP-only cookies for JWT sessions, which the browser automatically sends the cookie on same-origin requests.
 * /api routes can recognize the tokens using getToken
 *
 * Therefore:
 * - No need to manually attach the token in headers
 * - Cookies are automatically included for requests to /api routes
 * - This keeps the token secure (HTTP-only) and avoids client-side exposure
 */

const requestInterceptor = async (config: RequestInit): Promise<RequestInit> => {
  // const token = await getCookie(CookieKeys.TOKEN);

  const finalConfig: RequestInit = {
    ...config,
    headers: {
      ...config?.headers,
    },
  };

  // if (token) {
  //   finalConfig.headers = {
  //     ...finalConfig.headers,
  //     Authorization: `Bearer ${token}`,
  //   };
  // }

  return finalConfig;
};

export default requestInterceptor;
