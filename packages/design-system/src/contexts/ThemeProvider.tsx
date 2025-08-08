"use client";
import { MantineProvider, createTheme } from "@mantine/core";
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

export type ThemeProviderProps = {
  children: ReactNode;
  withGlobalStyles?: boolean;
  withNormalizeCSS?: boolean;
};

export function ThemeProvider({
  children,
  withGlobalStyles = true,
  withNormalizeCSS = false,
}: ThemeProviderProps) {
  return (
    <MantineProvider theme={posTheme}>
      {children}
    </MantineProvider>
  );
}

