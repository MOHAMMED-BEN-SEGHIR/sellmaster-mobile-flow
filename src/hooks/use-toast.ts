
// This file is needed for importing the toast functionality
import * as React from "react";
import { Toast } from "@/components/ui/toast";
import { type ToastActionElement } from "@/components/ui/toast";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export interface ToastActionProps {
  altText?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToastState = {
  toasts: ToasterToast[];
};

let count = 0;

function generateId() {
  return (count++).toString();
}

// Initial state
const toastState: ToasterToastState = {
  toasts: [],
};

export function toast({
  title,
  description,
  ...props
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}) {
  const id = generateId();

  const newToast: ToasterToast = {
    id,
    title,
    description,
    ...props,
  };

  toastState.toasts = [...toastState.toasts, newToast].slice(
    -TOAST_LIMIT
  );

  return {
    id,
    dismiss: () => {},
    update: (props: any) => {},
  };
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {},
    toasts: [],
  };
}
