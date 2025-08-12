"use client";
import * as React from "react";
import { Modal as MantineModal } from "@mantine/core";
type SizeModal = "xs" | "sm" | "md" | "lg" | "xl" | "full" | "content";
export type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  opened: boolean;
  children: React.ReactNode;
  size?: SizeModal;
};
export function Modal({ onClose, opened, children, size = "md" }: ModalProps) {
  return (
    <MantineModal size={size} centered onClose={onClose} opened={opened}>
      {children}
    </MantineModal>
  );
}
