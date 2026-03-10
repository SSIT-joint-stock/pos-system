import { Variant } from './product';

export interface Bundle {
  id: string;
  name: string;
  quantity: number;
  sku: string;
  storeId: string;
  price: number;
  items: BundleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BundleItem {
  id: string;
  variant_name: string;
  quantity: number;
  bundleId: string;
  variantId: string;
  variant: Variant;
  createdAt: string;
  updatedAt: string;
}
