import { Modal, SizeModal } from '@repo/design-system/components/ui';

interface ModalFormWrapperProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  children: React.ReactNode;
  size?: SizeModal;
}

export function ModalFormWrapper({
  opened,
  onClose,
  title,
  icon,
  children,
  size = 'xl',
}: ModalFormWrapperProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={size}
      title={
        <div className="flex items-center gap-2 font-medium text-gray-600">
          {icon}
          <p>{title}</p>
        </div>
      }
    >
      {children}
    </Modal>
  );
}
