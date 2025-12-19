export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  type:
    | 'ADJUSTMENT'
    | 'PURCHASE'
    | 'RETURN_PURCHASE'
    | 'RETURN_SALE'
    | 'TRANSFER_IMPORT'
    | 'TRANSFER_EXPORT';
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    sku: string;
    price: number;
  };
  variants: {
    name: string;
    id: string;
    price: string;
    sku: string;
  };
}
