import { useState, useCallback } from 'react';
import { Bounce, ToastOptions, toast } from 'react-toastify';

export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    transition: Bounce,
}

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface UseToast {
    showInfoToast: (message: string, options?: ToastOptions) => void;
    showSuccessToast: (message: string, options?: ToastOptions) => void;
    showWarningToast: (message: string, options?: ToastOptions) => void;
    showErrorToast: (message: string, options?: ToastOptions) => void;
    showDefaultToast: (message: string, options?: ToastOptions) => void;
    setToastOptions: (options: ToastOptions) => void;
}

export type UseToastProps = {
    options?: ToastOptions;
}

const useToast = ({ options }: UseToastProps = {}): UseToast => {
    const [toastOptions, setToastOptions] = useState<ToastOptions>({
        ...DEFAULT_TOAST_OPTIONS,
        ...options,
    });

    const showToastByType = useCallback(
        (type: ToastType) =>
            (message: string, options?: ToastOptions) => {
                toast(message, {
                    type,
                    ...toastOptions,
                    ...options,
                });
            },
        [toastOptions]
    );
    
    const setToastOptionsCallback = useCallback((options: ToastOptions) => {
        setToastOptions({
            ...DEFAULT_TOAST_OPTIONS,
            ...options,
        });
    }, [setToastOptions]);

    return {
        showInfoToast: showToastByType('info'),
        showSuccessToast: showToastByType('success'),
        showWarningToast: showToastByType('warning'),
        showErrorToast: showToastByType('error'),
        showDefaultToast: showToastByType('default'),
        setToastOptions: setToastOptionsCallback,
    };
};

export default useToast;