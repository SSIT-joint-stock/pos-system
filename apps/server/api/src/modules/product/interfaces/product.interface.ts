import { ProductEntity } from "@/shared/repositories/product.repository";

export interface CreateProductDTO {
    tenantId: string;
    name: string;
    sku: string;
    categoryId: string;
    basePrice: number;

    description?: string;
    barcode?: string;
    baseCost?: number;
    trackInventory?: boolean;
    isActive?: boolean;
    imageUrl?: string;
    tags?: string[];
}

export interface UpdateProductDTO {
    tenantId?: string,
    name?: string,// Tên sản phẩm
    description?: string, // Mô tả sản phẩm
    sku?: string,// Stock Keeping Unit - mã sản phẩm
    barcode?: string, // Mã vạch sản phẩm
    categoryId?: string,
    basePrice?: number, // Giá bán cơ bản - không cần specify unit vì sẽ có trong ProductUnit
    baseCost?: number, // Giá vốn cơ bản - không cần specify unit vì sẽ có trong ProductUnit
    isActive?: boolean,
    imageUrl?: string, // URL hình ảnh sản phẩm
    tags?: string[],      // Array of tags for searching
    createdAt?: Date,
    updatedAt?: Date,
}

export interface DeleteProductDTO {
    id: string
}

export interface GetProductDTO {
    id: string
}

export interface GetProductsDetailDTO {
    tenantId?: string;
    name?: string;
    sku?: string;
    categoryId?: string;
    basePrice?: number;
    description?: string;
    barcode?: string;
    baseCost?: number;
    trackInventory?: boolean;
    isActive?: boolean;
    imageUrl?: string;
    tags?: string[];
    createdAt?: Date,
    updatedAt?: Date,
}

type ProductPick = Pick<ProductEntity, (typeof PickProductFields)[number]>;
export interface productServiceResult {
    product: Pick<ProductEntity, (typeof PickProductFields)[number]>,
}

export interface ProductListServiceResult {
    products: ProductPick[]; // nhiều sản phẩm
}

export const PickProductFields = [
    "id",
    "tenantId",
    "name",
    "description",
    "sku",
    "barcode",
    "categoryId",
    "basePrice",
    "baseCost",
    "trackInventory",
    "isActive",
    "imageUrl",
    "tags",
    "createdAt",
    "updatedAt",
] as const;

export interface IProductService {
    createProduct(data: CreateProductDTO): Promise<productServiceResult>
    updateProduct(id: string, data: UpdateProductDTO): Promise<productServiceResult>
    deleteProduct(id: string): Promise<void>
    getProduct(id: string): Promise<productServiceResult>
    getAllProducts(): Promise<ProductListServiceResult>

}
