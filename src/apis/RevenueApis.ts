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
};
