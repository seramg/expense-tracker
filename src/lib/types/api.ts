export type ApiResponse<T> = {
  message?: string;
  status?: number;
  data?: T | null;
};
