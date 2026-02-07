'use client';
import { NumberInput as MantineNumberInput } from '@mantine/core';
import * as React from 'react';

type SizeInput = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeVariant = 'default' | 'filled' | 'unstyled';

export type NumberInputProps = React.PropsWithChildren & {
  length?: number;
  suffix?: string;
  hideControls?: boolean;
  value?: string | number;
  max?: number;
  min?: number;
  label?: string;
  onChange?: (value: string) => void;
  size?: SizeInput;
  radius?: SizeRadius;
  variant?: SizeVariant;
  error?: string;
  rightSection?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'size'>;

export function NumberInput({
  length,
  suffix,
  value,
  label,
  max,
  min = 0,
  variant,
  radius,
  size,
  error,
  hideControls,
  rightSection,
  className,
  onChange,
  ...rest
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <MantineNumberInput
        className={className}
        error={!!error}
        length={length}
        value={value}
        radius={radius}
        rightSection={rightSection}
        onChange={onChange}
        max={max}
        min={min}
        suffix={suffix}
        hideControls={hideControls}
        allowDecimal={false}
        thousandSeparator=","
        clampBehavior="strict"
        variant={variant}
        size={size}
        label={
          label && (
            <span className={`${error ? 'text-red-500' : ' text-gray-500'} text-sm`}>{label}</span>
          )
        }
        {...(rest as any)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
