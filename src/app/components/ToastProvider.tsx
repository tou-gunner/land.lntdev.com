"use client";

import { Toaster, ToastPosition } from "react-hot-toast";

// Configure toast position
const toastOptions = {
  position: 'center' as ToastPosition,
  duration: 4000,
  style: {
    background: '#363636',
    color: '#fff',
  },
  success: {
    style: {
      background: '#3b7a4d',
    },
  },
  error: {
    style: {
      background: '#a53030',
    },
  },
};

const ToastProvider = () => {
  return <Toaster toastOptions={toastOptions} />;
};

export default ToastProvider; 