"use client";
import * as React from "react";
import { PinInput as MantinePinInput } from "@mantine/core";

type SizePinInput = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
type SizeVariant = "default" | "filled" | "unstyled";
export type PinInputProps = React.PropsWithChildren & {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  size?: SizePinInput;
  radius?: SizeRadius;
  variant?: SizeVariant;
};
export function PinInput({
  length,
  value,
  onChange,
  size,
  variant,
  radius,
}: PinInputProps) {
  return (
    <MantinePinInput
      length={length}
      value={value}
      radius={radius}
      onChange={onChange}
      variant={variant}
      size={size}
    />
  );
}
