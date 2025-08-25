import { ProductListServiceResult } from "@/modules/product/interfaces/product.interface";

export interface CreateOrderDTO {

}

export interface IOrderService {
    createOrder(): Promise<ProductListServiceResult>
}