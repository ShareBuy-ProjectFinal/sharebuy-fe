import { useUser } from 'contexts/UserProvider';
import axiosClient from './setup/axiosClient';

export type StatusOrder =
  | 'PENDING'
  | 'PREPARING'
  | 'DELIVERY'
  | 'COMPLETED'
  | 'CANCELED';
const OrderApis = {
  getById: async (params: { orderId: any }): Promise<any> => {
    const { orderId } = params;
    return await axiosClient.get(`/api/orders/${orderId}`);
  },
  getOrderByStatus: async (params: {
    userId: string;
    status?: StatusOrder;
    page: number;
    page_size: number;
  }): Promise<any> => {
    const { userId, status, page, page_size } = params;
    return await axiosClient.get(`/api/orders/shop/${userId}`, {
      params: { page, limit: page_size, ...(status && { status }) },
    });
  },

  updateStatusById: async (params: {
    orderId: string;
    status: 'DELIVERY' | 'COMPLETED' | 'CANCELED';
  }): Promise<any> => {
    const { orderId, status } = params;
    return await axiosClient.put(`/api/orders/${orderId}`, {
      status,
    });
  },
};

export default OrderApis;
