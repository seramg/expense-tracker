import { getCookie } from '@/app/utils/cookies';
import { CookieKeys } from '@/constants/app';

const requestInterceptor = async (config: RequestInit): Promise<RequestInit> => {
  const token = await getCookie(CookieKeys.TOKEN);

  const finalConfig: RequestInit = {
    ...config,
    headers: {
      ...config?.headers,
    },
  };

  if (token) {
    finalConfig.headers = {
      ...finalConfig.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return finalConfig;
};

export default requestInterceptor;
