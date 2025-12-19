'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Table } from '@repo/design-system/components/ui';
import { Edit, Plus } from 'lucide-react';
import { Textarea } from '@mantine/core';
import { formatDate } from '../../../../../main/src/utils';
import { useCategories } from '../../../../../main/src/hooks/categories/use-categories';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { ActionButtons } from '../components/action-buttons';
import { DeleteConfirmationModal } from '../components/delete-confirmation-modal';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';
import FormCreateCategory from '../components/form-create-category';
import DashboardViewLayout from '../../../../../main/src/layouts/dashboard-view-layout';

const tableHeaders = ['Tên danh mục', 'Mô tả', 'Ngày tạo', 'Thao tác'];

export function ManageCategoriesView() {
  // Modals state
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const currentStore = useAtomValue(currentStoreAtom);

  // Hook
  const {
    categories,
    category,
    pagination,
    paginationParams,
    filters,
    loading,
    createCategoryForm,
    updateCategoryForm,
    importCategories,
    exportExcelCategory,
    downloadExampleCategory,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    setFilters,
    setPaginationParams,
  } = useCategories();

  // Load categories on mount and when dependencies change
  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore?.id, paginationParams, filters]);

  // Reset form when category changes for edit modal
  useEffect(() => {
    if (category && openEditModal) {
      updateCategoryForm.reset({
        name: category.name || '',
        description: category.description || '',
      });
    }
  }, [category, openEditModal, updateCategoryForm]);

  // Handlers
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
      {/* MAIN CONTENT */}
      <DashboardViewLayout>
        <DisplayField label="Danh sách sản phẩm">
          <Button
            title="Thêm danh mục"
            onClick={handleOpenCreateModal}
            icon={<Plus size={16} />}
            size="sm"
            radius="sm"
          />
        </DisplayField>
        {/* ACTION BAR */}
        <DataActionBar
          dataComplete={[...new Set(categories?.map((p) => p.name) || [])]}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
          }}
          onSearch={(value) => {
            setFilters((prev) => ({ ...prev, q: value }));
          }}
          onDownloadTemplate={downloadExampleCategory}
          onExport={exportExcelCategory}
          onUpload={importCategories}
          placeholderSearch="Nhập tên danh mục, mã danh mục"
        />

        {/* TABLE */}
        <Table
          hasMarginTop={false}
          total={pagination?.total}
          page={pagination?.page}
          limit={pagination?.limit}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? paginationParams.limit}
          onPageSizeChange={(size) =>
            setPaginationParams((prev) => ({
              ...prev,
              limit: size,
            }))
          }
          onPageChange={(page) =>
            setPaginationParams((prev) => ({
              ...prev,
              page,
            }))
          }
          tableHeaders={tableHeaders}
          data={categories}
          isLoading={loading}
          renderRow={(cat: any) => (
            <>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                <span className=" truncate">{cat.name}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <span className="max-w-[300px] truncate block">
                  {cat.description || <em className="text-gray-400">Không có mô tả</em>}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(cat.createdAt)}</td>
              <td>
                <ActionButtons
                  onEdit={() => {
                    handleOpenEditModal(cat);
                  }}
                  onDelete={() => {
                    handleOpenDeleteModal(cat);
                  }}
                />
              </td>
            </>
          )}
        />
      </DashboardViewLayout>

      {/* MODAL TẠO DANH MỤC */}
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

      {/* MODAL SỬA DANH MỤC */}
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
            radius="sm"
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
              style={{
                color: 'red',
                border: 'none',
                background: 'transparent',
              }}
              size="sm"
              title="Hủy"
            />
            <Button type="submit" title="Cập nhật" size="sm" disabled={loading} />
          </div>
        </form>
      </Modal>

      {/* MODAL XÓA DANH MỤC */}

      <DeleteConfirmationModal
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleSubmitDelete}
        loading={loading}
        itemName={category?.name}
      />
    </>
  );
}
