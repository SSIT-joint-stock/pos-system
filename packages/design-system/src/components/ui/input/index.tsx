'use client';
import { Input as MantineInput, PasswordInput } from '@mantine/core';
import type { CSSProperties, ForwardedRef, HTMLInputTypeAttribute, ReactNode } from 'react';
import * as React from 'react';

type SizeInput = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StyleInput = 'default' | 'filled' | 'unstyled';

export type InputProps = React.PropsWithChildren & {
  type?: HTMLInputTypeAttribute;
  size?: SizeInput;
  radius?: SizeRadius;
  variant?: StyleInput;
  label?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  error?: string | boolean | ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
  isInputPassword?: boolean;

  color?: string;
  withAsterisk?: boolean;
  styles?: Record<string, any>;
} & Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'onChange' | 'value'>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      size = 'md',
      radius = 'md',
      variant = 'default',
      label,
      placeholder,
      onChange,
      value,
      leftSection,
      rightSection,
      className,
      style,
      disabled,
      children,
      isInputPassword,
      error,
      withAsterisk,
      styles,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const commonProps = {
      ref,
      error,
      variant,
      disabled,
      placeholder,
      type,
      onChange,
      value,
      size,
      radius,
      leftSection,
      rightSection,
      withAsterisk,
      styles,
      ...rest,
    };

    return (
      <div className={`flex flex-col gap-1 ${className ?? ''}`} style={style}>
        {label && (
          <div
            className={`${
              error ? 'text-red-500' : 'text-gray-500'
            } text-sm font-medium cursor-pointer hover:text-gray-700 transition-colors duration-300 ${withAsterisk && 'flex  gap-1'}`}
          >
            {label}
            {withAsterisk && <span className="text-red-500">*</span>}
          </div>
        )}
        {isInputPassword ? (
          <PasswordInput {...commonProps} />
        ) : (
          <>
            <MantineInput {...commonProps} />
            {error && typeof error === 'string' && (
              <span className="text-xs text-red-400">{error}</span>
            )}
          </>
        )}

        {children}
      </div>
    );
  }
);

Input.displayName = 'Input';
