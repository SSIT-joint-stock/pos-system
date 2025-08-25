"use client";
import * as React from "react";
import { Select as MantineSelect } from "@mantine/core";
import type {
  CSSProperties,
  ReactNode,
  ForwardedRef,
} from "react";

type SizeSelect = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";

export type SelectProps = {
  size?: SizeSelect;
  radius?: SizeRadius;
  label?: string;
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  error?: string | boolean | ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
  color?: string;
  checkIconPosition?: "left" | "right";
  data: { value: string; label: string }[] | string[];
  defaultValue?: string;
  clearable?: boolean;
  name?: string;
} & Omit<
  React.ComponentProps<typeof MantineSelect>,
  | "size"
  | "radius"
  | "data"
  | "error"
  | "placeholder"
  | "disabled"
  | "defaultValue"
>;

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      size = "md",
      radius = "md",
      label,
      placeholder,
      leftSection,
      rightSection,
      className,
      error,
      style,
      disabled,
      color,
      checkIconPosition = "right",
      data,
      defaultValue,
      clearable,
      name,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ""}`} style={style}>
        {label && (
          <span
            className={`${
              error ? "text-red-500" : "text-gray-900"
            } text-sm font-medium`}
          >
            {label}
          </span>
        )}
        <MantineSelect
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          radius={radius}
          size={size}
          clearable={clearable}
          placeholder={placeholder}
          checkIconPosition={checkIconPosition}
          data={data}
          leftSection={leftSection}
          rightSection={rightSection}
          error={error}
          disabled={disabled}
          className={className}
          styles={{ input: { color } }}
          {...rest}
        />
      </div>
    );
  }
);

Select.displayName = "Select";
