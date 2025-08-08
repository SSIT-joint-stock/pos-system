"use client";
import { Text as MantineText } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type TextProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  weight?: CSSProperties["fontWeight"];
  c?: string; // color utility class or css color
};

export function Text({ children, className, style, size = "md", weight, c }: TextProps) {
  return (
    <MantineText size={size} fw={weight} className={className} c={c} style={style}>
      {children}
    </MantineText>
  );
}

