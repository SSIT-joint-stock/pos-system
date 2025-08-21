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
    id: string,
    tenantId: string,
    name: string,// Tên sản phẩm
    description?: string, // Mô tả sản phẩm
    sku: string,// Stock Keeping Unit - mã sản phẩm
    barcode?: string, // Mã vạch sản phẩm
    categoryId: string,
    basePrice: number, // Giá bán cơ bản - không cần specify unit vì sẽ có trong ProductUnit
    baseCost?: number, // Giá vốn cơ bản - không cần specify unit vì sẽ có trong ProductUnit
    trackInventory: boolean,  // Có theo dõi tồn kho không
    isActive?: boolean,
    imageUrl?: string, // URL hình ảnh sản phẩm
    tags: object,      // Array of tags for searching
    createdAt?: Date,
    updatedAt?: Date,
}

export interface DeleteProductDTO {
    id: string
}

export interface GetProductDTO {
    id: string
}

export interface productServiceResult {
    message: string
    status: number
}

export interface IProductService {
    createProduct(data: CreateProductDTO): Promise<string>
    updateProduct(data: UpdateProductDTO): Promise<string>
    deleteProduct(data: DeleteProductDTO): Promise<string>
    getProduct(data: GetProductDTO): Promise<string>
}
