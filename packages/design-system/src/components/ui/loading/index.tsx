import { Loader } from "@mantine/core";
import * as React from "react";
type SizeLoading = "xs" | "sm" | "md" | "lg" | "xl";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
export type LoadingProps = React.PropsWithChildren & {
  size?: SizeLoading;
  radius?: SizeRadius;
  color?: string;
};
export function Loading({
  size = "sm",
  radius = "md",
  color = "#fff",
}: LoadingProps) {
  return <Loader size={size} radius={radius} color={color} />;
}
