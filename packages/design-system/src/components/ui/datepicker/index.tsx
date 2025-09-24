'use client';
import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import { DatePickerInput as MantineDatePicker } from '@mantine/dates';
type TypeDate = 'range' | 'default' | 'multiple';
type SizeInput = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeVariant = 'default' | 'filled' | 'unstyled';
export type DatePickerProps = React.PropsWithChildren & {
  placeholder?: string;
  value?: Date | Date[] | [Date | null, Date | null] | null;
  onChange?: (value: Date | Date[] | [Date | null, Date | null] | null) => void;
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
}: DatePickerProps) {
  return (
    <MantineDatePicker
      placeholder={placeholder}
      value={value}
      onChange={(val) => {
        if (!val) return onChange?.(null);
        if (Array.isArray(val)) {
          onChange?.(val.map((d) => (d ? dayjs(d).format('DD-MM-YYYY') : null)) as any);
        } else {
          onChange?.(dayjs(val).format('DD-MM-YYYY') as any);
        }
      }}
      type={type}
      label={label}
      variant={variant}
      radius={radius}
      size={size}
      description={description}
      className={className}
      clearable={clearable}
      leftSection={leftSection}
      maxDate={dayjs().toDate()}
      valueFormat="DD/MM/YYYY"
      monthLabelFormat={(month) => dayjs(month).format('MMMM')}
      weekdayFormat={(day) => dayjs(day).format('dd')}
      rightSection={rightSection}
    />
  );
}
