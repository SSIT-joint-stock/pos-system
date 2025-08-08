"use client";
import { Blockquote as MantineBlockquote } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type BlockquoteProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  color?: string;
};

export function Blockquote({ children, className, style, color }: BlockquoteProps) {
  return (
    <MantineBlockquote color={color} className={className} style={style}>
      {children}
    </MantineBlockquote>
  );
}

