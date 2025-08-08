"use client";
import { Text } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type MutedProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Muted({ children, className, style }: MutedProps) {
  return (
    <Text c="dimmed" className={className} style={style}>
      {children}
    </Text>
  );
}

