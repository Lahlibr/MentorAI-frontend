import axios from "axios";
import { showLoading, hideLoading } from '../Components/common/LoadingSpinner';
import { ApiError } from "./ApiError";
import Cookies from "js-cookie";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001/api';

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

axiosInstance.interceptors.request.use((config)=>{
  const token = Cookies.get('accessToken');
  if (token) {
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
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => { 
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    }else {
      prom.reject(error);
    }});
    failedQueue = [];
};

axiosInstance.interceptors.response.use((response) => {
  activeRequests--;
  updateLoadingState();
  return response;
}, 
async (error) => {
  activeRequests--;
  updateLoadingState();

  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);  
      });
    }
    originalRequest._retry = true;
    isRefreshing = true;

    try{
      const refreshToken = Cookies.get('refreshToken');
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { token: refreshToken });
      Cookies.set('accessToken', data.accessToken);
      axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
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