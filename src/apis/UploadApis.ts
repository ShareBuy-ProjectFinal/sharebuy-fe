import axiosClient from './setup/axiosClient';
import axiosClientS3 from './setup/axiosClientS3';

export const UploadApis = {
  uploadImage: async (data: FormData) => {
    return await axiosClientS3.post('/upload', data);
  },
};
