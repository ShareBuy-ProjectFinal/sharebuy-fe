import { IInventoryNew } from 'interfaces/Inventory/Inventory.interface';
import axiosClient from './setup/axiosClient';

const path = '/api/inventories';
export const InventoryApis = {
  getInventoryByShopId: async (data: {
    shopId: string;
    page: number;
    limit: number;
  }): Promise<any> => {
    const { shopId, ...params } = data;
    return await axiosClient.get(`${path}/reiceipts/shop/${shopId}`, {
      params,
    });
  },

  getInventoryDetailById: async (data: {
    inventoryId: string;
    page: number;
    limit: number;
  }): Promise<any> => {
    const { inventoryId, ...params } = data;
    return await axiosClient.get(
      `${path}/inventory-history-detail/receipt/${inventoryId}`,
      { params },
    );
  },

  createInventory: async (data: IInventoryNew): Promise<any> => {
    return await axiosClient.post(`${path}/stock`, data);
  },
};
