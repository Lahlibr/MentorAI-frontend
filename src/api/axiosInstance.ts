import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { ApiError } from "./ApiError";
import { showLoading, hideLoading } from "../Components/common/LoadingSpinner";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api';


// Axios instance configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request tracking and loading state
let activeRequests = 0;
let retryCount = 0;
const MAX_RETRIES = 1;

const safelyUpdateActiveRequests = (delta: number) => {
  activeRequests = Math.max(0, activeRequests + delta);
  updateLoadingState();
};

const updateLoadingState = () => {
  activeRequests > 0 ? showLoading() : hideLoading();
};

// Token refresh queue
let isRefreshing = false;
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    token ? prom.resolve(token) : prom.reject(error);
  });
  failedQueue = [];
};

// Extended Axios config
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const setAuthHeader = (config: CustomAxiosRequestConfig, token: string) => {
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      setAuthHeader(config, token);
    }
    safelyUpdateActiveRequests(1);
    return config;
  },
  (error) => {
    safelyUpdateActiveRequests(-1);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    safelyUpdateActiveRequests(-1);
    return response;
  },
  async (error) => {
    safelyUpdateActiveRequests(-1);
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle 401 errors
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        retryCount < MAX_RETRIES) {
      
      originalRequest._retry = true;
      retryCount++;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          setAuthHeader(originalRequest, token);
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        processQueue(new ApiError(401, "No refresh token", {}));
        throw new ApiError(401, "No refresh token", {});
      }
      if (error.response?.status === 400) {
      console.group('🔴 400 Bad Request Details');
      console.log('URL:', error.config?.url);
      console.log('Method:', error.config?.method);
      console.log('Request Headers:', error.config?.headers);
      console.log('Request Data:', error.config?.data);
      console.log('Response Status:', error.response?.status);
      console.log('Response Headers:', error.response?.headers);
      console.log('Response Data:', error.response?.data);
      console.groupEnd();
    }

      try {
        // Add retry delay to prevent thundering herd
        const retryDelay = Math.min(1000 * 2 ** retryCount, 30000);
        await new Promise(resolve => setTimeout(resolve, retryDelay));

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { 
          token: refreshToken 
        });

        // Secure cookie settings
        Cookies.set("accessToken", data.accessToken, {
          secure: true,
          sameSite: 'strict',
          expires: 1 // 1 day
        });

        setAuthHeader(originalRequest, data.accessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    
    const status = error.response?.status || 0;
    const message = error.response?.data?.message || error.message || 'Network error';
    const errors = error.response?.data?.errors || {};

    throw new ApiError(status, message, errors);
  }
);

export default axiosInstance;