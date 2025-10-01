'use client';
import { Button, Modal, Select, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import {
  Download,
  Eye,
  Package,
  RotateCcw,
  Filter,
  Info,
  Calendar,
  X,
  ShoppingCart,
  DollarSignIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  Upload,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NumberInput, TextInput } from '@mantine/core';
import api from '../../../../../main/src/libs/axios';
import { useAtom } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { toast } from 'react-toastify';
import { formatDate } from '../../../../../main/src/utils';

const tableHeaders = ['ID', 'Sản phẩm', 'Loại', 'Số lượng', 'Ngày tạo', 'Thao tác'];

// Màu sắc cho các loại phiếu kho
const typeColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  ADJUSTMENT: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Package size={14} /> },
  PURCHASE: { bg: 'bg-green-100', text: 'text-green-700', icon: <ShoppingCart size={14} /> },
  SALE: { bg: 'bg-red-100', text: 'text-red-700', icon: <DollarSignIcon size={14} /> },
  RETURN_PURCHASE: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <ArrowLeftCircle size={14} />,
  },
  RETURN_SALE: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    icon: <ArrowRightCircle size={14} />,
  },
  TRANSFER_IMPORT: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Download size={14} /> },
  TRANSFER_EXPORT: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Upload size={14} /> },
};

// Interface cho phiếu kho
export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  type:
    | 'ADJUSTMENT'
    | 'PURCHASE'
    | 'RETURN_PURCHASE'
    | 'RETURN_SALE'
    | 'TRANSFER_IMPORT'
    | 'TRANSFER_EXPORT';
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    sku: string;
  };
}

// Interface cho bộ lọc
interface StockMovementFilters {
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'quantity';
  sort: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  type?: string;
  min_quantity?: number;
  max_quantity?: number;
}

export function ManageStockView() {
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStore] = useAtom(currentStoreAtom);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Bộ lọc hiện tại
  const [filters, setFilters] = useState<StockMovementFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sort: 'desc',
  });

  // Bộ lọc tạm trong modal
  const [tempFilters, setTempFilters] = useState<Partial<StockMovementFilters>>({});

  // Lấy danh sách phiếu kho
  const handleGetStockMovements = async (customFilters?: Partial<StockMovementFilters>) => {
    if (!currentStore?.id) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      const currentFilters = { ...filters, ...customFilters };

      // Phân trang và sắp xếp
      queryParams.append('page', currentFilters.page.toString());
      queryParams.append('limit', currentFilters.limit.toString());
      queryParams.append('sortBy', currentFilters.sortBy);
      queryParams.append('sort', currentFilters.sort);

      // Bộ lọc tùy chọn
      if (currentFilters.startDate) queryParams.append('startDate', currentFilters.startDate);
      if (currentFilters.endDate) queryParams.append('endDate', currentFilters.endDate);
      if (currentFilters.type) queryParams.append('type', currentFilters.type);
      if (currentFilters.min_quantity !== undefined)
        queryParams.append('min_quantity', currentFilters.min_quantity.toString());
      if (currentFilters.max_quantity !== undefined)
        queryParams.append('max_quantity', currentFilters.max_quantity.toString());

      const res = await api.get(
        `/stores/${currentStore.id}/stock-movement?${queryParams.toString()}`
      );

      setMovements(res.data.data);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('Lỗi khi tải dữ liệu phiếu kho');
    }
  };

  // Lấy chi tiết phiếu kho
  const handleGetMovementById = async (id: string) => {
    if (!currentStore?.id) return;

    try {
      const res = await api.get(`/stores/${currentStore.id}/stock-movements/${id}`);
      setSelectedMovement(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải chi tiết phiếu kho');
    }
  };

  // Cập nhật bộ lọc tạm
  const onChangeFilterValue = (field: keyof StockMovementFilters, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Áp dụng bộ lọc
  const handleApplyFilters = () => {
    const newFilters = { ...filters, ...tempFilters, page: 1 };
    setFilters(newFilters);
    handleGetStockMovements(newFilters);
    setOpenFilterModal(false);
    setTempFilters({});
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    const defaultFilters: StockMovementFilters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sort: 'desc',
    };
    setFilters(defaultFilters);
    setTempFilters({});

    setOpenFilterModal(false);
  };

  // Đổi trang
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    handleGetStockMovements(newFilters);
  };

  // Định dạng ngày

  // Định dạng loại phiếu
  const formatMovementType = (type: string) => {
    const translations: Record<string, string> = {
      ADJUSTMENT: 'Điều chỉnh kho',
      PURCHASE: 'Nhập hàng từ nhà cung cấp',
      SALE: 'Bán hàng cho khách hàng',
      RETURN_PURCHASE: 'Trả hàng cho nhà cung cấp',
      RETURN_SALE: 'Nhận hàng trả từ khách hàng',
      TRANSFER_IMPORT: 'Nhập hàng từ kho khác',
      TRANSFER_EXPORT: 'Xuất hàng sang kho khác',
    };
    return translations[type] || type;
  };

  // Lần đầu load
  useEffect(() => {
    if (!currentStore?.id) return;
    if (tempFilters) {
      handleGetStockMovements(filters);
    } else {
      handleGetStockMovements();
    }
  }, [currentStore?.id, filters]);

  return (
    <>
      {/* MODAL LỌC */}
      <Modal
        opened={openFilterModal}
        size="lg"
        onClose={() => {
          setOpenFilterModal(false);
          setTempFilters({});
        }}
        title={
          <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
            <Filter size={20} />
            <p>Lọc sản phẩm</p>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Loại phiếu */}
          <Select
            label="Loại phiếu"
            size="sm"
            position="bottom"
            placeholder="Tất cả loại"
            value={tempFilters.type}
            onChange={(value) => onChangeFilterValue('type', value)}
            data={[
              { value: '', label: 'Tất cả loại' },
              { value: 'ADJUSTMENT', label: 'Điều chỉnh kho' },
              { value: 'PURCHASE', label: 'Nhập hàng từ nhà cung cấp' },
              { value: 'SALE', label: 'Bán hàng cho khách hàng' },
              { value: 'RETURN_SALE', label: 'Nhận hàng trả từ khách hàng' },
              { value: 'TRANSFER_IMPORT', label: 'Nhập hàng từ kho khác' },
              { value: 'TRANSFER_EXPORT', label: 'Xuất hàng sang kho khác' },
            ]}
          />

          {/* Ngày bắt đầu & kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              type="date"
              label="Ngày bắt đầu"
              value={tempFilters.startDate}
              onChange={(e) => onChangeFilterValue('startDate', e.target.value)}
            />
            <TextInput
              type="date"
              label="Ngày kết thúc"
              value={tempFilters.endDate}
              onChange={(e) => onChangeFilterValue('endDate', e.target.value)}
            />
          </div>

          {/* Khoảng số lượng */}
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="Số lượng tối thiểu"
              placeholder="0"
              min={0}
              value={tempFilters.min_quantity}
              onChange={(value) => onChangeFilterValue('min_quantity', value)}
            />
            <NumberInput
              label="Số lượng tối đa"
              placeholder="Không giới hạn"
              min={0}
              value={tempFilters.max_quantity}
              onChange={(value) => onChangeFilterValue('max_quantity', value)}
            />
          </div>

          {/* Sắp xếp */}

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 pt-4 border-t mt-6 border-gray-200">
            <button
              onClick={handleResetFilters}
              className="text-gray-500 hover:underline cursor-pointer"
            >
              Đặt lại
            </button>
            <button
              onClick={() => {
                setOpenFilterModal(false);
                setTempFilters({});
              }}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Hủy
            </button>
            <Button onClick={handleApplyFilters} title="Áp dụng bộ lọc" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      {/* MODAL XEM CHI TIẾT -  */}
      <Modal
        opened={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedMovement(null);
        }}
        size="xl"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-600">
            <div className="">
              <Eye size={18} className="text-gray-500" />
            </div>
            <span>Chi tiết phiếu xuất nhập kho</span>
          </div>
        }
      >
        {selectedMovement && (
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Thông tin sản phẩm */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Package size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Thông tin sản phẩm</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">ID Sản phẩm</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                      <span className="font-mono  text-gray-900 break-all">
                        {selectedMovement.product_id}
                      </span>
                    </div>
                  </div>
                  <>
                    {selectedMovement.product?.name && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-600 mb-1">
                          Tên sản phẩm
                        </label>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                          <span className="text-gray-900 font-medium ">
                            {selectedMovement.product.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">
                      Thay đổi số lượng
                    </label>
                    <div
                      className={`border-2 rounded-lg p-4 text-center ${
                        selectedMovement.quantity > 0
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <span
                        className={`text-2xl font-bold ${
                          selectedMovement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {selectedMovement.quantity > 0 ? '+' : ''}
                        {selectedMovement.quantity.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">đơn vị</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin thời gian */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Thông tin thời gian</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">
                      Ngày tạo phiếu
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                      <Calendar size={16} className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedMovement.createdAt).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-blue-600">
                          {new Date(selectedMovement.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">
                      Cập nhật lần cuối
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <RotateCcw size={16} className="text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedMovement.updatedAt).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-green-600">
                          {new Date(selectedMovement.updatedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bổ sung (nếu cần) */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-200 p-2 rounded-lg">
                    <Info size={20} className="text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Thông tin bổ sung</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Trạng thái
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${typeColors[selectedMovement.type]?.bg} ${typeColors[selectedMovement.type]?.text}`}
                    >
                      {typeColors[selectedMovement.type]?.icon}
                      {formatMovementType(selectedMovement.type)}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      ID Giao dịch
                    </p>
                    <p className="font-mono text-sm text-gray-700 break-all">
                      {selectedMovement.id}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Giá trị thay đổi
                    </p>
                    <p
                      className={`text-lg font-bold ${selectedMovement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {selectedMovement.quantity > 0 ? '+' : ''}
                      {Math.abs(selectedMovement.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer với nút hành động */}
            <div className="bg-gray-50 border-t-2 border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="text-xs text-gray-500">
                  Phiếu được tạo vào {formatDate(selectedMovement.createdAt)}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <Download size={16} />
                    In phiếu
                  </button>

                  <button
                    onClick={() => {
                      setOpenViewModal(false);
                      setSelectedMovement(null);
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2  shadow-md hover:shadow-lg"
                  >
                    <X size={14} />
                    <p className="text-sm font-semibold">Đóng</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <div className="flex flex-col h-full">
        {/* THANH HÀNH ĐỘNG */}
        <FilterBar
          hasDatePicker={false}
          actions={
            <>
              <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs">Xuất dữ liệu</span>
              </button>
              <button
                onClick={() => setOpenFilterModal(true)}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <Filter size={16} />
                <span className="text-gray-900 font-medium text-xs">Lọc sản phẩm</span>
              </button>
            </>
          }
        />

        {/* Bộ lọc đang áp dụng */}
        {(filters.type ||
          filters.startDate ||
          filters.endDate ||
          filters.min_quantity ||
          filters.max_quantity) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Loại: {formatMovementType(filters.type)}
                  </span>
                )}
                {filters.startDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Từ ngày: {new Date(filters.startDate).toLocaleDateString('vi-VN')}
                  </span>
                )}
                {filters.endDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Đến ngày: {new Date(filters.endDate).toLocaleDateString('vi-VN')}
                  </span>
                )}
                {filters.min_quantity && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    SL tối thiểu: {filters.min_quantity}
                  </span>
                )}
                {filters.max_quantity && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    SL tối đa: {filters.max_quantity}
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:underline text-xs"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        )}

        {/* BẢNG */}
        <Table
          totalPages={pagination.totalPages}
          // currentPage={pagination.page}
          total={pagination?.total}
          page={pagination?.page}
          limit={pagination?.limit}
          onPageChange={handlePageChange}
          tableHeaders={tableHeaders}
          data={movements}
          isLoading={loading}
          renderRow={(movement: StockMovement, idx: number) => (
            <>
              <td className="px-4 py-2 text-xs font-mono text-gray-600">
                {movement.id.slice(0, 8)}...
              </td>
              <td className="px-4 py-2 text-xs font-medium text-gray-900">
                {movement.product?.name || movement.product_id.slice(0, 8) + '...'}
              </td>
              <td className="px-0.5 py-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${typeColors[movement.type]?.bg} ${typeColors[movement.type]?.text}`}
                >
                  {typeColors[movement.type]?.icon}
                  {formatMovementType(movement.type)}
                </span>
              </td>
              <td className="px-4 py-2 text-xs font-bold">
                <span
                  className={`${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}
                >
                  {movement.quantity > 0 ? '+' : ''}
                  {movement.quantity.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(movement.createdAt)}</td>
              <td>
                <div className="flex items-center gap-5 pl-4">
                  <button
                    onClick={() => {
                      setSelectedMovement(movement);
                      handleGetMovementById(movement.id);
                      setOpenViewModal(true);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
}
