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
  error?: string;
} & Omit<React.ComponentProps<"input">, "onChange" | "value">;

export function PinInput({
  length,
  value,
  onChange,
  size,
  variant,
  radius,
  error,
  ...rest
}: PinInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <MantinePinInput
        error={!!error}
        length={length}
        value={value}
        radius={radius}
        onChange={onChange}
        variant={variant}
        size={size}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(rest as any)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
