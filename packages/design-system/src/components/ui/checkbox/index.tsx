"use client";
import * as React from "react";
import { Checkbox as MantineCheckbox } from "@mantine/core";

type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
type SizeCheckbox = "xs" | "sm" | "md" | "lg" | "xl";
export type CheckboxProps = React.PropsWithChildren & {
  label?: string;
  value?: string;
  color?: string;
  radius: SizeRadius;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size: SizeCheckbox;
};
export function Checkbox({
  label,
  radius = "md",
  onChange,
  value,
  size = "md",
  color = "#3b82f6",
}: CheckboxProps) {
  return (
    <MantineCheckbox
      color={color}
      label={label}
      radius={radius}
      onChange={onChange}
      value={value}
      size={size}
    />
  );
}
