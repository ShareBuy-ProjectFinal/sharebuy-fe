import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import queryString from 'query-string';

export type DateFormatOption =
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'DD/MM/YYYY HH:mm:ss'
  | 'MM/DD/YYYY HH:mm:ss'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'HH:mm DD/MM/YYYY'
  | 'HH:mm';

export function updateQueryStringParameter(search: string, newParams: any) {
  const searchObj = queryString.parse(search);

  return queryString.stringify(
    { ...searchObj, ...newParams },
    { skipEmptyString: true, skipNull: true },
  );
}

export const parseParams = (params: any) => {
  const allParams: any = {};
  for (const [key, value] of new URLSearchParams(params).entries()) {
    allParams[key] = value;
  }
  return allParams;
};

export default function formatNumber(
  number: number,
  format = 'vi-VN',
  unit?: number,
) {
  if (number === undefined || number === null) {
    return '-';
  } else {
    const numberString = new Intl.NumberFormat(format, {
      minimumFractionDigits: 0,
      maximumFractionDigits:
        unit != undefined ? Math.ceil(Math.log(unit) / Math.LN10) : 6,
    }).format(number);
    return `${numberString}`;
  }
}

export const checkFormValidate = async (form: FormInstance<any>) => {
  try {
    await form.validateFields(); // Kiểm tra tất cả các trường
    return true; // Trả về true nếu không có lỗi
  } catch (error) {
    return false; // Trả về false nếu có lỗi
  }
};

export const combine = (arrays: any[]): any[] => {
  if (arrays.length === 0) return [];
  return postCombine(arrays);
};

const postCombine = (arrays: any[]): any[] => {
  if (arrays.length === 0) return [[]];
  const firstArray = arrays[0];
  const restArrays = arrays.slice(1);
  const restCombinations = postCombine(restArrays);
  const combinations = [];

  for (const value of firstArray) {
    for (const combination of restCombinations) {
      combinations.push([value, ...combination]);
    }
  }

  return combinations;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const formatDate = (value: string | Date, option?: DateFormatOption) => {
  return dayjs(value).format(option || 'DD/MM/YYYY HH:mm:ss');
};

export const getStartAndEndOfMonth = (date: Date, month?: number) => {
  // tháng trước đó
  // const start = dayjs(date).subtract(1, 'month').startOf('month').toDate();
  // const end = dayjs(date).subtract(1, 'month').endOf('month').toDate();

  if (month) {
    const start = dayjs(date).month(month).startOf('month').toDate();
    const end = dayjs(date).month(month).endOf('month').toDate();
    return [start, end];
  } else {
    const start = dayjs(date).startOf('month').toDate();
    const end = dayjs(date).endOf('month').toDate();
    return [start, end];
  }
};

export const getStartAndEndOfYear = (date: Date) => {
  const start = dayjs(date).startOf('year').toDate();
  const end = dayjs(date).endOf('year').toDate();
  return [start, end];
};
