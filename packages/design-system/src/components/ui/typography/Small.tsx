"use client";
import { Text } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type SmallProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Small({ children, className, style }: SmallProps) {
  return (
    <Text size="sm" className={className} style={style}>
      {children}
    </Text>
  );
}

