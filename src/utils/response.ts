export interface ApiResponse<T = any> {
  data: T;
  message: string;
  error?: string;
}

export function success<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { data, message };
}

export function failure(message = 'Error', error?: string): ApiResponse<null> {
  return { data: null, message, error };
}
