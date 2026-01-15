'use client';
import { DatePickerInput as MantineDatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import * as React from 'react';
dayjs.locale('vi');

type TypeDate = 'range' | 'default' | 'multiple';
type SizeInput = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeVariant = 'default' | 'filled' | 'unstyled';
export type DatePickerProps = React.PropsWithChildren & {
  placeholder?: string;
  value?: string | string[] | [string | null, string | null] | null;
  onChange?: (value: string | string[] | [string | null, string | null] | null) => void;
  type?: TypeDate;
  label?: string;
  radius?: SizeRadius;
  size?: SizeInput;
  className?: string;
  description?: string;
  leftSection?: React.ReactNode;
  variant?: SizeVariant;
  clearable?: boolean;
  rightSection?: React.ReactNode;
  style?: React.CSSProperties;
  defaultDate?: Date;
  defaultValue?: Date;
};

export function DatePickerInput({
  className,
  description,
  label,
  onChange,
  size = 'md',
  radius = 'md',
  type,
  value,
  placeholder,
  leftSection,
  variant = 'default',
  clearable,
  rightSection,
  style,
  defaultValue,
  defaultDate,
}: DatePickerProps) {
  return (
    // <div className={`flex flex-col gap-1 ${className}`}>
    //   {label && (
    //     <span
    //       className={` text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-300`}
    //     >
    //       {label}
    //     </span>
    //   )}
    <MantineDatePicker
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      label={label}
      type={type}
      variant={variant}
      radius={radius}
      size={size}
      description={description}
      className={className}
      defaultDate={defaultDate}
      defaultValue={defaultValue}
      clearable={clearable}
      style={style}
      leftSection={leftSection}
      maxDate={dayjs().toDate()}
      valueFormat="DD/MM/YYYY"
      monthLabelFormat={(month) => dayjs(month).format('MMMM')}
      weekdayFormat={(day) => dayjs(day).format('dd')}
      rightSection={rightSection}
    />
    // </div>
  );
}
