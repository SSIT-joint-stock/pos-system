'use client';
import { Button, Input, Modal, Table } from '@repo/design-system/components/ui';
import FilterBar from '../components/filter-bar';
import { Download, Eye, Edit, Trash, Plus, Tag, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Textarea } from '@mantine/core';
import { formatDate } from '../../../../../main/src/utils';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import FormCreateCategory from '../components/form-create-category';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const tableHeaders = ['ID', 'Tên danh mục', 'Mô tả', 'Ngày tạo', 'Ngày cập nhật', 'Thao tác'];

export function ManageCategoriesView() {
  // Modals
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const currentStore = useAtomValue(currentStoreAtom);

  const {
    categories,
    category,
    pagination,
    paginationParams,
    filters,
    loading,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    createCategoryForm,
    updateCategoryForm,
    setFilters,
    setPaginationParams,
  } = useCategories();

  // Fetch data
  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
  }, [currentStore?.id, paginationParams, filters]);

  useEffect(() => {
    if (category && openEditModal) {
      updateCategoryForm.reset({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category, openEditModal, updateCategoryForm]);

  // ✅ Excel export
  const handleExportExcel = () => {
    if (!categories || categories.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      categories.map((cat) => ({
        'ID Danh mục': cat.id,
        'Tên danh mục': cat.name,
        'Mô tả': cat.description || '',
        'Ngày tạo': formatDate(cat.createdAt),
        'Ngày cập nhật': formatDate(cat.updatedAt),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh mục');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'categories.xlsx');
  };

  // CRUD handlers
  const handleOpenCreateModal = () => {
    createCategoryForm.reset({ name: '', description: '' });
    setOpenCreateModal(true);
  };

  const handleOpenEditModal = async (cat: any) => {
    await getCategoryById(cat.id);
    setOpenEditModal(true);
  };

  const handleOpenDeleteModal = async (cat: any) => {
    await getCategoryById(cat.id);
    setOpenDeleteModal(true);
  };

  const handleSubmitCreate = async (data: any) => {
    const result = await createCategory(data);
    if (result) {
      setOpenCreateModal(false);
      createCategoryForm.reset();
    }
  };

  const handleSubmitUpdate = async (data: any) => {
    if (!category?.id) return;
    await updateCategory(category.id, data);
    setOpenEditModal(false);
  };

  const handleSubmitDelete = async () => {
    if (!category?.id) return;
    await deleteCategory(category.id);
    setOpenDeleteModal(false);
  };

  return (
    <>
      {/* CREATE MODAL */}
      <Modal
        opened={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
          createCategoryForm.reset();
        }}
        size="lg"
        title={
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <Plus size={20} />
            <p>Tạo danh mục mới</p>
          </div>
        }
      >
        <FormCreateCategory
          createCategoryForm={createCategoryForm}
          handleSubmitCreate={handleSubmitCreate}
          setOpenCreateModal={setOpenCreateModal}
          loading={loading}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        opened={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          updateCategoryForm.reset();
        }}
        size="lg"
        title={
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <Edit size={20} />
            <p>Sửa danh mục</p>
          </div>
        }
      >
        <form onSubmit={updateCategoryForm.handleSubmit(handleSubmitUpdate)} className="space-y-4">
          <Input
            size="sm"
            label="Tên danh mục"
            placeholder="Nhập tên danh mục..."
            {...updateCategoryForm.register('name')}
            error={updateCategoryForm.formState.errors.name?.message}
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả danh mục (tùy chọn)..."
              {...updateCategoryForm.register('description')}
              minRows={3}
              error={updateCategoryForm.formState.errors.description?.message}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => {
                setOpenEditModal(false);
                updateCategoryForm.reset();
              }}
              style={{ color: 'red', background: 'transparent', border: 'none' }}
              size="sm"
              title="Hủy"
            />
            <Button type="submit" title="Cập nhật" size="sm" disabled={loading} />
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        size="md"
        title={
          <div className="flex items-center gap-2 font-medium text-red-600">
            <Trash size={20} />
            <p>Xác nhận xóa danh mục</p>
          </div>
        }
      >
        {category && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa danh mục{' '}
                <span className="font-semibold text-red-600">{category.name}</span>?
              </p>
              <p className="text-sm text-red-500 mt-2">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => setOpenDeleteModal(false)}
                style={{ color: 'gray', background: 'transparent', border: 'none' }}
                size="sm"
                title="Hủy"
              />
              <Button
                onClick={handleSubmitDelete}
                title="Xóa danh mục"
                size="sm"
                disabled={loading}
                style={{ backgroundColor: '#dc2626' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* VIEW MODAL */}
      <Modal
        opened={openViewModal}
        onClose={() => setOpenViewModal(false)}
        size="xl"
        title={
          <div className="flex items-center gap-2 font-medium text-gray-600">
            <Eye size={20} />
            <p>Chi tiết danh mục</p>
          </div>
        }
      >
        {category && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Tag size={20} className="text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Thông tin danh mục</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Tên danh mục</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-1">
                    <span className="text-gray-900 font-medium">{category.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Mô tả</label>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-1">
                    <span className="text-gray-900">
                      {category.description || <em className="text-gray-500">Không có mô tả</em>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MAIN VIEW */}
      <div className="flex flex-col h-full">
        <FilterBar
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          onSearch={(value) => setFilters((prev) => ({ ...prev, q: value }))}
          actions={
            <>
              <button
                onClick={handleOpenCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-nowrap rounded-md flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors duration-300"
              >
                <Plus size={16} />
                <span className="font-medium text-sm">Tạo danh mục</span>
              </button>

              {/* ✅ FIXED LAYOUT EXPORT BUTTON */}
              <button
                onClick={handleExportExcel}
                className="bg-white border text-nowrap border-gray-200 rounded-md flex items-center justify-center gap-2 py-2 px-4 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Download size={16} className="shrink-0" />
                <span className="text-gray-900 font-medium text-xs whitespace-nowrap">Xuất dữ liệu</span>
              </button>
            </>
          }
        />

        <Table
          total={pagination?.total}
          page={pagination?.page}
          limit={pagination?.limit}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageChange={(page) => setPaginationParams((prev) => ({ ...prev, page }))}
          onPageSizeChange={(size) => setPaginationParams((prev) => ({ ...prev, limit: size }))}
          tableHeaders={tableHeaders}
          data={categories}
          isLoading={loading}
          renderRow={(cat: any) => (
            <>
              <td className="px-4 py-2 text-xs font-mono text-gray-600">{cat.id.slice(0, 32)}...</td>
              <td className="px-4 py-2 text-xs font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag size={14} className="text-blue-600" />
                  </div>
                  <span className="max-w-[200px] truncate">{cat.name}</span>
                </div>
              </td>
              <td className="px-4 py-2 text-xs text-gray-600">
                <span className="max-w-[300px] truncate block">
                  {cat.description || <em className="text-gray-400">Không có mô tả</em>}
                </span>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(cat.createdAt)}</td>
              <td className="px-4 py-2 text-xs text-gray-500">{formatDate(cat.updatedAt)}</td>
              <td>
                <div className="flex items-center gap-5 pl-4">
                  <button
                    onClick={async () => {
                      await getCategoryById(cat.id);
                      setOpenViewModal(true);
                    }}
                    title="Xem chi tiết"
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:bg-gray-700 hover:text-white transition"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    title="Chỉnh sửa"
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-pos-blue-50 text-pos-blue-500 rounded-md hover:bg-pos-blue-500 hover:text-white transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    title="Xóa"
                    onClick={() => handleOpenDeleteModal(cat)}
                    className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-red-50 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash size={16} />
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
