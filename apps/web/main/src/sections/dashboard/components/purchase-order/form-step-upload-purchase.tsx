import { Divider } from '@mantine/core';
import {
  Button,
  DropFileZone,
  Input,
  Modal,
  Select,
  Stepper,
} from '@repo/design-system/components/ui';
import { Check, CloudUpload, Shield, Upload } from 'lucide-react';
import { useState } from 'react';
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

  return (
    <Modal
      title={<p className="text-lg font-semibold"> Nhập sản phẩm từ excel </p>}
      size="xl"
      opened={opened}
      onClose={onClose}
    >
      <Stepper active={isActive} setActive={setIsActive} steps={steps} size="sm" />
      <Divider my={'lg'} />
      <form className="space-y-6 ">
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
          title="Kéo thả file vào đây hoặc tải lên từ thiết bị"
          description="Tối đa 5MB, theo định dạng .xlsx"
          idleIcon={<CloudUpload size={28} color="#3b82f6" />}
          accept={['application/excel']}
          maxSizeMb={10}
          //   onDrop={(files) => uploadPdf(files)}
        />
        <div className="flex items-center gap-2 justify-end">
          <Button size="sm" radius="sm" variant="outline" onClick={onClose} title={'Hủy'} />
          <Button size="sm" radius="sm" title="Nhập file " />
        </div>
      </form>
    </Modal>
  );
}
