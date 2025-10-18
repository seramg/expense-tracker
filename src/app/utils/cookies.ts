import { getCookie as nextGetCookie, deleteCookie as nextDeleteCookie } from 'cookies-next';

const isServer = typeof window === undefined;

export const getCookie = async (name: string, options?: object) => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    const cookieValue = await cookies();
    const namedValue = cookieValue.get(name)?.value.toString();
    return namedValue;
  }

  const cookieValue = nextGetCookie(name, options);
  return cookieValue?.toString();
};

export const deleteCookie = async (name: string, options?: object) => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete(name);
    return true;
  }

  // --- Client-side (browser) ---
  nextDeleteCookie(name, options);
  return true;
};
