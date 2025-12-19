import { Textarea } from '@mantine/core';
import { Button, Input } from '@repo/design-system/components/ui';
import React from 'react';

export default function FormCreateCategory({
  createCategoryForm,
  handleSubmitCreate,
  setOpenCreateModal,
  loading,
}: {
  createCategoryForm?: any;
  handleSubmitCreate?: any;
  setOpenCreateModal?: any;
  loading?: boolean;
}) {
  return (
    <form
      onSubmit={createCategoryForm.handleSubmit(async (data: any) => {
        const success = await handleSubmitCreate(data);
        if (success) {
          setOpenCreateModal(false);
          createCategoryForm.reset();
        }
      })}
      className="space-y-4"
    >
      <Input
        size="sm"
        radius="sm"
        label="Tên danh mục"
        placeholder="Nhập tên danh mục..."
        {...createCategoryForm.register('name')}
        error={createCategoryForm.formState.errors.name?.message}
        required
      />

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả</label>
        <Textarea
          size="sm"
          radius="sm"
          placeholder="Nhập mô tả danh mục (tùy chọn)..."
          {...createCategoryForm.register('description')}
          minRows={3}
          error={createCategoryForm.formState.errors.description?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          onClick={() => {
            setOpenCreateModal(false);
            createCategoryForm.reset();
          }}
          style={{
            color: 'red',
            border: 'none',
            background: 'transparent',
          }}
          size="sm"
          title="Hủy"
        />
        <Button type="submit" title="Tạo danh mục" size="sm" disabled={loading} />
      </div>
    </form>
  );
}
