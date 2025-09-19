"use client";
import { Button, Loading, Modal, Pagination, Select, Table } from "@repo/design-system/components/ui";
import FilterBar from "../components/filter-bar";
import { Download, Eye, Edit, Trash2, Plus, Filter, Info, Calendar, X, Tag, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TextInput, Textarea } from "@mantine/core";
import api from "../../../../../main/src/libs/axios";
import { useAtom } from "jotai";
import { currentStoreAtom } from "@repo/design-system/stores/auth";
import { toast } from "react-toastify";
import { formatDate } from "../../../../../main/src/utils";

const tableHeaders = ["ID", "Tên danh mục", "Mô tả", "Ngày tạo", "Ngày cập nhật", "Thao tác"];

// Interface cho Category
export interface Category {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho bộ lọc
interface CategoryFilters {
  page: number;
  limit: number;
  sortBy: "createdAt" | "name" | "updatedAt";
  sort: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Interface cho form tạo/sửa category
interface CategoryFormData {
  name: string;
  description: string;
}

export function ManageCategoriesView() {
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentStore] = useAtom(currentStoreAtom);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Bộ lọc hiện tại
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sort: "desc",
  });

  // Bộ lọc tạm trong modal
  const [tempFilters, setTempFilters] = useState<Partial<CategoryFilters>>({});

  // Form data cho tạo/sửa category
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  // Validation errors
  const [formErrors, setFormErrors] = useState<Partial<CategoryFormData>>({});

  // Lấy danh sách categories
  const handleGetCategories = async (customFilters?: Partial<CategoryFilters>) => {
    if (!currentStore?.id) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      const currentFilters = { ...filters, ...customFilters };

      // Phân trang và sắp xếp
      queryParams.append("page", currentFilters.page.toString());
      queryParams.append("limit", currentFilters.limit.toString());
      queryParams.append("sortBy", currentFilters.sortBy);
      queryParams.append("sort", currentFilters.sort);

      // Bộ lọc tùy chọn
      if (currentFilters.startDate) queryParams.append("startDate", currentFilters.startDate);
      if (currentFilters.endDate) queryParams.append("endDate", currentFilters.endDate);
      if (currentFilters.search) queryParams.append("search", currentFilters.search);

      const res = await api.get(`/stores/${currentStore.id}/categories?${queryParams.toString()}`);

      setCategories(res.data.data || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Lỗi khi tải danh sách danh mục");
    }
  };

  // Lấy chi tiết category
  const handleGetCategoryById = async (id: string) => {
    if (!currentStore?.id) return;

    try {
      const res = await api.get(`/stores/${currentStore.id}/categories/${id}`);
      setSelectedCategory(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải chi tiết danh mục");
    }
  };

  // Validate form
  const validateForm = (data: CategoryFormData): Partial<CategoryFormData> => {
    const errors: Partial<CategoryFormData> = {};

    if (!data.name.trim()) {
      errors.name = "Tên danh mục là bắt buộc";
    } else if (data.name.length > 255) {
      errors.name = "Tên danh mục không được vượt quá 255 ký tự";
    }

    if (data.description && data.description.length > 1000) {
      errors.description = "Mô tả không được vượt quá 1000 ký tự";
    }

    return errors;
  };

  // Tạo category mới
  const handleCreateCategory = async () => {
    if (!currentStore?.id) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/stores/${currentStore.id}/categories`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      toast.success("Tạo danh mục thành công");
      setOpenCreateModal(false);
      setFormData({ name: "", description: "" });
      setFormErrors({});
      handleGetCategories();
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.error?.code === "CONFLICT") {
        toast.error("Tên danh mục đã tồn tại");
      } else {
        toast.error("Lỗi khi tạo danh mục");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Cập nhật category
  const handleUpdateCategory = async () => {
    if (!currentStore?.id || !selectedCategory) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/stores/${currentStore.id}/categories/${selectedCategory.id}`, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      toast.success("Cập nhật danh mục thành công");
      setOpenEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: "", description: "" });
      setFormErrors({});
      handleGetCategories();
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.error?.code === "CONFLICT") {
        toast.error("Tên danh mục đã tồn tại");
      } else {
        toast.error("Lỗi khi cập nhật danh mục");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa category
  const handleDeleteCategory = async () => {
    if (!currentStore?.id || !selectedCategory) return;

    setSubmitting(true);
    try {
      await api.delete(`/stores/${currentStore.id}/categories/${selectedCategory.id}`);
      toast.success("Xóa danh mục thành công");
      setOpenDeleteModal(false);
      setSelectedCategory(null);
      handleGetCategories();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa danh mục");
    } finally {
      setSubmitting(false);
    }
  };

  // Cập nhật bộ lọc tạm
  const onChangeFilterValue = (field: keyof CategoryFilters, value: any) => {
    setTempFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Áp dụng bộ lọc
  const handleApplyFilters = () => {
    const newFilters = { ...filters, ...tempFilters, page: 1 };
    setFilters(newFilters);
    handleGetCategories(newFilters);
    setOpenFilterModal(false);
    setTempFilters({});
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    const defaultFilters: CategoryFilters = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sort: "desc",
    };
    setFilters(defaultFilters);
    setTempFilters({});
    handleGetCategories(defaultFilters);
    setOpenFilterModal(false);
  };

  // Đổi trang
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    handleGetCategories(newFilters);
  };

  // Mở modal sửa
  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setFormErrors({});
    setOpenEditModal(true);
  };

  // Mở modal xóa
  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };

  // Reset form khi mở modal tạo
  const handleOpenCreateModal = () => {
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setOpenCreateModal(true);
  };

  // Lần đầu load
  useEffect(() => {
    if (!currentStore?.id) return;
    handleGetCategories();
  }, [currentStore?.id]);

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
            <p>Lọc danh mục</p>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Tìm kiếm */}
          <TextInput
            label="Tìm kiếm theo tên"
            placeholder="Nhập tên danh mục..."
            value={tempFilters.search || ""}
            onChange={(e) => onChangeFilterValue("search", e.target.value)}
            leftSection={<Search size={16} />}
          />

          {/* Ngày bắt đầu & kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              type="date"
              label="Ngày tạo từ"
              value={tempFilters.startDate || ""}
              onChange={(e) => onChangeFilterValue("startDate", e.target.value)}
            />
            <TextInput
              type="date"
              label="Ngày tạo đến"
              value={tempFilters.endDate || ""}
              onChange={(e) => onChangeFilterValue("endDate", e.target.value)}
            />
          </div>

          {/* Sắp xếp */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Sắp xếp theo"
              value={tempFilters.sortBy || filters.sortBy}
              onChange={(value) => onChangeFilterValue("sortBy", value)}
              data={[
                { value: "createdAt", label: "Ngày tạo" },
                { value: "updatedAt", label: "Ngày cập nhật" },
                { value: "name", label: "Tên danh mục" },
              ]}
            />
            <Select
              label="Thứ tự"
              value={tempFilters.sort || filters.sort}
              onChange={(value) => onChangeFilterValue("sort", value)}
              data={[
                { value: "desc", label: "Giảm dần" },
                { value: "asc", label: "Tăng dần" },
              ]}
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button onClick={handleResetFilters} className="text-gray-500 hover:underline">
              Đặt lại
            </button>
            <button
              onClick={() => {
                setOpenFilterModal(false);
                setTempFilters({});
              }}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleApplyFilters} title="Áp dụng bộ lọc" size="sm" radius="md" />
          </div>
        </div>
      </Modal>

      {/* MODAL TẠO DANH MỤC */}
      <Modal
        opened={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          setFormData({ name: "", description: "" });
          setFormErrors({});
        }}
        size="lg"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-600">
            <div className="bg-green-100 p-2 rounded-lg">
              <Plus size={18} className="text-green-600" />
            </div>
            <span>Tạo danh mục mới</span>
          </div>
        }
      >
        <div className="space-y-4">
          <TextInput
            label="Tên danh mục"
            placeholder="Nhập tên danh mục..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            maxLength={255}
          />

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả danh mục (tùy chọn)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={formErrors.description}
            minRows={3}
            maxLength={1000}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setOpenCreateModal(false);
                setFormData({ name: "", description: "" });
                setFormErrors({});
              }}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleCreateCategory} title="Tạo danh mục" size="sm" radius="md" loading={submitting} />
          </div>
        </div>
      </Modal>

      {/* MODAL SỬA DANH MỤC */}
      <Modal
        opened={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedCategory(null);
          setFormData({ name: "", description: "" });
          setFormErrors({});
        }}
        size="lg"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-600">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Edit size={18} className="text-blue-600" />
            </div>
            <span>Sửa danh mục</span>
          </div>
        }
      >
        <div className="space-y-4">
          <TextInput
            label="Tên danh mục"
            placeholder="Nhập tên danh mục..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            maxLength={255}
          />

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả danh mục (tùy chọn)..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={formErrors.description}
            minRows={3}
            maxLength={1000}
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setOpenEditModal(false);
                setSelectedCategory(null);
                setFormData({ name: "", description: "" });
                setFormErrors({});
              }}
              className="text-red-500 hover:underline"
            >
              Hủy
            </button>
            <Button onClick={handleUpdateCategory} title="Cập nhật" size="sm" radius="md" loading={submitting} />
          </div>
        </div>
      </Modal>

      {/* MODAL XÓA DANH MỤC */}
      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setSelectedCategory(null);
        }}
        size="md"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-red-600">
            <div className="bg-red-100 p-2 rounded-lg">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <span>Xác nhận xóa danh mục</span>
          </div>
        }
      >
        {selectedCategory && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <span className="font-semibold text-red-600">"{selectedCategory.name}"</span>?
              </p>
              <p className="text-sm text-red-500 mt-2">
                Hành động này không thể hoàn tác. Hãy đảm bảo không có sản phẩm nào đang sử dụng danh mục này.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setOpenDeleteModal(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-500 hover:underline"
              >
                Hủy
              </button>
              <Button
                onClick={handleDeleteCategory}
                title="Xóa danh mục"
                size="sm"
                radius="md"
                loading={submitting}
                className="bg-red-600 hover:bg-red-700"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        opened={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedCategory(null);
        }}
        size="xl"
        title={
          <div className="flex items-center gap-3 font-semibold text-lg text-gray-600">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Eye size={18} className="text-blue-600" />
            </div>
            <span>Chi tiết danh mục</span>
          </div>
        }
      >
        {selectedCategory && (
          <div className="max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Tag size={20} className="text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Thông tin danh mục</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">ID Danh mục</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <span className="font-mono text-gray-900 break-all text-sm">{selectedCategory.id}</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">Tên danh mục</label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">Store ID</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <span className="font-mono text-gray-700 break-all text-sm">{selectedCategory.store_id}</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">Mô tả</label>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 min-h-[80px]">
                        <span className="text-gray-900">
                          {selectedCategory.description || <em className="text-gray-500">Không có mô tả</em>}
                        </span>
                      </div>
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
                    <label className="text-sm font-semibold text-gray-600 mb-1">Ngày tạo</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                      <Calendar size={16} className="text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedCategory.createdAt).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-blue-600">
                          {new Date(selectedCategory.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Cập nhật lần cuối</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <Calendar size={16} className="text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedCategory.updatedAt).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-green-600">
                          {new Date(selectedCategory.updatedAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer với nút hành động */}
            <div className="bg-gray-50 border-t-2 border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="text-xs text-gray-500">
                  Danh mục được tạo vào {formatDate(selectedCategory.createdAt)}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setOpenViewModal(false);
                      handleOpenEditModal(selectedCategory);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <Edit size={16} />
                    Sửa danh mục
                  </button>

                  <button
                    onClick={() => {
                      setOpenViewModal(false);
                      setSelectedCategory(null);
                    }}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
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
          actions={
            <>
              <button
                onClick={handleOpenCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-nowrap rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors duration-300"
              >
                <Plus size={16} />
                <span className="font-medium text-xs">Tạo danh mục</span>
              </button>
              <button className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <Download size={16} />
                <span className="text-gray-900 font-medium text-xs">Xuất dữ liệu</span>
              </button>
              <button
                onClick={() => setOpenFilterModal(true)}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <Filter size={16} />
                <span className="text-gray-900 font-medium text-xs">Lọc danh mục</span>
              </button>
            </>
          }
        />

        {/* Bộ lọc đang áp dụng */}
        {(filters.search || filters.startDate || filters.endDate) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Tìm kiếm: "{filters.search}"
                  </span>
                )}
                {filters.startDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Từ ngày: {new Date(filters.startDate).toLocaleDateString("vi-VN")}
                  </span>
                )}
                {filters.endDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Đến ngày: {new Date(filters.endDate).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
              <button onClick={handleResetFilters} className="text-blue-600 hover:underline text-xs">
                Xóa tất cả
              </button>
            </div>
          </div>
        )}

        {/* BẢNG */}
        <Table
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          tableHeaders={tableHeaders}
          data={categories}
          isLoading={loading}
          renderRow={(category: Category, idx: number) => (
            <tr key={idx} className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300">
              <td className="px-4 py-2 text-xs font-mono text-gray-600">{category.id.slice(0, 8)}...</td>
              <td className="px-4 py-2 text-xs font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag size={14} className="text-blue-600" />
                  </div>
                  <span className="max-w-[200px] truncate">{category.name}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-xs text-gray-600">
                <span className="max-w-[300px] truncate block">
                  {category.description || <em className="text-gray-400">Không có mô tả</em>}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(category.createdAt)}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(category.updatedAt)}</td>
              <td>
                <div className="flex items-center gap-2 pl-4">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      handleGetCategoryById(category.id);
                      setOpenViewModal(true);
                    }}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-blue-600 hover:text-white opacity-70 transition-all duration-200"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(category)}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-green-600 hover:text-white opacity-70 transition-all duration-200"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenDeleteModal(category)}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-red-600 hover:text-white opacity-70 transition-all duration-200"
                    title="Xóa danh mục"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </>
  );
}
