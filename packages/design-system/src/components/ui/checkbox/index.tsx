'use client';
import * as React from 'react';
import { Checkbox as MantineCheckbox } from '@mantine/core';

type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeCheckbox = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CheckboxProps = React.PropsWithChildren & {
  label?: string;
  value?: string;
  color?: string;
  radius?: SizeRadius;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: SizeCheckbox;
  checked?: boolean;
  disabled?: boolean;
};
export function Checkbox({
  label,
  radius = 'md',
  onChange,
  value,
  size = 'md',
  color = '#3b82f6',
  checked,
  disabled,
}: CheckboxProps) {
  return (
    <MantineCheckbox
      color={color}
      label={label}
      disabled={disabled}
      radius={radius}
      onChange={onChange}
      value={value}
      size={size}
      checked={checked}
    />
  );
}
