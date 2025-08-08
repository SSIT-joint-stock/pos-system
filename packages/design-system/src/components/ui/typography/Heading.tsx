"use client";
import { Title } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Heading({ level = 2, children, className, style }: HeadingProps) {
  return (
    <Title order={level} className={className} style={style}>
      {children}
    </Title>
  );
}

