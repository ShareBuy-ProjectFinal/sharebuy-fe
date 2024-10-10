import { ToastPosition } from 'react-toastify';

export const optionsToast = {
  position: 'top-right' as ToastPosition,
  autoClose: 3200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const arraysEqual = (arr1: any, arr2: any) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

export const findAllIndices = (array: any[], elementToFind: any): number[] => {
  return array.reduce((acc, element, index) => {
    if (element === elementToFind) {
      acc.push(index);
    }
    return acc;
  }, []);
};

export const removeElementsByIndices = (
  array: any[],
  indicesToRemove: number[],
) => {
  return array.filter((_, index) => !indicesToRemove.includes(index));
};

export const DEFAULT_PAGE_SIZE = 10;

const getURLFromFileField = (field: string) => {
  // return `https://docs.google.com/spreadsheets/d/${field}/export?format=xlsx`;
  return `https://docs.google.com/spreadsheets/d/${field}/export?format=xlsx`;
};

export const URL_IMPORT_TEMPLATE_FILE = {
  INVENTORY_EXPORT_IMPORT: getURLFromFileField(
    '1mGtS2wcdMth2yeovuP5ukV53XOu4nA64',
  ),
  t: 'https://docs.google.com/spreadsheets/d/1mGtS2wcdMth2yeovuP5ukV53XOu4nA64/edit?usp=sharing&ouid=100137600501649479802&rtpof=true&sd=true',
};
