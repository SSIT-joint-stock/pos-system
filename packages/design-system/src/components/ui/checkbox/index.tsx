'use client';
import { Checkbox as MantineCheckbox } from '@mantine/core';
import * as React from 'react';

type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeCheckbox = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CheckboxProps = React.PropsWithChildren & {
  label?: React.ReactNode;
  value?: string;
  color?: string;
  radius?: SizeRadius;
  title?: string;
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
  title,
  checked,
  disabled,
}: CheckboxProps) {
  return (
    <MantineCheckbox
      title={title}
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
