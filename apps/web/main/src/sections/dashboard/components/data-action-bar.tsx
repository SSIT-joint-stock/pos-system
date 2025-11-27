import { useRef, useState } from 'react';
import { UploadMenu } from './upload-menu';
import FilterBar, { DynamicFilter } from './filter-bar';

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
            onExport={onExport}
          />
        </>
      }
    />
  );
}
