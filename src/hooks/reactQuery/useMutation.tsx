import API from '@/services/api/api';
import { IError, IResponse } from '@/services/api/fetch/fetch';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

interface IUsePostQueryOptions<T> {
  options?: Omit<UseMutationOptions<IResponse<T>, IError, unknown, string[]>, 'mutationFn'>;
  config?: RequestInit;
  dependency?: string[];
  formData?: boolean;
}

export function usePostMutation<T>(path: string, props: IUsePostQueryOptions<T> = {}) {
  const { options, config } = props;

  return useMutation<IResponse<T>, IError, unknown, string[]>({
    ...options,
    mutationFn: (data: unknown) => API.post<T, typeof data>(path, data, config),
  });
}
