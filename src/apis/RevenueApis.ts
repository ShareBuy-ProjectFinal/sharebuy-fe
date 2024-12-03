import { formatDate } from 'utils/function';
import axiosClient from './setup/axiosClient';

export const RevenueApis = {
  getByTime: async (params: any): Promise<any> => {
    const { shop_id, start_date, end_date, interval } = params;
    return await axiosClient.post('/api/orders/revenue/by-time', {
      shop_id,
      start_date,
      end_date,
      interval,
    });
  },

  getOverviewByTime: async (params: any): Promise<any> => {
    const { shop_id, start_date, end_date } = params;
    return await axiosClient.post('/api/orders/revenue/overview', {
      shop_id,
      start_date,
      end_date,
    });
  },

  getByProduct: async (params: any): Promise<any> => {
    const { shop_id, start_date, end_date } = params;
    return await axiosClient.post('/api/orders/revenue/by-product', {
      shop_id,
      start_date: formatDate(start_date, 'YYYY-MM-DD'),
      end_date: formatDate(end_date, 'YYYY-MM-DD'),
    });
  },

  getByCategory: async (params: any): Promise<any> => {
    const { shop_id, start_date, end_date } = params;
    return await axiosClient.post('/api/orders/revenue/by-category', {
      shop_id,
      start_date: formatDate(start_date, 'YYYY-MM-DD'),
      end_date: formatDate(end_date, 'YYYY-MM-DD'),
    });
  },
};
