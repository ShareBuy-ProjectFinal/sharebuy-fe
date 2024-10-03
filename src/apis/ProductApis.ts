import create from '@ant-design/icons/lib/components/IconFont';
import axiosClient from './setup/axiosClient';
import {
  IProdcutNew,
  IProductDetail,
  IProductDetailUpdate,
  IProductUpdate,
} from 'interfaces/Product/Product';

const path = '/api/products/products';
const pathDetail = '/api/products/product-details';
const ProductApis = {
  createProduct: async (data: IProdcutNew): Promise<any> => {
    return await axiosClient.post(`${path}`, data);
  },
  createProductDetail: async (data: IProductDetail): Promise<any> => {
    return await axiosClient.post(`${pathDetail}`, data);
  },
  updateProduct: async (data: IProductUpdate): Promise<any> => {
    return await axiosClient.put(`${path}/${data._id}`, data);
  },
  updateProductDetail: async (data: IProductDetailUpdate): Promise<any> => {
    return await axiosClient.put(`${pathDetail}/${data._id}`, data);
  },
  getByCategoryID: async (data: {
    id: any;
    limit?: number;
    page?: number;
  }): Promise<any> => {
    const { id, ...params } = data;
    return await axiosClient.get(`${path}/category/${id}`, { params });
  },
  getById: async (productId: any): Promise<any> => {
    return await axiosClient.get(`${path}/${productId}`);
  },
  getByShopId: async (data: any): Promise<any> => {
    const { id, page, page_size } = data;
    return await axiosClient.get(`${path}/shop/${id}`, {
      params: { page, page_size },
    });
  },
  getProductDetails: async (productId: any): Promise<any> => {
    return await axiosClient.get(`${pathDetail}/products/${productId}`);
  },
};

export default ProductApis;
