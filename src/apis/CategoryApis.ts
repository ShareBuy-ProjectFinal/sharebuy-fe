import axiosClient from './setup/axiosClient';

const path = '/api/categories/categories';
const CategoryApis = {
  getAll: async () => {
    return await axiosClient.get(`${path}`);
  },

  getById: async (id: string) => {
    return await axiosClient.get(`${path}/${id}`);
  },
};

export default CategoryApis;
