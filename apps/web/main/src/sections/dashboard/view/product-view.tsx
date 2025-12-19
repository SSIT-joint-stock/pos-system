/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';

import FormCreateTag from '../components/form-create-tag';
import FormCreateCategory from '../components/form-create-category';
import { Modal } from '@repo/design-system/components/ui';
import { MoveLeft } from 'lucide-react';
import { useCategories } from '../../../hooks/categories/use-categories';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { useTags } from '../../../hooks/tags/use-tag';
import { FormProduct } from '../components';
import { usePathname, useRouter } from 'next/navigation';

export function ProductView({ productId }: { productId?: string }) {
  const currentStore = useAtomValue(currentStoreAtom);
  const pathName = usePathname();
  const router = useRouter();
  const {
    categories,
    loading: loadingCategories,
    createCategoryForm,
    getCategories,
    createCategory,
  } = useCategories();
  const { createTag, getTags, tags, loading: loadingTags, createTagForm } = useTags();
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalTag, setOpenModalTag] = useState(false);

  useEffect(() => {
    if (!currentStore?.id) return;
    getCategories();
    getTags();
  }, [currentStore?.id]);

  return (
    <>
      <div className="bg-gray-50 w-full h-full mx-auto ">
        <div className="mx-auto  max-w-6xl h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer justify-center border border-gray-200 bg-white text-gray-500 rounded-md"
            >
              <MoveLeft size={18} />
            </button>
            <h1 className="text-2xl text-gray-900 font-semibold">
              {pathName?.includes('create') ? 'Thêm sản phẩm' : 'Thông tin chi tiết'}
            </h1>
          </div>
          <FormProduct
            categories={categories}
            tags={tags}
            productId={productId}
            setOpenModalCategory={setOpenModalCategory}
            setOpenModalTag={setOpenModalTag}
          />
        </div>
      </div>
      {/* Create category */}
      <Modal
        size="lg"
        title="Thêm danh mục"
        opened={openModalCategory}
        onClose={() => setOpenModalCategory(false)}
      >
        <FormCreateCategory
          createCategoryForm={createCategoryForm}
          handleSubmitCreate={createCategory}
          setOpenCreateModal={setOpenModalCategory}
          loading={loadingCategories}
        />
      </Modal>
      {/* Create  tag */}

      <Modal
        size="lg"
        title="Thêm thẻ (tag)"
        opened={openModalTag}
        onClose={() => setOpenModalTag(false)}
      >
        <FormCreateTag
          createTagForm={createTagForm}
          handleSubmitCreate={createTag}
          setOpenCreateModal={setOpenModalTag}
          loading={loadingTags}
        />
      </Modal>
    </>
  );
}
