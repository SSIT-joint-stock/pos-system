"use client";
import * as React from "react";
import { Modal as MantineModal } from "@mantine/core";
type SizeModal = "xs" | "sm" | "md" | "lg" | "xl" | "full" | "content" | "46%";
type SizeRadius = "xs" | "sm" | "md" | "lg" | "xl";
type SizePadding = "xs" | "sm" | "md" | "lg" | "xl";
export type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  opened: boolean;
  children: React.ReactNode;
  size?: SizeModal;
  padding?: SizePadding;
  radius?: SizeRadius;
  title?: string;
};
export function Modal({
  onClose,
  opened,
  children,
  size = "md",
  padding = "md",
  radius = "md",
  title,
}: ModalProps) {
  return (
    <MantineModal.Root
      size={size}
      padding={padding}
      radius={radius}
      opened={opened}
      centered
      onClose={onClose}>
      <MantineModal.Overlay />
      <MantineModal.Content>
        <MantineModal.Header >
          <MantineModal.Title>{title}</MantineModal.Title>
          <MantineModal.CloseButton />
        </MantineModal.Header>
        <MantineModal.Body>{children}</MantineModal.Body>
      </MantineModal.Content>
    </MantineModal.Root>
  );
}
