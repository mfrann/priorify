import React, { useState, useCallback } from "react";
import { Toast } from "@/shared/components/Toast";

type ToastType = "success" | "error" | "info";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  showToast: (message: string, type?: ToastType) => void;
  ToastComponent: () => React.ReactElement;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({ visible: true, message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const ToastComponent = useCallback(() => {
    return React.createElement(Toast, {
      message: toast.message,
      visible: toast.visible,
      type: toast.type,
      onHide: hideToast,
    });
  }, [toast.visible, toast.message, toast.type, hideToast]);

  return { showToast, ToastComponent };
}
