import API from '@/services/api/api';
import { IError, IResponse } from '@/services/api/fetch/fetch';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

interface IUseGetQueryOptions<T> {
  options?: Omit<
    UseQueryOptions<IResponse<T>, IError, IResponse<T>, readonly unknown[]>,
    'queryKey' | 'queryFn'
  >;
  config?: RequestInit;
  dependency?: readonly (string | number)[];
}

export function useGetQuery<T>(path: string, props: IUseGetQueryOptions<T> = {}) {
  const { options, config, dependency = [] } = props;

  return useQuery<IResponse<T>, IError>({
    ...options,
    queryKey: [path, ...dependency] as const,
    queryFn: () => API.get<T>(path, config),
  });
}
