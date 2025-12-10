export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  sku: string;
  baseUnit: string;
  barcode?: string;
  price: number;
  cost: number;
  image_url?: string;
  description?: string;
  product_status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; // dạng ISO string từ backend
  updatedAt: string;

  meta: Record<string, any>;
  categoryIds?: string[];
  tagsIds?: string[];
  tags: [
    {
      id: string;
      name: string;
      description: string;
    },
  ];
  categories: [
    {
      id: string;
      name: string;
      description: string;
    },
  ];
  variant: Variant[];
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  barcode: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
  onHand: number;
  reserved: number;
  damaged: number;
  variant_stocks: [];
  conversions: Conversions[];
}
export interface VariantStocks {
  onHand: number;
  reserved: number;
  damaged: number;
}
export interface Conversions {
  id: string;
  name: string;
  factor: number;
  variantId: string;
}
