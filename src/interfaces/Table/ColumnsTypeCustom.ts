import { TableColumnsType } from 'antd';
import { DateFormatOption } from 'utils/function';

export type ColumnsTypeCustom<T = any> = (TableColumnsType<T>[number] & {
  isShow?: boolean;
  isShowRender?: boolean;
  type?: 'date' | 'number';
  currency?: 'vi-VN' | 'en-US' | 'ja-JP';
  unit?: number;
  format?: number;
  formatDate?: DateFormatOption;
})[];
