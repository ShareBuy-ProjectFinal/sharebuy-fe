export interface IProdcutNew {
  category_id: string;
  shop_id: string;
  product_name: string;
  description: string;
  image: string;
  images: string[];
  attributes?: any[];
  custom_attributes: any[];
  old_price: any;
  price: any;
}

export interface IProductUpdate {
  _id: string;
  category_id: string;
  product_name: string;
  description: string;
  image: string;
  images: string[];
  old_price: any;
  price: any;
}

export interface IProductDetail {
  product_id: string;
  name: string;
  old_price: any;
  price: any;
  quantity: number;
  image: string;
  custom_attribute_values: any[];
}

export interface IProductDetailUpdate {
  _id: string;
  price: any;
  quantity: number;
  image: string;
}
