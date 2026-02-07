import { useRef, useState } from 'react';
import FilterBar, { DynamicFilter } from './filter-bar';
import { UploadMenu } from './upload-menu';

interface DataActionBarProps {
  onSearch?: (value: string) => void;
  onFilterChange?: (filters: any) => void;
  onExport?: () => void;
  onUpload?: (file: File) => void;
  onDownloadTemplate?: () => void;
  hasBg?: boolean;
  statusOptions?: DynamicFilter[];
  dataComplete?: string[];
  loading?: boolean;
  placeholderSearch?: string;
  isHaveUpload?: boolean;
  isHaveExport?: boolean;
  openUploadOption?: boolean;
  setWidth?: string;
  uploadOption?: boolean;
  setOpenUploadOption?: (value: boolean) => void;
  isUploadOption?: (upload: boolean) => void;
}

export function DataActionBar({
  onSearch,
  onFilterChange,
  onUpload,
  onDownloadTemplate,
  onExport,
  setWidth,
  hasBg,
  statusOptions,
  dataComplete,
  isHaveUpload,
  isHaveExport,
  loading = false,
  placeholderSearch = 'Tìm kiếm...',
  uploadOption = false,
  isUploadOption,
}: DataActionBarProps) {
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const [openUploadOption, setOpenUploadOption] = useState<boolean>(false);

  return (
    <FilterBar
      hasBg={hasBg}
      setWidth={setWidth}
      onSearch={onSearch}
      onFilterChange={onFilterChange}
      dataComplete={dataComplete}
      filters={statusOptions}
      placeholderInputSearch={placeholderSearch}
      actions={
        <>
          <UploadMenu
            uploadOption={uploadOption}
            onOpen={() => setOpenUploadOption?.(true as boolean)}
            isOpen={openUploadOption}
            onClose={() => setOpenUploadOption?.(false as boolean)}
            onFileSelect={onUpload || (() => {})}
            onDownloadTemplate={onDownloadTemplate || (() => {})}
            loading={loading}
            menuRef={uploadMenuRef}
            isHaveUpload={isHaveUpload}
            onExport={onExport}
            isHaveExport={isHaveExport}
            isUploadOption={isUploadOption}
          />
        </>
      }
    />
  );
}
