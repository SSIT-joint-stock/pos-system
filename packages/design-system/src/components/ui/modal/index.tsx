'use client';
import { Modal as MantineModal } from '@mantine/core';
import * as React from 'react';
export type SizeModal =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full'
  | 'content'
  | '46%'
  | '60%'
  | '70%'
  | '80%'
  | '90%'
  | '100%';
type SizeRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SizePadding = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ModalProps = React.PropsWithChildren & {
  onClose: () => void;
  opened: boolean;
  children: React.ReactNode;
  size?: SizeModal;
  padding?: SizePadding;
  radius?: SizeRadius;
  title?: string | React.ReactNode;
  closeOnClickOutside?: boolean;
};
export function Modal({
  onClose,
  opened,
  children,
  size = 'md',
  padding = 'md',
  radius = 'md',
  title,
  closeOnClickOutside = true,
}: ModalProps) {
  return (
    <MantineModal.Root
      size={size}
      closeOnClickOutside={closeOnClickOutside}
      padding={padding}
      radius={radius}
      opened={opened}
      centered
      onClose={onClose}
      className="select-none"
    >
      <MantineModal.Overlay />
      <MantineModal.Content>
        <MantineModal.Header>
          <MantineModal.Title>{title}</MantineModal.Title>
          <MantineModal.CloseButton />
        </MantineModal.Header>
        <MantineModal.Body>{children}</MantineModal.Body>
      </MantineModal.Content>
    </MantineModal.Root>
  );
}
