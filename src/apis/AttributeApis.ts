import create from '@ant-design/icons/lib/components/IconFont';
import axiosClient from './setup/axiosClient';

const pathAttribute = '/api/products/custom-attributes';
const pathAttributeValue = '/api/products/custom-attribute-values';
export const AttributeApis = {
  GetAllByShopId: async (shopId: any) => {
    return await axiosClient.get(`${pathAttribute}/shop/${shopId}`);
  },
  getAllByCustomAttributeID: async (params: any) => {
    return await axiosClient.get(
      `${pathAttributeValue}/custom-attribute/${params.attributeId}`,
    );
  },
  createAttribute: async (params: any) => {
    return await axiosClient.post(`${pathAttribute}`, params);
  },
  createAttributeValue: async (params: any) => {
    return await axiosClient.post(`${pathAttributeValue}`, params);
  },
  createAttributeValues: async (params: any) => {
    return await axiosClient.post(`${pathAttributeValue}/many`, params);
  },
};
