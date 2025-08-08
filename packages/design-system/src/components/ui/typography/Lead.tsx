"use client";
import { Text } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type LeadProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Lead({ children, className, style }: LeadProps) {
  return (
    <Text size="lg" className={className} style={style}>
      {children}
    </Text>
  );
}

