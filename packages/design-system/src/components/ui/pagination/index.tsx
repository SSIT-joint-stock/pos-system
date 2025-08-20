"use client";
import * as React from "react";
import { Pagination as MantinePagination } from "@mantine/core";
type SizePagination = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadiusPagination = "xs" | "sm" | "md" | "lg";
export type PaginationProps = React.PropsWithChildren & {
  total: number;
  boundaries?: number;
  siblings?: number;
  size?: SizePagination;
  radius?: SizeRadiusPagination;
  value?: number;
  onChange?: (value: number) => void;
};
export function Pagination({
  total,
  boundaries = 1,
  siblings = 1,
  size = "md",
  radius = "md",
  value,
  onChange,
}: PaginationProps) {
  return (
    <MantinePagination
      value={value}
      onChange={onChange}
      radius={radius}
      size={size}
      total={total}
      siblings={siblings}
      boundaries={boundaries}
    />
  );
}
