'use client';
import { useClickOutside } from '@repo/design-system/hooks/client';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';

interface UploadMenuProps {
  onClose: () => void;
  onOpen: () => void;
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  onExport?: () => void;
  isUploadOption?: (upload: boolean) => void;
  isOpen: boolean;
  loading?: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  isHaveUpload?: boolean;
  isHaveExport?: boolean;
  uploadOption?: boolean;
}

export function UploadMenu({
  isOpen,
  loading = false,
  menuRef,
  isHaveUpload = true,
  isHaveExport = true,
  uploadOption = false,
  onClose,
  onOpen,
  onFileSelect,
  onDownloadTemplate,
  onExport,
  isUploadOption,
}: UploadMenuProps) {
  useClickOutside(menuRef, () => onClose());
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      {isHaveUpload && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={onOpen}
            disabled={loading}
            className={`bg-white  border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Upload size={16} />
            <span className="text-gray-800 font-medium text-sm">Tải lên dữ liệu</span>
          </button>

          <div
            className={`absolute top-full left-0 mt-1 z-50 flex flex-col  rounded-md shadow-md shadow-gray-100 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-150 ease-in-out origin-top-left`}
          >
            {uploadOption ? (
              <button
                onClick={() => isUploadOption?.(true)}
                disabled={loading}
                className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-gray-800 font-medium text-sm">Tải lên dữ liệu (Excel)</span>
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={() => {
                  ref.current?.click();
                }}
                className={`bg-white  text-nowrap  py-2 px-4 text-left hover:bg-gray-50 rounded-t-md  cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-gray-800 font-medium text-sm">Tải lên dữ liệu (Excel)</span>
                <input
                  ref={ref}
                  hidden
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFileSelect(file);
                      onClose();
                    }
                  }}
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
              </button>
            )}
            <button
              disabled={loading}
              onClick={() => {
                onDownloadTemplate?.();
              }}
              className={`bg-white  text-nowrap  hover:bg-gray-50   py-2 px-4 text-left rounded-b-md cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-gray-800 font-medium text-sm">Tải file mẫu (Excel)</span>
            </button>
          </div>
        </div>
      )}

      {isHaveExport && (
        <button
          onClick={() => {
            onExport?.();
          }}
          className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          <span className="text-gray-900 font-medium text-sm"> Xuất dữ liệu</span>
        </button>
      )}
    </>
  );
}
