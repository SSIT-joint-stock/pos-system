import { zodResolver } from '@hookform/resolvers/zod';
import { Divider } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import {
  Button,
  DropFileZone,
  Loading,
  Modal,
  Select,
  Stepper,
  Table,
} from '@repo/design-system/components/ui';
import { Check, CloudUpload, Image, Shield, Upload, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { usePurchase } from '../../../../hooks/purchase/use-purchase';
import useStore from '../../../../hooks/store/use-store';
import { useSupplier } from '../../../../hooks/suplier/use-supplier';
import {
  ImportExcelPurchase,
  ImportExcelPurchaseSchema,
} from '../../../../schemas/purchase/purchase.schema';
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
  const [searchSupplier, setSearchSupplier] = useState<string>('');
  const [debouncedSearch] = useDebouncedValue(searchSupplier, 500);

  const { currentStore } = useStore();
  const { suppliers, loading: loadingSuppliers, getSuppliers, setFilters, filters } = useSupplier();
  const { validationImportPO, validationPOs, importPurchaseOrders, loading } = usePurchase();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImportExcelPurchase>({
    resolver: zodResolver(ImportExcelPurchaseSchema),
    defaultValues: {
      supplier_id: '',
      order_date: new Date(),
      items: [],
    },
  });

  const handleUpload = (file: File[]) => {
    setFiles(file);
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      status: 'ACTIVE',
      q: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    if (!currentStore?.id) return;
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, filters]);

  return (
    <Modal
      title={<p className="text-lg font-semibold"> Nhập sản phẩm từ excel </p>}
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
              <div className="flex  gap-3 ">
                <Controller
                  name="supplier_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      searchable
                      onSearchChange={setSearchSupplier}
                      label={'Nhà cung cấp'}
                      searchValue={searchSupplier}
                      data={suppliers.map((supplier) => ({
                        label: supplier?.name,
                        value: supplier?.id,
                      }))}
                      filter={({ options }) => options}
                      nothingFoundMessage="Không tìm thấy nhà cung cấp"
                      leftSection={<User size={16} />}
                      placeholder="Tìm kiếm nhà cung cấp"
                      clearable
                      error={errors.supplier_id?.message}
                      size="sm"
                      className="flex-1"
                      radius="sm"
                      position="bottom"
                      rightSection={loadingSuppliers && <Loading color="#3b82f6" size="xs" />}
                    />
                  )}
                />

                <Controller
                  name="order_date"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      {...field}
                      size="sm"
                      minDate={new Date()}
                      valueFormat="DD/MM/YYYY"
                      clearable
                      placeholder="Chọn ngày nhập kho"
                      className="flex-1 "
                      radius="sm"
                      label={<span className="text-sm text-gray-500 ">Ngày nhập kho</span>}
                    />
                  )}
                />
              </div>
              <Table
                hasMarginTop={false}
                hasPadding={false}
                hasPagination={false}
                data={validationPOs?.result}
                tableHeaders={[
                  'Tên SP',
                  'Đơn vị',
                  'Mã (SKU)',
                  'Barcode',
                  'Giá nhập',
                  'Giá bán',
                  'Thuế (%)',
                  'Chiết khấu (%)',
                  'Số lượng',
                  'Thông báo',
                ]}
                renderRow={(item) => (
                  <>
                    <td className="py-3 px-2 text-xs ">{item.item_name}</td>
                    <td className="py-3 px-2 text-xs">{item.base_unit}</td>
                    <td className="py-3 px-2 text-xs font-semibold text-pos-blue-500">
                      {item.sku}
                    </td>
                    <td className="py-3 px-2 text-xs">{item.barcode}</td>
                    <td className="py-3 px-2 text-xs">{formatCurrency(item.unit_cost)}</td>
                    <td className="py-3 px-2 text-xs">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-2 text-xs">{item.tax_rate}</td>
                    <td className="py-3 px-2 text-xs">{item.discount_rate}</td>
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
                  Tổng số sản phẩm: {validationPOs?.itemLength}
                </p>
                <p className="text-sm text-red-500">
                  Số sản phẩm lỗi: {validationPOs?.itemErrorLength}
                </p>
                <p className="text-sm text-green-500">
                  Số sản phẩm hợp lệ: {validationPOs?.itemValidLength}
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
                  const success = await validationImportPO(files[0]);

                  if (success) {
                    setIsActive(1);
                    setFiles(null);
                  }
                } else if (isActive === 1) {
                  // Step 1: Import the validated data - use handleSubmit for validation
                  handleSubmit(async (data) => {
                    // Filter only valid items
                    const validItems = validationPOs.result
                      .filter((item) => item.isStatus === true)
                      .map((item) => ({
                        variant_id: item.variant_id || '',
                        product_id: item.product_id || '',
                        quantity: Number(item.quantity),
                        unit_cost: Number(item.unit_cost),
                        unit: item.base_unit,
                        discount_rate: Number(item.discount_rate) || 0,
                        tax_rate: Number(item.tax_rate) || 0,
                        isStatus: item.isStatus,
                      }));

                    const success = await importPurchaseOrders({
                      supplier_id: data.supplier_id,
                      order_date: data.order_date,
                      items: validItems,
                    });

                    if (success) {
                      onClose();
                      setIsActive(0);
                      reset();
                    }
                  })();
                }
              }}
              size="sm"
              radius="sm"
              title={isActive === 0 ? 'Tiếp tục' : 'Nhập hàng'}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
