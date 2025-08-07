import axios from "axios"; // <-- Needed for isAxiosError
import axiosInstance from "./axiosInstance";
import { ApiError } from "./ApiError";

export const apiCall = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  config?: object
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 0;
      const message = error.response?.data?.message || 'Network error';
      const errors = error.response?.data?.errors;

      throw new ApiError(status, message, errors);
    }

    throw new ApiError(0, 'An unknown error occurred');
  }
};
