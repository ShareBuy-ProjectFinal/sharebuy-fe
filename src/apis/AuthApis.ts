import axiosClient from './setup/axiosClient';

const AuthApi = {
  signIn: async (code: string): Promise<any> => {
    return await axiosClient.post('/auth/login', {
      code,
      app_name: process.env.REACT_APP_NAME ?? 'DMS-ADMIN',
    });
  },

  getMe: async (): Promise<any> => {
    return await axiosClient.get('/auth/me');
  },
};

export default AuthApi;
