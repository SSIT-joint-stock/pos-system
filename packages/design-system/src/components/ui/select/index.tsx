'use client';
import { CheckIcon, Group, Select as MantineSelect, Text } from '@mantine/core';
import type { CSSProperties, ForwardedRef, ReactNode } from 'react';
import * as React from 'react';

// Type size
type SizeSelect = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type VariantSelect = 'filled' | 'default' | 'unstyled';
// Extend item có description
export type SelectDataItem = {
  value: string;
  label: string;
  sort?: string;
  sortBy?: string;
  description?: string;
  member?: number;
};
type PositionOptions = 'top' | 'bottom';
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
  defaultLabel?: string;
  searchable?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  position?: PositionOptions;
  variant?: VariantSelect;
  onSearchChange?: (value: string) => void;
  allowDeselect?: boolean;
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
      defaultLabel,
      searchable = false,
      onChange,
      value,
      position = 'top',
      variant = 'default',
      onSearchChange,
      allowDeselect,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${className ?? ''}`} style={style}>
        {label && (
          <span className={`${error ? 'text-red-500' : 'text-gray-500'} text-sm font-medium`}>
            {label}
          </span>
        )}
        <MantineSelect
          withCheckIcon
          ref={ref}
          nothingFoundMessage="Không tìm thấy"
          name={name}
          searchable={searchable}
          onChange={onChange}
          defaultValue={defaultValue}
          label={defaultLabel}
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
          onSearchChange={onSearchChange}
          searchValue={rest.searchValue}
          variant={variant}
          value={value}
          allowDeselect={allowDeselect}
          styles={{ input: { color } }}
          renderOption={({ option, checked }) => (
            <Group justify="space-between" className="w-full">
              <div className="flex flex-col">
                <Text size="sm" fw={500}>
                  {option.label}
                </Text>
                {(option as SelectDataItem).description && (
                  <Text size="xs" c="dimmed">
                    {(option as SelectDataItem).description}
                  </Text>
                )}
              </div>
              <div className="flex items-center gap-2">
                {(option as SelectDataItem).member && (
                  <div className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {(option as SelectDataItem).member} thành viên
                  </div>
                )}
                {checked && checkIconPosition === 'right' && <CheckIcon size={8} />}
              </div>
            </Group>
          )}
          comboboxProps={{
            position: position,
            middlewares: { flip: false, shift: false },
            transitionProps: { transition: 'pop', duration: 200 },
          }}
          {...rest}
        />
      </div>
    );
  }
);

Select.displayName = 'Select';
