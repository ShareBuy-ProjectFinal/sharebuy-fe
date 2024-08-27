import { ToastPosition } from 'react-toastify';

export const optionsToast = {
  position: 'top-right' as ToastPosition,
  autoClose: 2200,
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
