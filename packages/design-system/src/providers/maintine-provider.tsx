"use client";
import { MantineProvider as MantineProviderCore, MantineProviderProps as MantineProviderPropsCore, createTheme } from "@mantine/core";
import type { ReactNode } from "react";

const posTheme = createTheme({
  primaryColor: "blue",
  primaryShade: 6,
  colors: {
    blue: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
    ],
  },
});

export interface MantineProviderProps extends MantineProviderPropsCore {
  children: ReactNode;
}

export function MantineProvider({
  children,
  ...props
}: MantineProviderProps) {
  return (
    <MantineProviderCore theme={posTheme} {...props}>
      {children}
    </MantineProviderCore>
  );
}

