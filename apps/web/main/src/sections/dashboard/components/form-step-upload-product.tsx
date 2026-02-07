import { Divider } from '@mantine/core';
import { Button, DropFileZone, Modal, Stepper, Table } from '@repo/design-system/components/ui';
import { Check, CloudUpload, Image, Shield, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useProduct } from '../../../hooks/product/use-product';
import { formatCurrency } from '../../../utils';

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
export default function FormStepUploadProduct({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const [isActive, setIsActive] = useState<number>(0);
  const [files, setFiles] = useState<File[] | null>(null);

  const { validationImportProduct, importProduct, getProducts, loading, validationProducts } =
    useProduct();

  const handleUpload = (file: File[]) => {
    setFiles(file);
  };

  return (
    <Modal
      title={<p className="text-lg font-semibold"> Nhập file danh sách sản phẩm</p>}
      size={isActive === 0 ? 'xl' : '80%'}
      opened={opened}
      closeOnClickOutside={false}
      onClose={onClose}
    >
      <div className={`flex flex-col ${isActive === 0 ? 'h-[42h]' : 'h-[75vh]'}`}>
        <div className="flex-1 overflow-y-auto pr-2">
          <Stepper active={isActive} setActive={setIsActive} steps={steps} size="sm" />
          <Divider my={'lg'} />
          {isActive === 0 && (
            <>
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
                <div className="p-2 rounded-md bg-gray-100 flex items-center justify-between mt-4">
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
            </>
          )}
          {isActive === 1 && (
            <div className="space-y-6 ">
              <Table
                hasMarginTop={false}
                hasPadding={false}
                hasPagination={false}
                data={validationProducts?.result}
                tableHeaders={[
                  'Sản phẩm gốc',
                  'Mã SP (SKU)',
                  'Đơn vị gốc',
                  'Tên biến thể',
                  'Mã biến thể (SKU)',
                  'Mã vạch (barcode)',
                  'Giá bán',
                  'Giá nhập',
                  'Số lượng tồn',
                  'Thông báo',
                ]}
                renderRow={(item) => (
                  <>
                    <td className="py-3 px-2 text-xs ">{item.product_name}</td>
                    <td className="py-3 px-2 text-xs">{item.product_sku}</td>
                    <td className="py-3 px-2 text-xs font-semibold text-pos-blue-500">
                      {item.base_unit}
                    </td>
                    <td className="py-3 px-2 text-xs">{item.variant_name}</td>
                    <td className="py-3 px-2 text-xs">{item.variant_sku}</td>
                    <td className="py-3 px-2 text-xs">{item.barcode}</td>
                    <td className="py-3 px-2 text-xs">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-2 text-xs">{formatCurrency(item.cost)}</td>
                    <td className="py-3 px-2 text-xs">{item.quantity}</td>
                    <td
                      className={`py-3 px-2 text-xs ${item.isStatus === false ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {item.isStatus === false ? item.msg : 'Sản phẩm hợp lệ'}
                    </td>
                  </>
                )}
              />
              <div className="flex items-center gap-4 justify-end ">
                <p className="text-sm text-gray-800">
                  Tổng số sản phẩm: {validationProducts?.itemLength}
                </p>
                <p className="text-sm text-red-500">
                  Số sản phẩm lỗi: {validationProducts?.itemErrorLength}
                </p>
                <p className="text-sm text-green-500">
                  Số sản phẩm hợp lệ: {validationProducts?.itemValidLength}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 bg-white">
          <Divider my={'lg'} />

          <div className="flex items-center gap-2 justify-end ">
            <Button
              size="sm"
              radius="sm"
              variant="outline"
              onClick={() => {
                if (isActive === 0) {
                  onClose();
                  setFiles(null);
                  setIsActive(0);
                } else if (isActive === 1) {
                  setIsActive(0);
                }
              }}
              title={isActive === 0 ? 'Hủy' : 'Quay lại'}
            />
            <Button
              disabled={isActive === 0 && !files}
              loading={loading}
              onClick={async () => {
                if (isActive === 0) {
                  // Step 0: Validate the file
                  if (!files) return;
                  const success = await validationImportProduct(files[0]);

                  if (success) {
                    setIsActive(1);
                    setFiles(null);
                  }
                } else if (isActive === 1) {
                  const success = await importProduct();
                  if (success) {
                    onClose();
                    setIsActive(0);
                    await getProducts();
                  }
                }
              }}
              size="sm"
              radius="sm"
              title={isActive === 0 ? 'Tiếp tục' : ' Xác thực và tạo sản phẩm'}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
