export interface Product {
  id: string;
  store_id: string;
  name: string;
  sku: string;
  barcode?: string; // optional nếu có sản phẩm không có barcode
  price: number;
  cost: number;
  image_url?: string; // optional vì có thể sản phẩm chưa có hình
  description?: string;
  product_status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; // dạng ISO string từ backend
  updatedAt: string;
}
