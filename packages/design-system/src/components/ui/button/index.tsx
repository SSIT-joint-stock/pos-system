'use client';

import { Button as MantineButton } from '@mantine/core';
import * as React from 'react';

type SizeVariant =
  | 'default'
  | 'filled'
  | 'gradient'
  | 'light'
  | 'outline'
  | 'subtle'
  | 'transparent'
  | 'white';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizeButton = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TypeButton = 'submit' | 'reset' | 'button';
export type ButtonProps = React.PropsWithChildren & {
  title?: string | React.ReactNode;
  variant?: SizeVariant;
  radius?: SizeRadius;
  size?: SizeButton;
  type?: TypeButton;
  icon?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<
    React.ComponentProps<typeof MantineButton>,
    'title' | 'variant' | 'size' | 'radius' | 'type'
  >;

export function Button({
  title,
  variant = 'filled',
  radius = 'md',
  size = 'md',
  type = 'button',

  icon,
  rightSection,
  className,
  style,
  children,
  color = '#3b82f6',
  disabled,
  loading,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <MantineButton
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      color={color}
      variant={variant}
      radius={radius}
      size={size}
      rightSection={rightSection}
      type={type}
      leftSection={icon}
      className={className}
      style={style}
      {...rest}
    >
      {title || children}
    </MantineButton>
  );
}
