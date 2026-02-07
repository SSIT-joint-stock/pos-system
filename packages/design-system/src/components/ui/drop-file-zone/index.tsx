import { Group, Stack } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

export interface CustomDropzoneProps extends Omit<Partial<DropzoneProps>, 'title' | 'description'> {
  title?: ReactNode;
  description?: ReactNode;

  idleIcon?: ReactNode;
  acceptIcon?: ReactNode;
  rejectIcon?: ReactNode;

  maxSizeMb?: number;

  disabled?: boolean;
}

export function DropFileZone({
  title = 'Drag files here or click to select',
  description = 'Each file should not exceed the size limit',

  idleIcon = <IconPhoto size={52} stroke={1.5} />,
  acceptIcon = <IconUpload size={52} stroke={1.5} />,
  rejectIcon = <IconX size={52} stroke={1.5} />,

  maxSizeMb = 5,
  accept = IMAGE_MIME_TYPE,

  disabled = false,

  onDrop,
  onReject,
  ...rest
}: CustomDropzoneProps) {
  return (
    <Dropzone
      onDrop={onDrop ?? (() => {})}
      onReject={onReject ?? (() => {})}
      maxSize={maxSizeMb * 1024 ** 2}
      accept={accept}
      disabled={disabled}
      styles={{
        root: {
          border: '1px dashed var(--mantine-color-gray-3)',
          borderRadius: 12,
          cursor: 'pointer',

          transition: 'background-color 150ms ease, border-color 150ms ease',

          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-5)',
            borderColor: 'var(--mantine-color-gray-5)',
          },
          '&:disable': {
            backgroundColor: 'var(--mantine-color-gray-0)',
            borderColor: 'var(--mantine-color-gray-5)',
            cursor: 'not-allowed',
          },
        },
      }}
      {...rest}
    >
      <Group justify="center" mih={220} style={{ pointerEvents: 'none' }}>
        <div className="space-y-2 flex items-center justify-center flex-col">
          <Dropzone.Accept>
            <div style={{ color: 'var(--mantine-color-blue-5)' }}>{acceptIcon}</div>
          </Dropzone.Accept>

          <Dropzone.Reject>
            <div style={{ color: 'var(--mantine-color-red-6)' }}>{rejectIcon}</div>
          </Dropzone.Reject>

          <Dropzone.Idle>
            <div style={{ color: 'var(--mantine-color-dimmed)' }}>{idleIcon}</div>
          </Dropzone.Idle>

          <Stack align="center" gap={4}>
            <p className="text-pos-blue-500 text-base font-semibold">{title}</p>
            <p className="text-gray-500 text-sm ">{description}</p>
          </Stack>
        </div>
      </Group>
    </Dropzone>
  );
}
