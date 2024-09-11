import axiosClient from './setup/axiosClient';

const path = '/api/categories/categories';
const CategoryApis = {
  getAll: async () => {
    return await axiosClient.get(`${path}`);
  },
};

export default CategoryApis;
