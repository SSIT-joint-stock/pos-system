"use client";

import * as React from "react";
import { PasswordInput, TextInput } from "@mantine/core";
import type {
  CSSProperties,
  HTMLInputTypeAttribute,
  ReactNode,
  ForwardedRef,
} from "react";

type SizeInput = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
type StyleInput = "default" | "filled" | "unstyled";

export type InputProps = React.PropsWithChildren & {
  type?: HTMLInputTypeAttribute;
  size?: SizeInput;
  radius?: SizeRadius;
  variant?: StyleInput;
  label?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  error?: string;
  style?: CSSProperties;
  disabled?: boolean;
  isInputPassword?: boolean;
  color?: string;
} & Omit<React.ComponentProps<"input">, "size" | "type" | "onChange" | "value">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      size = "md",
      radius = "md",
      variant = "default",
      label,
      placeholder,
      onChange,
      value,
      leftSection,
      rightSection,
      className,
      style,
      disabled,
      children,
      isInputPassword,
      error,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ""}`} style={style}>
        {label && (
          <span
            className={`${error ? "text-red-500" : "text-gray-900"} text-sm font-medium`}>
            {label}
          </span>
        )}
        {isInputPassword ? (
          <PasswordInput
            ref={ref}
            error={error}
            variant={variant}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            onChange={onChange}
            value={value}
            size={size}
            radius={radius}
            leftSection={leftSection}
            rightSection={rightSection}
            {...(rest as any)}
          />
        ) : (
          <TextInput
            ref={ref}
            error={error}
            variant={variant}
            disabled={disabled}
            placeholder={placeholder}
            type={type}
            onChange={onChange}
            value={value}
            size={size}
            radius={radius}
            leftSection={leftSection}
            rightSection={rightSection}
            {...(rest as any)}
          />
        )}
        {children}
      </div>
    );
  }
);

Input.displayName = "Input";
