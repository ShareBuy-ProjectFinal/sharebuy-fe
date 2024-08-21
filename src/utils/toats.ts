import { toast } from 'react-toastify';
import { optionsToast } from './constants';

export const toastError = (msg: string) => {
  return toast.error(msg, optionsToast);
};

export const toastSucess = (msg: string) => {
  return toast.success(msg, optionsToast);
};
