import { Divider } from '@mantine/core';
import {
  Button,
  DropFileZone,
  Input,
  Modal,
  Select,
  Stepper,
  Table,
} from '@repo/design-system/components/ui';
import { Check, CloudUpload, Image, Shield, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { usePurchase } from '../../../../hooks/purchase/use-purchase';
import { formatCurrency } from '../../../../utils';
const steps = [
  {
    label: 'Chọn file dữ liệu ',
    icon: <Upload size={16} />,
  },
  {
    label: 'Xác thực dữ liệu',
    icon: <Shield size={16} />,
  },
  {
    label: 'Hoàn thành',
    icon: <Check size={16} />,
  },
];
export default function FormStepUploadPurchase({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [isActive, setIsActive] = useState<number>(0);
  const [files, setFiles] = useState<File[] | null>(null);
  const { validationImportPO, validationPOs } = usePurchase();
  const handleUpload = (file: File[]) => {
    setFiles(file);
  };
  console.log(validationPOs);
  console.log(files);

  return (
    <Modal
      title={<p className="text-lg font-semibold"> Nhập sản phẩm từ excel </p>}
      size="60%"
      opened={opened}
      onClose={onClose}
    >
      <Stepper active={isActive} setActive={setIsActive} steps={steps} size="sm" />
      <Divider my={'lg'} />
      {isActive === 0 && (
        <div className="space-y-6 ">
          <div className="flex items-center gap-2 ">
            <Select
              placeholder="Chọn nhà cung cấp"
              position="bottom"
              className="flex-1"
              data={['s']}
              size="sm"
              radius="sm"
              label="Chọn nhà cung cấp"
            />
            <Input
              placeholder="Nhập mã đơn nhập"
              className="flex-1 "
              size="sm"
              radius="sm"
              label="Mã đơn nhập"
            />
          </div>
          <DropFileZone
            disabled={files ? true : false}
            title="Kéo thả file vào đây hoặc tải lên từ thiết bị"
            description="Tối đa 5MB, theo định dạng .xlsx"
            idleIcon={<CloudUpload size={28} color="#3b82f6" />}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }}
            maxSizeMb={10}
            onDrop={handleUpload}
          />
          {files && (
            <div className="p-2 rounded-md bg-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image size={30} />
                <div className="space-y-1">
                  <p className="text-sm ">{files[0].name}</p>
                  <p className="text-xs ">{files[0].size} bytes</p>
                </div>
              </div>
              <button
                onClick={() => setFiles(null)}
                type="button"
                className="text-gray-500 hover:cursor-pointer hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      )}
      {isActive === 1 && (
        <>
          <Table
            hasMarginTop={false}
            hasPadding={false}
            hasPagination={false}
            data={validationPOs}
            tableHeaders={[
              'Tên SP',
              'Danh mục',
              'Đơn vị',
              'Mã (SKU)',
              'Barcode',
              'Giá nhập',
              'Giá bán',
            ]}
            renderRow={(item) => (
              <>
                <td className="py-3 px-2 text-sm">{item.name}</td>
                <td className="py-3 px-2 text-sm">{item.category}</td>
                <td className="py-3 px-2 text-sm">{item.base_unit}</td>
                <td className="py-3 px-2 text-sm">{item.sku}</td>
                <td className="py-3 px-2 text-sm">{item.barcode}</td>
                <td className="py-3 px-2 text-sm">{formatCurrency(item.cost)}</td>
                <td className="py-3 px-2 text-sm">{formatCurrency(item.price)}</td>
              </>
            )}
          />
        </>
      )}
      <Divider my={'lg'} />

      <div className="flex items-center gap-2 justify-end">
        <Button
          size="sm"
          radius="sm"
          variant="outline"
          onClick={() => {
            setFiles(null);
            onClose();
          }}
          title={'Hủy'}
        />
        <Button
          disabled={!files}
          onClick={async () => {
            if (!files) return;
            const success = await validationImportPO(files[0]);
            if (success) setIsActive(1);
          }}
          size="sm"
          radius="sm"
          title="Nhập file "
        />
      </div>
    </Modal>
  );
}
