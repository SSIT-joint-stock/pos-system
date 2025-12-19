'use client';
import { useState, useCallback } from 'react';

export type AttributeItem = {
  id: string;
  name: string;
  value: string;
};

export default function useAttributes(initial: AttributeItem[] = []) {
  const [attributes, setAttributes] = useState<AttributeItem[]>(initial);

  // Thêm mới một attribute
  const addAttribute = useCallback(() => {
    setAttributes((prev) => [...prev, { id: crypto.randomUUID(), name: '', value: '' }]);
  }, []);

  // Xoá attribute theo id
  const removeAttribute = useCallback((id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  }, []);

  // Cập nhật một trường name/value
  const updateAttribute = useCallback((id: string, field: 'name' | 'value', newValue: string) => {
    setAttributes((prev) =>
      prev.map((attr) => (attr.id === id ? { ...attr, [field]: newValue } : attr))
    );
  }, []);
  const removeAllAttributes = useCallback(() => {
    setAttributes([]);
  }, []);

  // Convert sang meta object (gửi API)
  const toMetaObject = useCallback(() => {
    return attributes.reduce(
      (acc, attr) => {
        if (attr.name && attr.value) {
          acc[attr.name] = attr.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }, [attributes]);

  // Set attributes from meta
  const setAttributesFromMeta = useCallback((meta?: Record<string, string>) => {
    if (!meta) return;

    setAttributes(
      Object.entries(meta).map(([key, value]) => ({
        id: crypto.randomUUID(),
        name: key,
        value,
      }))
    );
  }, []);

  return {
    attributes,
    addAttribute,
    removeAttribute,
    updateAttribute,
    toMetaObject,
    setAttributes,
    removeAllAttributes,
    setAttributesFromMeta,
  };
}
