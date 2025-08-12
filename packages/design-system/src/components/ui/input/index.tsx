"use client";

import * as React from "react";
import { PasswordInput, TextInput } from "@mantine/core";
import type { CSSProperties, HTMLInputTypeAttribute, ReactNode } from "react";

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
  style?: CSSProperties;
  disabled?: boolean;
  isInputPassword?: boolean;
  color?: string;
} & Omit<React.ComponentProps<"input">, "size" | "type" | "onChange" | "value">;

export function Input({
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

  ...rest
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`} style={style}>
      {label && <span className="text-sm font-medium">{label}</span>}
      {isInputPassword ? (
        <PasswordInput
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
          // className="flex-1"
          {...(rest as any)}
        />
      ) : (
        <TextInput
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
          // className="flex-1"
          {...(rest as any)}
        />
      )}
      {children}
    </div>
  );
}
