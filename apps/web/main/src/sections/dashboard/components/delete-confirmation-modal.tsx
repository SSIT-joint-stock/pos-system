import { Modal } from '@repo/design-system/components/ui';
import { CircleAlert, Trash } from 'lucide-react';

interface DeleteConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
  itemName?: string;
}

export function DeleteConfirmationModal({
  opened,
  onClose,
  onConfirm,
  loading = false,
  title = 'Xác nhận xóa',
  itemName,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2 font-medium text-red-600">
          <Trash size={20} />
          <p>{title}</p>
        </div>
      }
    >
      <div className="space-y-2.5 flex flex-col items-center">
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
            <CircleAlert size={38} />
          </div>
          <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
          <div className="text-sm text-gray-500 text-center">
            Hành động này không thể hoàn tác.{' '}
            <span className="text-pos-blue-500 font-semibold text-base">{itemName}</span> sẽ bị xóa
            vĩnh viễn.
          </div>
        </div>
        <button
          className="bg-red-500 rounded-lg text-white w-full py-2 text-sm cursor-pointer font-bold disabled:opacity-50"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
        </button>
        <button
          className="cursor-pointer text-sm hover:bg-gray-100 transition-colors duration-200 py-2 w-full rounded-md"
          onClick={onClose}
          disabled={loading}
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
}
