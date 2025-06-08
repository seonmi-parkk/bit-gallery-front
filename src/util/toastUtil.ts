// utils/toastUtil.ts
import { toast } from 'react-toastify';
import { BsCheckCircle, BsExclamationTriangle, BsInfoCircle } from 'react-icons/bs'; // 

export const showSuccessToast = (message: string) =>
  toast(message, {
    icon: BsCheckCircle,
    className: 'toast-succeess text-lg',
  });

export const showErrorToast = (message: string) =>
  toast(message, {
    icon: BsExclamationTriangle,
    className: 'toast-error text-lg',
  });

export const showInfoToast = (message: string) =>
  toast(message, {
    icon: BsInfoCircle,
    className: 'toast-info text-lg',
  });

  export const showIngToast = (message: string) =>
  toast(message, {
    icon: BsInfoCircle,
    className: 'toast-ing text-lg',
  });
