import { useState, useCallback } from 'react';
import { Bounce, ToastOptions, toast } from 'react-toastify';

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface UseToast {
    showInfoToast: (message: string, options?: ToastOptions) => void;
    showSuccessToast: (message: string, options?: ToastOptions) => void;
    showWarningToast: (message: string, options?: ToastOptions) => void;
    showErrorToast: (message: string, options?: ToastOptions) => void;
    showDefaultToast: (message: string, options?: ToastOptions) => void;
}

const useToast = (): UseToast => {
    const [toastOptions, setToastOptions] = useState<ToastOptions>({
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        transition: Bounce,
    });

    const showToastByType = useCallback(
        (type: ToastType) =>
            (message: string, options?: ToastOptions) => {
                const id = toast(message, {
                    type,
                    ...toastOptions,
                    ...options,
                });
            },
        [toastOptions, toast]
    );

    return {
        showInfoToast: showToastByType('info'),
        showSuccessToast: showToastByType('success'),
        showWarningToast: showToastByType('warning'),
        showErrorToast: showToastByType('error'),
        showDefaultToast: showToastByType('default'),
    };
};

export default useToast;