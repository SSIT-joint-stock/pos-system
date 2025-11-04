'use client';

import React, { useEffect, useState } from 'react';
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
import { Button, Modal, Select, Table } from '@repo/design-system/components/ui';
import { NumberInput, TextInput } from '@mantine/core';
import FilterBar from '../components/filter-bar';
import api from '../../../../../main/src/libs/axios';
import { useAtom } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { toast } from 'react-toastify';
import { formatDate } from '../../../../../main/src/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// -------------------------------
// Type definitions
// -------------------------------
export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  type:
    | 'ADJUSTMENT'
    | 'PURCHASE'
    | 'SALE'
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

// -------------------------------
// Helper constants
// -------------------------------
const tableHeaders = ['ID', 'Sản phẩm', 'Loại', 'Số lượng', 'Ngày tạo', 'Thao tác'];

const typeColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  ADJUSTMENT: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Package size={14} /> },
  PURCHASE: { bg: 'bg-green-100', text: 'text-green-700', icon: <ShoppingCart size={14} /> },
  SALE: { bg: 'bg-red-100', text: 'text-red-700', icon: <DollarSignIcon size={14} /> },
  RETURN_PURCHASE: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <ArrowLeftCircle size={14} /> },
  RETURN_SALE: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <ArrowRightCircle size={14} /> },
  TRANSFER_IMPORT: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Download size={14} /> },
  TRANSFER_EXPORT: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Upload size={14} /> },
};

// -------------------------------
// Main Component
// -------------------------------
export function ManageStockView() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStore] = useAtom(currentStoreAtom);

  const [filters, setFilters] = useState<StockMovementFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sort: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // -------------------------------
  // Fetch stock data
  // -------------------------------
  const handleGetStockMovements = async (customFilters?: Partial<StockMovementFilters>) => {
    if (!currentStore?.id) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      const f = { ...filters, ...customFilters };
      params.append('page', f.page.toString());
      params.append('limit', f.limit.toString());
      params.append('sortBy', f.sortBy);
      params.append('sort', f.sort);
      if (f.startDate) params.append('startDate', f.startDate);
      if (f.endDate) params.append('endDate', f.endDate);
      if (f.type) params.append('type', f.type);
      if (f.min_quantity !== undefined) params.append('min_quantity', f.min_quantity.toString());
      if (f.max_quantity !== undefined) params.append('max_quantity', f.max_quantity.toString());

      const res = await api.get(`/stores/${currentStore.id}/stock-movement?${params.toString()}`);
      setMovements(res.data.data || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Không thể tải dữ liệu kho');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Export to Excel ✅
  // -------------------------------
  const handleExportExcel = () => {
    if (!movements || movements.length === 0) {
      toast.warning('Không có dữ liệu để xuất');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      movements.map((m) => ({
        ID: m.id,
        'Tên sản phẩm': m.product?.name || m.product_id,
        'Loại phiếu': formatMovementType(m.type),
        'Số lượng': m.quantity,
        'Ngày tạo': formatDate(m.createdAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Movements');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'stock_movements.xlsx');
    toast.success('Xuất dữ liệu thành công!');
  };

  // -------------------------------
  // Utilities
  // -------------------------------
  const formatMovementType = (type: string) => {
    const map: Record<string, string> = {
      ADJUSTMENT: 'Điều chỉnh kho',
      PURCHASE: 'Nhập hàng từ nhà cung cấp',
      SALE: 'Bán hàng cho khách hàng',
      RETURN_PURCHASE: 'Trả hàng cho nhà cung cấp',
      RETURN_SALE: 'Nhận hàng trả từ khách hàng',
      TRANSFER_IMPORT: 'Nhập hàng từ kho khác',
      TRANSFER_EXPORT: 'Xuất hàng sang kho khác',
    };
    return map[type] || type;
  };

  useEffect(() => {
    if (currentStore?.id) handleGetStockMovements();
  }, [currentStore?.id, filters]);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="flex flex-col h-full">
      {/* ACTION BAR */}
      <FilterBar
        hasDatePicker={false}
        actions={
          <>
            <button
              onClick={handleExportExcel}
              className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 hover:opacity-80 transition"
            >
              <Download size={16} />
              <span className="text-gray-900 font-medium text-xs">Xuất dữ liệu</span>
            </button>

            <button
              onClick={() => setOpenFilterModal(true)}
              className="bg-white border border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 hover:opacity-80 transition"
            >
              <Filter size={16} />
              <span className="text-gray-900 font-medium text-xs">Lọc sản phẩm</span>
            </button>
          </>
        }
      />

      {/* TABLE */}
      <Table
        tableHeaders={tableHeaders}
        data={movements}
        total={pagination.total}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        isLoading={loading}
        onPageChange={(page) => handleGetStockMovements({ page })}
        renderRow={(m: StockMovement) => (
          <>
            <td className="px-4 py-2 text-xs font-mono text-gray-600">{m.id.slice(0, 8)}...</td>
            <td className="px-4 py-2 text-xs font-medium text-gray-900">
              {m.product?.name || m.product_id.slice(0, 8) + '...'}
            </td>
            <td className="px-0.5 py-2">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${typeColors[m.type]?.bg} ${typeColors[m.type]?.text}`}
              >
                {typeColors[m.type]?.icon}
                {formatMovementType(m.type)}
              </span>
            </td>
            <td className="px-4 py-2 text-xs font-bold">
              <span
                className={`${
                  m.quantity > 0 ? 'text-green-600' : 'text-red-600'
                } text-sm font-medium`}
              >
                {m.quantity > 0 ? '+' : ''}
                {m.quantity.toLocaleString()}
              </span>
            </td>
            <td className="px-4 py-2 text-xs text-gray-500">{formatDate(m.createdAt)}</td>
            <td>
              <button
                onClick={() => {
                  setSelectedMovement(m);
                  setOpenViewModal(true);
                }}
                className="flex justify-center items-center w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                <Eye size={16} />
              </button>
            </td>
          </>
        )}
      />
    </div>
  );
}
