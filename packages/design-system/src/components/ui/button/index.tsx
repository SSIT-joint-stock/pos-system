"use client";

import * as React from "react";
import { Button as MantineButton } from "@mantine/core";

type SizeVariant =
  | "default"
  | "filled"
  | "gradient"
  | "light"
  | "outline"
  | "subtle"
  | "transparent"
  | "white";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
type SizeButton = "xs" | "sm" | "md" | "lg" | "xl";
type TypeButton = "submit" | "reset" | "button";
export type ButtonProps = React.PropsWithChildren & {
  title?: string;
  variant?: SizeVariant;
  radius?: SizeRadius;
  size?: SizeButton;
  type?: TypeButton;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
} & Omit<
    React.ComponentProps<typeof MantineButton>,
    "title" | "variant" | "size" | "radius" | "type"
  >;

export function Button({
  title,
  variant = "filled",
  radius = "md",
  size = "md",
  type = "button",
  icon,
  className,
  style,
  children,
  color = "#3b82f6",  
  ...rest
}: ButtonProps) {
  return (
    <MantineButton
      color={color}
      variant={variant}
      radius={radius}
      size={size}
      type={type}
      leftSection={icon}
      className={className}
      style={style}
      {...rest}>
      {title || children}
    </MantineButton>
  );
}
