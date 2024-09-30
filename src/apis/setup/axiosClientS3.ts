import axios from 'axios';
import axiosRetry from 'axios-retry';
import { auth } from 'configs/firebaseConfig';
import querystring from 'qs';
import queryString from 'query-string';

const axiosClientS3 = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_UPLOAD_S3_URL,
  paramsSerializer: (params: any) =>
    queryString.stringify(params, { arrayFormat: 'bracket' }),
});

axiosClientS3.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    localStorage.setItem('token', token);
    (config as any).headers.Authorization = token ? `Bearer ${token}` : '';
  }
  return config;
});

axiosClientS3.interceptors.response.use((response) => {
  return response.data;
});

axiosRetry(axiosClientS3, {
  retries: 2, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    return error.response?.status === 401;
  },
});

export default axiosClientS3;
