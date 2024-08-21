import axios from 'axios';
import axiosRetry from 'axios-retry';
import { auth } from 'configs/firebaseConfig';
import querystring from 'qs';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'X-Custom-Header': 'foobar' },
  paramsSerializer: (params) => {
    return querystring.stringify(params, { arrayFormat: 'brackets' });
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = auth.currentUser?.getIdToken();

  if (token) {
    (config as any).headers.Authorization = token ? `Bearer ${token}` : '';
  }
  // (config as any).headers["x-private-key"] =
  //   process.env.REACT_APP_X_PRIVATE_KEY;
  // (config as any).headers["x-application-name"] =
  //   process.env.REACT_APP_X_APPLICATION_NAME;

  return config;
});

axiosClient.interceptors.response.use((response) => {
  return response.data;
});

axiosRetry(axiosClient, {
  retries: 2, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    return error.response?.status === 401;
  },
});

export default axiosClient;
