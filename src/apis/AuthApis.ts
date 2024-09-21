import { auth } from 'configs/firebaseConfig';
import axiosClient from './setup/axiosClient';

const path = '/api/users/users';
const AuthApi = {
  // signIn: async (code: string): Promise<any> => {
  //   return await axiosClient.post('/auth/login', {
  //     code,
  //     app_name: process.env.REACT_APP_NAME ?? 'DMS-ADMIN',
  //   });
  // },

  getMe: async (): Promise<any> => {
    return await axiosClient.get(`${path}/firebase/${auth.currentUser?.uid}`);
  },
  updateById: async (params: { id: any; body: any }): Promise<any> => {
    return await axiosClient.put(`${path}/${params.id}`, params.body);
  },
  createUser: async (params: any): Promise<any> => {
    return await axiosClient.post(`${path}`, params);
  },
};

export default AuthApi;
