'use client';
import * as React from 'react';
import { Autocomplete as MantineAutocomplete } from '@mantine/core';

type SizeInput = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeVariant = 'default' | 'filled' | 'unstyled';
export type AutocompleteProps = React.PropsWithChildren & {
  size?: SizeInput;
  radius?: SizeRadius;
  label?: string;
  placeholder?: string;
  data: string[];
  comboboxProps?: React.ComponentProps<typeof MantineAutocomplete>['comboboxProps'];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  variant?: SizeVariant;
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
};
export function AutoComplete({
  radius = 'md',
  size,
  label,
  placeholder,
  data,
  comboboxProps,
  value,
  onChange,
  className,
  variant = 'default',
  rightSection,
  leftSection,
}: AutocompleteProps) {
  return (
    <MantineAutocomplete
      placeholder={placeholder}
      data={data}
      label={label}
      radius={radius}
      size={size}
      value={value}
      variant={variant}
      onChange={onChange}
      rightSection={rightSection}
      clearable
      leftSection={leftSection}
      className={className}
      comboboxProps={{
        transitionProps: { transition: 'pop', duration: 200 },
      }}
    />
  );
}
