"use client";

import { toast, ToastPosition } from "react-hot-toast";

// Configure custom toast position
const toastOptions = {
  position: 'center' as ToastPosition,
  style: {
    background: '#363636',
    color: '#fff',
  },
};

export const useToast = () => {
  // Toast utility functions with custom styling
  const showToast = {
    success: (message: string, id?: string) => toast.success(message, { ...toastOptions, id }),
    error: (message: string, id?: string) => toast.error(message, { ...toastOptions, id }),
    loading: (message: string, id?: string) => toast.loading(message, { ...toastOptions, id }),
  };

  return { showToast };
}; 