"use client";
import * as React from "react";
import { Select as MantineSelect } from "@mantine/core";
type SizeSelect = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
export type SelectProps = React.PropsWithChildren & {
  size?: SizeSelect;
  radius?: SizeRadius;
  label?: string;
  placeholder?: string;
  onChange?: (value: string | null) => void;
  value?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
  error?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  color?: string;
  checkIconPosition?: "left" | "right";
  data: string[];
};
export function Select({
  size = "md",
  radius = "md",
  label,
  placeholder,
  onChange,
  value,
  leftSection,
  rightSection,
  className,
  error,
  style,
  disabled,
  color,
  checkIconPosition = "right",
  data,
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`} style={style}>
      {label && (
        <span
          className={`${error ? "text-red-500" : "text-gray-900"} text-sm font-medium`}>
          {label}
        </span>
      )}
      <MantineSelect
        radius={radius}
        size={size}
        clearable
        placeholder={placeholder}
        checkIconPosition={checkIconPosition}
        data={data}
        leftSection={leftSection}
        rightSection={rightSection}
        error={error}
        style={style}
        disabled={disabled}
        color={color}
        onChange={(value) => onChange?.(value)}
        value={value}
      />
    </div>
  );
}
