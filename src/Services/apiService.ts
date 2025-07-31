import Cookies from 'js-cookie';

export const API_BASE_URL = 'https://localhost:7001/api';
//Generic interface for handling API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;}

//Custom error class to wrap and throw meaningful errors from the API.like unauthorized access, not found, etc.
// apiError.ts
export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}


export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = Cookies.get('accessToken');
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const body = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new ApiError(
        response.status,
        body?.message || `HTTP error! status: ${response.status}`,
        body?.errors
      );
    }

    return body;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, 'Network error occurred', {});
  }
};



