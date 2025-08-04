import { ApiError } from "./ApiError";
import { Cookie } from "lucide-react";
import Cookies from "js-cookie";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

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