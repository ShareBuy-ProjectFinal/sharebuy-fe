import axios from 'axios';
import axiosClient from './setup/axiosClient';
import axiosClientS3 from './setup/axiosClientS3';
import { TDownLoadTemplate } from 'components/Import/ModalImport';

export const UploadApis = {
  uploadImage: async (data: FormData) => {
    return await axiosClientS3.post('/upload', data);
  },
  downloadTemplate: async ({ fileName, url }: TDownLoadTemplate) => {
    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const objectURL = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = objectURL;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error(error);
    }
  },
};
