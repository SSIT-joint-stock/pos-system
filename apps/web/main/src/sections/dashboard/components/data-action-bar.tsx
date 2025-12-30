import { useRef, useState } from 'react';
import FilterBar, { DynamicFilter } from './filter-bar';
import { UploadMenu } from './upload-menu';

interface DataActionBarProps {
  onSearch?: (value: string) => void;
  onFilterChange?: (filters: any) => void;
  onExport?: () => void;
  onUpload?: (file: File) => void;
  onDownloadTemplate?: () => void;
  statusOptions?: DynamicFilter[];
  dataComplete?: string[];
  loading?: boolean;
  placeholderSearch?: string;
  isHaveUpload?: boolean;
  openUploadOption?: boolean;
  setOpenUploadOption?: (value: boolean) => void;
}

export function DataActionBar({
  onSearch,
  onFilterChange,
  onUpload,
  onDownloadTemplate,
  onExport,
  statusOptions,
  dataComplete,
  isHaveUpload,
  loading = false,
  placeholderSearch = 'Tìm kiếm...',
}: DataActionBarProps) {
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);

  return (
    <FilterBar
      onSearch={onSearch}
      onFilterChange={onFilterChange}
      dataComplete={dataComplete}
      filters={statusOptions}
      placeholderInputSearch={placeholderSearch}
      actions={
        <>
          <UploadMenu
            onOpen={() => setOpenUploadOption?.(true as boolean)}
            isOpen={openUploadOption}
            onClose={() => setOpenUploadOption?.(false as boolean)}
            onFileSelect={onUpload || (() => {})}
            onDownloadTemplate={onDownloadTemplate || (() => {})}
            loading={loading}
            menuRef={uploadMenuRef}
            isHaveUpload={isHaveUpload}
            onExport={onExport}
          />
        </>
      }
    />
  );
}
