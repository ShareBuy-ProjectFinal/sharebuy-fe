import create from '@ant-design/icons/lib/components/IconFont';
import axiosClient from './setup/axiosClient';

const path = '/api/products/products';
const ProductApis = {
  createProduct: async (data: any): Promise<any> => {
    return await axiosClient.post(`${path}`, data);
  },
  getByCategoryID: async (data: {
    id: any;
    limit?: number;
    page?: number;
  }): Promise<any> => {
    const { id, ...params } = data;
    return await axiosClient.get(`${path}/category/${id}`, { params });
  },
  getByShopId: async (data: any): Promise<any> => {
    const { id, ...params } = data;
    return await axiosClient.get(`${path}/shop/${id}`, { params });
  },
};

export default ProductApis;
