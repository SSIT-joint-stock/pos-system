'use client';
import * as React from 'react';
import { Select as MantineSelect, Group, Text } from '@mantine/core';
import type { CSSProperties, ReactNode, ForwardedRef } from 'react';

// Type size
type SizeSelect = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Extend item có description
export type SelectDataItem = {
  value: string;
  label: string;
  description?: string;
  member?: number;
};

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
  checkIconPosition?: 'left' | 'right';
  data: SelectDataItem[] | string[];
  defaultValue?: string;
  clearable?: boolean;
  name?: string;
  searchable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
} & Omit<
  React.ComponentProps<typeof MantineSelect>,
  'size' | 'radius' | 'data' | 'error' | 'placeholder' | 'disabled' | 'defaultValue'
>;

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      size = 'md',
      radius = 'md',
      label,
      placeholder,
      leftSection,
      rightSection,
      className,
      error,
      style,
      disabled,
      color,
      checkIconPosition = 'right',
      data,
      defaultValue,
      clearable,
      name,
      searchable = false,
      onChange,
      value,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ''}`} style={style}>
        {label && (
          <span className={`${error ? 'text-red-500' : 'text-gray-900'} text-sm font-medium`}>
            {label}
          </span>
        )}
        <MantineSelect
          ref={ref}
          name={name}
          searchable={searchable}
          onChange={onChange}
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
          value={value}
          styles={{ input: { color } }}
          comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
          renderOption={({ option }: { option: SelectDataItem }) => (
            <Group justify="space-between" className="w-full">
              <div className="flex flex-col">
                <Text size="sm" fw={500}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text size="xs" c="dimmed">
                    {option.description}
                  </Text>
                )}
              </div>
              {option.member && (
                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {option.member} thành viên
                </div>
              )}
            </Group>
          )}
          {...rest}
        />
      </div>
    );
  }
);

Select.displayName = 'Select';
