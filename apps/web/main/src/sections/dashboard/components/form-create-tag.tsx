import { Textarea } from '@mantine/core';
import { Button, Input } from '@repo/design-system/components/ui';
import React from 'react';

export default function FormCreateTag({
  createTagForm,
  handleSubmitCreate,
  setOpenCreateModal,
  loading,
}: {
  createTagForm?: any;
  handleSubmitCreate?: any;
  setOpenCreateModal?: any;
  loading?: boolean;
}) {
  return (
    <form
      onSubmit={createTagForm.handleSubmit(async (data: any) => {
        const success = await handleSubmitCreate(data);
        if (success) {
          setOpenCreateModal(false);
          createTagForm.reset();
        }
      })}
      className="space-y-4"
    >
      <Input
        size="sm"
        radius="sm"
        label="Tên tag"
        placeholder="Nhập tag..."
        {...createTagForm.register('name')}
        error={createTagForm.formState.errors.name?.message}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Mô tả</label>
        <Textarea
          size="sm"
          radius="sm"
          placeholder="Nhập mô tả tag (tùy chọn)..."
          {...createTagForm.register('description')}
          minRows={3}
          error={createTagForm.formState.errors.description?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          onClick={() => {
            setOpenCreateModal(false);
            createTagForm.reset();
          }}
          style={{
            color: 'red',
            border: 'none',
            background: 'transparent',
          }}
          size="sm"
          title="Hủy"
        />
        <Button type="submit" title="Tạo tag" size="sm" disabled={loading} />
      </div>
    </form>
  );
}
