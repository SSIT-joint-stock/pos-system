import { Tooltip } from '@mantine/core';
import { Edit, Eye, ShoppingBag, Trash } from 'lucide-react';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdjust?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButtons({ onView, onEdit, onDelete, onAdjust }: ActionButtonsProps) {
  const buttonClass = `p-2 text-gray-500 hover:text-gray-600 cursor-pointer hover:bg-gray-200 rounded transition-colors`;

  return (
    <div className="flex items-center gap-5">
      {onView && (
        <Tooltip label="Xem chi tiết" position="bottom" color="rgba(125, 124, 124, 1)" withArrow>
          <button onClick={onView} className={`${buttonClass}`}>
            <Eye size={18} />
          </button>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip label="Sửa thông tin" position="bottom" color="rgba(125, 124, 124, 1)" withArrow>
          <button onClick={onEdit} className={`${buttonClass}`}>
            <Edit size={18} />
          </button>
        </Tooltip>
      )}
      {onAdjust && (
        <button onClick={onAdjust} className={`${buttonClass} `}>
          <ShoppingBag size={18} />
        </button>
      )}
      {onDelete && (
        <Tooltip label="Xóa dữ liệu" position="bottom" color="rgba(125, 124, 124, 1)" withArrow>
          <button onClick={onDelete} className={`${buttonClass}`}>
            <Trash size={18} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
