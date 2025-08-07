import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { ApiError } from "./ApiError";
import { showLoading, hideLoading } from "../Components/common/LoadingSpinner";


export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let activeRequests = 0;

const updateLoadingState = () => {
  if (activeRequests > 0) {
    showLoading();
  } else {
    hideLoading();
  }
};


axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  activeRequests++;
  updateLoadingState();
  return config;
}, (error) => {
  activeRequests--;
  updateLoadingState();
  return Promise.reject(error);
});


let isRefreshing = false;
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(prom => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};


interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


const setAuthHeader = (request: CustomAxiosRequestConfig, token: string) => {
  request.headers = request.headers || {};
  request.headers.Authorization = `Bearer ${token}`;
};


axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    updateLoadingState();
    return response;
  },
  async (error) => {
    activeRequests--;
    updateLoadingState();

    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
        throw new ApiError(401, "No refresh token", {});
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { token: refreshToken });
        Cookies.set("accessToken", data.accessToken);

        axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        setAuthHeader(originalRequest, data.accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status || 0;
    const message = error.response?.data?.message || 'An error occurred';
    const errors = error.response?.data?.errors;

    throw new ApiError(status, message, errors);
  }
);

export default axiosInstance;
