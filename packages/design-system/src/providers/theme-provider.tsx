"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps as NextThemesProviderProps } from "next-themes";
// import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
export interface ThemeProviderProps extends NextThemesProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ToastContainer />
    </NextThemesProvider>
  );
}
