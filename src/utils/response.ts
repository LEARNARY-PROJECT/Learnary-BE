export interface ApiResponse<T = any> {
  success:boolean;
  data: T;
  message: string;
  error?: string;
}

export function success<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { success:true,data, message };
}

export function failure(message = 'Error', error?: string): ApiResponse<null> {
  return { success:false,data: null, message, error };
}
