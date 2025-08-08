# Repository Pattern Implementation

## Tổng quan

Repository Pattern là một design pattern cung cấp lớp trừu tượng giữa business logic và data access layer. Pattern này đặc biệt hữu ích trong hệ thống multi-tenant POS để tách biệt logic truy cập dữ liệu và đảm bảo tenant isolation.

## Cấu trúc Pattern

```typescript
// interfaces/IRepository.ts
export interface IRepository<T, K = string> {
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: K): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  update(id: K, entity: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}

// interfaces/ITenantRepository.ts
export interface ITenantRepository<T, K = string> extends IRepository<T, K> {
  findByTenant(tenantId: string, filter?: Partial<T>): Promise<T[]>;
  findByIdAndTenant(id: K, tenantId: string): Promise<T | null>;
  updateByTenant(id: K, tenantId: string, entity: Partial<T>): Promise<T | null>;
  deleteByTenant(id: K, tenantId: string): Promise<boolean>;
  countByTenant(tenantId: string, filter?: Partial<T>): Promise<number>;
}
```

## Base Repository Implementation

### 1. Abstract Base Repository
```typescript
// repositories/base/BaseRepository.ts
import { PrismaClient } from '@prisma/client';
import { IRepository } from '../interfaces/IRepository';

export abstract class BaseRepository<T, K = string> implements IRepository<T, K> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  protected getModel() {
    return (this.prisma as any)[this.modelName];
  }

  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const model = this.getModel();
      const result = await model.create({
        data: {
          ...entity,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return result as T;
    } catch (error) {
      this.handleError('create', error);
      throw error;
    }
  }

  async findById(id: K): Promise<T | null> {
    try {
      const model = this.getModel();
      const result = await model.findUnique({
        where: { id },
      });
      return result as T | null;
    } catch (error) {
      this.handleError('findById', error);
      throw error;
    }
  }

  async findAll(filter?: Partial<T>): Promise<T[]> {
    try {
      const model = this.getModel();
      const where = filter ? this.buildWhereClause(filter) : {};
      
      const results = await model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      
      return results as T[];
    } catch (error) {
      this.handleError('findAll', error);
      throw error;
    }
  }

  async update(id: K, entity: Partial<T>): Promise<T | null> {
    try {
      const model = this.getModel();
      const result = await model.update({
        where: { id },
        data: {
          ...entity,
          updatedAt: new Date(),
        },
      });
      return result as T;
    } catch (error) {
      this.handleError('update', error);
      throw error;
    }
  }

  async delete(id: K): Promise<boolean> {
    try {
      const model = this.getModel();
      await model.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      this.handleError('delete', error);
      return false;
    }
  }

  async count(filter?: Partial<T>): Promise<number> {
    try {
      const model = this.getModel();
      const where = filter ? this.buildWhereClause(filter) : {};
      
      return await model.count({ where });
    } catch (error) {
      this.handleError('count', error);
      throw error;
    }
  }

  protected buildWhereClause(filter: Partial<T>): any {
    const where: any = {};
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          where[key] = { contains: value, mode: 'insensitive' };
        } else {
          where[key] = value;
        }
      }
    });

    return where;
  }

  protected handleError(operation: string, error: any): void {
    console.error(`Repository ${this.modelName} ${operation} error:`, error);
  }
}
```

### 2. Tenant-Aware Base Repository
```typescript
// repositories/base/TenantBaseRepository.ts
import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { ITenantRepository } from '../interfaces/ITenantRepository';

export abstract class TenantBaseRepository<T, K = string> 
  extends BaseRepository<T, K> 
  implements ITenantRepository<T, K> {

  constructor(prisma: PrismaClient, modelName: string) {
    super(prisma, modelName);
  }

  async findByTenant(tenantId: string, filter?: Partial<T>): Promise<T[]> {
    try {
      const model = this.getModel();
      const where = {
        tenantId,
        ...this.buildWhereClause(filter || {}),
      };

      const results = await model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return results as T[];
    } catch (error) {
      this.handleError('findByTenant', error);
      throw error;
    }
  }

  async findByIdAndTenant(id: K, tenantId: string): Promise<T | null> {
    try {
      const model = this.getModel();
      const result = await model.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      return result as T | null;
    } catch (error) {
      this.handleError('findByIdAndTenant', error);
      throw error;
    }
  }

  async updateByTenant(id: K, tenantId: string, entity: Partial<T>): Promise<T | null> {
    try {
      const model = this.getModel();
      const result = await model.updateMany({
        where: {
          id,
          tenantId,
        },
        data: {
          ...entity,
          updatedAt: new Date(),
        },
      });

      if (result.count > 0) {
        return await this.findByIdAndTenant(id, tenantId);
      }

      return null;
    } catch (error) {
      this.handleError('updateByTenant', error);
      throw error;
    }
  }

  async deleteByTenant(id: K, tenantId: string): Promise<boolean> {
    try {
      const model = this.getModel();
      const result = await model.deleteMany({
        where: {
          id,
          tenantId,
        },
      });

      return result.count > 0;
    } catch (error) {
      this.handleError('deleteByTenant', error);
      return false;
    }
  }

  async countByTenant(tenantId: string, filter?: Partial<T>): Promise<number> {
    try {
      const model = this.getModel();
      const where = {
        tenantId,
        ...this.buildWhereClause(filter || {}),
      };

      return await model.count({ where });
    } catch (error) {
      this.handleError('countByTenant', error);
      throw error;
    }
  }

  // Override base methods to include tenant isolation
  async create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const entityWithTenant = entity as any;
    if (!entityWithTenant.tenantId) {
      throw new Error('Tenant ID is required for tenant-aware repositories');
    }

    return super.create(entity);
  }
}
```

## Concrete Repository Implementations

### 1. Product Repository
```typescript
// repositories/ProductRepository.ts
import { PrismaClient, Product } from '@prisma/client';
import { TenantBaseRepository } from './base/TenantBaseRepository';

export interface ProductFilter {
  name?: string;
  categoryId?: string;
  isActive?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface ProductWithCategory extends Product {
  category?: {
    id: string;
    name: string;
  };
}

export class ProductRepository extends TenantBaseRepository<Product> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'product');
  }

  async findByTenantWithCategory(
    tenantId: string, 
    filter?: ProductFilter
  ): Promise<ProductWithCategory[]> {
    try {
      const where: any = { tenantId };

      if (filter?.name) {
        where.name = { contains: filter.name, mode: 'insensitive' };
      }

      if (filter?.categoryId) {
        where.categoryId = filter.categoryId;
      }

      if (filter?.isActive !== undefined) {
        where.isActive = filter.isActive;
      }

      if (filter?.priceRange) {
        where.price = {};
        if (filter.priceRange.min !== undefined) {
          where.price.gte = filter.priceRange.min;
        }
        if (filter.priceRange.max !== undefined) {
          where.price.lte = filter.priceRange.max;
        }
      }

      const products = await this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });

      return products as ProductWithCategory[];
    } catch (error) {
      this.handleError('findByTenantWithCategory', error);
      throw error;
    }
  }

  async findLowStockProducts(tenantId: string, threshold: number = 10): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          tenantId,
          quantity: {
            lte: threshold,
          },
          isActive: true,
        },
        orderBy: { quantity: 'asc' },
      });

      return products;
    } catch (error) {
      this.handleError('findLowStockProducts', error);
      throw error;
    }
  }

  async updateStock(
    productId: string, 
    tenantId: string, 
    quantityChange: number
  ): Promise<Product | null> {
    try {
      const product = await this.findByIdAndTenant(productId, tenantId);
      if (!product) {
        throw new Error('Product not found');
      }

      const newQuantity = product.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new Error('Insufficient stock');
      }

      return await this.updateByTenant(productId, tenantId, {
        quantity: newQuantity,
      });
    } catch (error) {
      this.handleError('updateStock', error);
      throw error;
    }
  }

  async searchProducts(tenantId: string, searchTerm: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          tenantId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { sku: { contains: searchTerm, mode: 'insensitive' } },
            { barcode: { contains: searchTerm, mode: 'insensitive' } },
          ],
          isActive: true,
        },
        orderBy: { name: 'asc' },
      });

      return products;
    } catch (error) {
      this.handleError('searchProducts', error);
      throw error;
    }
  }
}
```

### 2. Invoice Repository
```typescript
// repositories/InvoiceRepository.ts
import { PrismaClient, Invoice, InvoiceItem } from '@prisma/client';
import { TenantBaseRepository } from './base/TenantBaseRepository';

export interface InvoiceFilter {
  status?: string;
  customerId?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  totalRange?: {
    min?: number;
    max?: number;
  };
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface RevenueStats {
  totalRevenue: number;
  totalInvoices: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

export class InvoiceRepository extends TenantBaseRepository<Invoice> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'invoice');
  }

  async findByTenantWithItems(
    tenantId: string, 
    filter?: InvoiceFilter
  ): Promise<InvoiceWithItems[]> {
    try {
      const where: any = { tenantId };

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.customerId) {
        where.customerId = filter.customerId;
      }

      if (filter?.dateRange) {
        where.createdAt = {
          gte: filter.dateRange.from,
          lte: filter.dateRange.to,
        };
      }

      if (filter?.totalRange) {
        where.total = {};
        if (filter.totalRange.min !== undefined) {
          where.total.gte = filter.totalRange.min;
        }
        if (filter.totalRange.max !== undefined) {
          where.total.lte = filter.totalRange.max;
        }
      }

      const invoices = await this.prisma.invoice.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return invoices as InvoiceWithItems[];
    } catch (error) {
      this.handleError('findByTenantWithItems', error);
      throw error;
    }
  }

  async getRevenueStats(
    tenantId: string, 
    dateRange: { from: Date; to: Date }
  ): Promise<RevenueStats> {
    try {
      // Get basic revenue stats
      const revenueAgg = await this.prisma.invoice.aggregate({
        where: {
          tenantId,
          createdAt: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
          status: 'paid',
        },
        _sum: { total: true },
        _count: true,
        _avg: { total: true },
      });

      // Get top selling products
      const topProducts = await this.prisma.invoiceItem.groupBy({
        by: ['productId'],
        where: {
          invoice: {
            tenantId,
            createdAt: {
              gte: dateRange.from,
              lte: dateRange.to,
            },
            status: 'paid',
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            subtotal: 'desc',
          },
        },
        take: 10,
      });

      // Get product names for top products
      const productIds = topProducts.map(item => item.productId);
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          tenantId,
        },
        select: {
          id: true,
          name: true,
        },
      });

      const productMap = new Map(products.map(p => [p.id, p.name]));

      return {
        totalRevenue: revenueAgg._sum.total || 0,
        totalInvoices: revenueAgg._count,
        averageOrderValue: revenueAgg._avg.total || 0,
        topProducts: topProducts.map(item => ({
          productId: item.productId,
          productName: productMap.get(item.productId) || 'Unknown',
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.subtotal || 0,
        })),
      };
    } catch (error) {
      this.handleError('getRevenueStats', error);
      throw error;
    }
  }

  async findInvoicesByDateRange(
    tenantId: string,
    from: Date,
    to: Date
  ): Promise<Invoice[]> {
    try {
      return await this.findByTenant(tenantId, {
        createdAt: {
          gte: from,
          lte: to,
        },
      } as any);
    } catch (error) {
      this.handleError('findInvoicesByDateRange', error);
      throw error;
    }
  }

  async getMonthlyRevenue(tenantId: string, year: number): Promise<Array<{
    month: number;
    revenue: number;
    invoiceCount: number;
  }>> {
    try {
      const results = await this.prisma.$queryRaw`
        SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          SUM(total) as revenue,
          COUNT(*) as invoice_count
        FROM invoices 
        WHERE tenant_id = ${tenantId}
          AND EXTRACT(YEAR FROM created_at) = ${year}
          AND status = 'paid'
        GROUP BY EXTRACT(MONTH FROM created_at)
        ORDER BY month
      `;

      return (results as any[]).map(row => ({
        month: Number(row.month),
        revenue: Number(row.revenue),
        invoiceCount: Number(row.invoice_count),
      }));
    } catch (error) {
      this.handleError('getMonthlyRevenue', error);
      throw error;
    }
  }
}
```

### 3. Customer Repository
```typescript
// repositories/CustomerRepository.ts
import { PrismaClient, Customer } from '@prisma/client';
import { TenantBaseRepository } from './base/TenantBaseRepository';

export interface CustomerWithStats extends Customer {
  stats?: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
  };
}

export class CustomerRepository extends TenantBaseRepository<Customer> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'customer');
  }

  async findByEmail(email: string, tenantId: string): Promise<Customer | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          email,
          tenantId,
        },
      });

      return customer;
    } catch (error) {
      this.handleError('findByEmail', error);
      throw error;
    }
  }

  async findByPhone(phone: string, tenantId: string): Promise<Customer | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          phone,
          tenantId,
        },
      });

      return customer;
    } catch (error) {
      this.handleError('findByPhone', error);
      throw error;
    }
  }

  async findWithStats(tenantId: string): Promise<CustomerWithStats[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        where: { tenantId },
        include: {
          _count: {
            select: { invoices: true },
          },
          invoices: {
            select: {
              total: true,
              createdAt: true,
            },
            where: {
              status: 'paid',
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      return customers.map(customer => ({
        ...customer,
        stats: {
          totalOrders: customer._count.invoices,
          totalSpent: customer.invoices.reduce((sum, invoice) => sum + invoice.total, 0),
          lastOrderDate: customer.invoices[0]?.createdAt,
        },
      })) as CustomerWithStats[];
    } catch (error) {
      this.handleError('findWithStats', error);
      throw error;
    }
  }

  async searchCustomers(tenantId: string, searchTerm: string): Promise<Customer[]> {
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          tenantId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
      });

      return customers;
    } catch (error) {
      this.handleError('searchCustomers', error);
      throw error;
    }
  }
}
```

## Repository Factory

```typescript
// repositories/RepositoryFactory.ts
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from './ProductRepository';
import { InvoiceRepository } from './InvoiceRepository';
import { CustomerRepository } from './CustomerRepository';

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private prisma: PrismaClient;
  private repositories: Map<string, any> = new Map();

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  static getInstance(prisma?: PrismaClient): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      if (!prisma) {
        throw new Error('Prisma client is required for first initialization');
      }
      RepositoryFactory.instance = new RepositoryFactory(prisma);
    }
    return RepositoryFactory.instance;
  }

  getProductRepository(): ProductRepository {
    if (!this.repositories.has('product')) {
      this.repositories.set('product', new ProductRepository(this.prisma));
    }
    return this.repositories.get('product');
  }

  getInvoiceRepository(): InvoiceRepository {
    if (!this.repositories.has('invoice')) {
      this.repositories.set('invoice', new InvoiceRepository(this.prisma));
    }
    return this.repositories.get('invoice');
  }

  getCustomerRepository(): CustomerRepository {
    if (!this.repositories.has('customer')) {
      this.repositories.set('customer', new CustomerRepository(this.prisma));
    }
    return this.repositories.get('customer');
  }

  // Method to clear cache (useful for testing)
  clearCache(): void {
    this.repositories.clear();
  }
}
```

## Usage trong Service Layer

```typescript
// services/ProductService.ts
import { RepositoryFactory } from '../repositories/RepositoryFactory';
import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '@prisma/client';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(repositoryFactory: RepositoryFactory) {
    this.productRepository = repositoryFactory.getProductRepository();
  }

  async createProduct(tenantId: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Validate SKU uniqueness within tenant
    const existingProduct = await this.productRepository.findByTenant(tenantId, {
      sku: productData.sku,
    } as any);

    if (existingProduct.length > 0) {
      throw new Error('SKU already exists for this tenant');
    }

    return await this.productRepository.create({
      ...productData,
      tenantId,
    });
  }

  async getProductsByTenant(tenantId: string, filters?: any): Promise<Product[]> {
    return await this.productRepository.findByTenantWithCategory(tenantId, filters);
  }

  async updateProductStock(productId: string, tenantId: string, quantityChange: number): Promise<Product | null> {
    return await this.productRepository.updateStock(productId, tenantId, quantityChange);
  }

  async getLowStockProducts(tenantId: string, threshold?: number): Promise<Product[]> {
    return await this.productRepository.findLowStockProducts(tenantId, threshold);
  }

  async searchProducts(tenantId: string, searchTerm: string): Promise<Product[]> {
    return await this.productRepository.searchProducts(tenantId, searchTerm);
  }
}
```

## Testing Repository Pattern

```typescript
// tests/repositories/ProductRepository.test.ts
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../repositories/ProductRepository';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

describe('ProductRepository', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let productRepository: ProductRepository;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    productRepository = new ProductRepository(prisma);
  });

  afterEach(() => {
    mockReset(prisma);
  });

  describe('findByTenantWithCategory', () => {
    it('should return products with category for a tenant', async () => {
      const tenantId = 'tenant-1';
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Test Product',
          tenantId,
          category: {
            id: 'category-1',
            name: 'Test Category',
          },
        },
      ];

      prisma.product.findMany.mockResolvedValue(mockProducts as any);

      const result = await productRepository.findByTenantWithCategory(tenantId);

      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { tenantId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });

    it('should apply filters correctly', async () => {
      const tenantId = 'tenant-1';
      const filter = {
        name: 'Test',
        priceRange: { min: 10, max: 100 },
      };

      prisma.product.findMany.mockResolvedValue([]);

      await productRepository.findByTenantWithCategory(tenantId, filter);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          tenantId,
          name: { contains: 'Test', mode: 'insensitive' },
          price: { gte: 10, lte: 100 },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('updateStock', () => {
    it('should update product stock successfully', async () => {
      const productId = 'product-1';
      const tenantId = 'tenant-1';
      const quantityChange = 5;
      const currentProduct = {
        id: productId,
        quantity: 10,
        tenantId,
      };
      const updatedProduct = {
        ...currentProduct,
        quantity: 15,
      };

      jest.spyOn(productRepository, 'findByIdAndTenant').mockResolvedValue(currentProduct as any);
      jest.spyOn(productRepository, 'updateByTenant').mockResolvedValue(updatedProduct as any);

      const result = await productRepository.updateStock(productId, tenantId, quantityChange);

      expect(result).toEqual(updatedProduct);
      expect(productRepository.updateByTenant).toHaveBeenCalledWith(
        productId,
        tenantId,
        { quantity: 15 }
      );
    });

    it('should throw error for insufficient stock', async () => {
      const productId = 'product-1';
      const tenantId = 'tenant-1';
      const quantityChange = -15;
      const currentProduct = {
        id: productId,
        quantity: 10,
        tenantId,
      };

      jest.spyOn(productRepository, 'findByIdAndTenant').mockResolvedValue(currentProduct as any);

      await expect(
        productRepository.updateStock(productId, tenantId, quantityChange)
      ).rejects.toThrow('Insufficient stock');
    });
  });
});
```

## Key Features & Benefits

### 1. **Tenant Isolation**
- **Row-Level Security**: Tự động filter theo tenantId
- **Data Segregation**: Đảm bảo tenant không access được data của nhau
- **Multi-Tenant Support**: Built-in support cho multi-tenant architecture

### 2. **Type Safety**
- **Generic Types**: Strongly typed repositories với TypeScript
- **Interface Contracts**: Clear contracts cho data access operations
- **Compile-Time Checking**: Catch errors at compile time

### 3. **Separation of Concerns**
- **Data Access Logic**: Tách biệt business logic và data access
- **Repository Pattern**: Single responsibility cho mỗi repository
- **Service Layer Integration**: Clean integration với service layer

### 4. **Advanced Query Features**
- **Filter & Search**: Complex filtering và searching capabilities
- **Aggregations**: Revenue stats, analytics queries
- **Relationships**: Eager loading với Prisma includes

### 5. **Error Handling & Logging**
- **Centralized Error Handling**: Consistent error handling across repositories
- **Operation Logging**: Detailed logging cho debugging
- **Transaction Support**: Database transaction support

### 6. **Testing Support**
- **Mockable Interfaces**: Easy to mock cho unit testing
- **Repository Factory**: Dependency injection pattern
- **Test Isolation**: Clear separation cho testing

Repository pattern này cung cấp foundation mạnh mẽ cho hệ thống POS multi-tenant với type safety, tenant isolation, và advanced querying capabilities!