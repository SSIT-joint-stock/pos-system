'use client';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';

interface UploadMenuProps {
  onClose: () => void;
  onOpen: () => void;
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  isOpen: boolean;
  loading?: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  onExport?: () => void;
}

export function UploadMenu({
  isOpen,
  loading = false,
  menuRef,
  onClose,
  onOpen,
  onFileSelect,
  onDownloadTemplate,
  onExport,
}: UploadMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  useClickOutside(menuRef, () => onClose());

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={onOpen}
          disabled={loading}
          className={`bg-white  border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Upload size={16} />
          <span className="text-gray-800 font-medium text-sm">Tải lên dữ liệu</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 flex flex-col  rounded-md shadow-md shadow-gray-100">
            <button
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
              className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-gray-800 font-medium text-sm">Tải lên dữ liệu (Excel)</span>
              <input
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log(file);
                    onFileSelect(file);
                  }
                }}
                hidden
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </button>
            <button
              disabled={loading}
              onClick={onDownloadTemplate}
              className={`bg-white  text-nowrap  hover:bg-gray-50   py-2 px-4 text-left rounded-b-md cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-gray-800 font-medium text-sm">Tải file mẫu (Excel)</span>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onExport}
        className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
      </button>
    </>
  );
}
