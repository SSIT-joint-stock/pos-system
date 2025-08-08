# Strategy Pattern Implementation

## Tổng quan

Strategy Pattern là một design pattern thuộc nhóm Behavioral Patterns, cho phép định nghĩa một nhóm các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau. Pattern này giúp thuật toán có thể thay đổi độc lập với client sử dụng nó.

## Lợi ích

- **Tách biệt thuật toán**: Mỗi strategy được đóng gói riêng biệt
- **Runtime switching**: Có thể thay đổi strategy trong runtime
- **Open/Closed Principle**: Mở để mở rộng, đóng để sửa đổi
- **Loại bỏ conditional statements**: Thay thế if/else hoặc switch/case phức tạp
- **Code reusability**: Strategies có thể được tái sử dụng

## Cấu trúc cơ bản

```typescript
// Strategy Interface
interface Strategy {
  execute(data: any): any;
}

// Concrete Strategies
class ConcreteStrategyA implements Strategy {
  execute(data: any): any {
    return "Strategy A result";
  }
}

class ConcreteStrategyB implements Strategy {
  execute(data: any): any {
    return "Strategy B result";
  }
}

// Context
class Context {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  executeStrategy(data: any): any {
    return this.strategy.execute(data);
  }
}
```

## Ví dụ thực tế: Payment Processing System

### 1. Định nghĩa interfaces và types

```typescript
// types/payment.types.ts
export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentType;
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto',
  WALLET = 'wallet'
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status: PaymentStatus;
  fees?: number;
  processingTime?: number;
  redirectUrl?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface CustomerInfo {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Strategy Interface
export interface PaymentStrategy {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  validatePayment(request: PaymentRequest): boolean;
  calculateFees(amount: number): number;
  getProcessingTime(): number;
  supportsRefund(): boolean;
}
```

### 2. Concrete Payment Strategies

```typescript
// strategies/CreditCardStrategy.ts
import { PaymentStrategy, PaymentRequest, PaymentResponse, PaymentStatus } from '../types/payment.types';
import Stripe from 'stripe';

export class CreditCardStrategy implements PaymentStrategy {
  private stripe: Stripe;
  private feePercentage = 0.029; // 2.9% + $0.30

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.validatePayment(request)) {
        return {
          success: false,
          message: 'Invalid payment request',
          status: PaymentStatus.FAILED
        };
      }

      const fees = this.calculateFees(request.amount);
      const totalAmount = Math.round((request.amount + fees) * 100); // Convert to cents

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount,
        currency: request.currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          orderId: request.orderId,
          customerId: request.customerInfo.id
        }
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, this.getProcessingTime()));

      return {
        success: true,
        transactionId: paymentIntent.id,
        message: 'Payment processed successfully via Credit Card',
        status: PaymentStatus.COMPLETED,
        fees,
        processingTime: this.getProcessingTime()
      };

    } catch (error) {
      return {
        success: false,
        message: `Credit card payment failed: ${error.message}`,
        status: PaymentStatus.FAILED
      };
    }
  }

  validatePayment(request: PaymentRequest): boolean {
    return request.amount > 0 &&
           request.currency.length === 3 &&
           request.customerInfo.email.includes('@') &&
           request.paymentMethod.type === 'credit_card';
  }

  calculateFees(amount: number): number {
    return Math.round((amount * this.feePercentage + 0.30) * 100) / 100;
  }

  getProcessingTime(): number {
    return 2000; // 2 seconds
  }

  supportsRefund(): boolean {
    return true;
  }
}
```

```typescript
// strategies/PayPalStrategy.ts
import { PaymentStrategy, PaymentRequest, PaymentResponse, PaymentStatus } from '../types/payment.types';
import * as paypal from '@paypal/checkout-server-sdk';

export class PayPalStrategy implements PaymentStrategy {
  private client: paypal.core.PayPalHttpClient;
  private feePercentage = 0.0349; // 3.49% + $0.49

  constructor(clientId: string, clientSecret: string, sandbox: boolean = true) {
    const environment = sandbox 
      ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
      : new paypal.core.LiveEnvironment(clientId, clientSecret);
    
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.validatePayment(request)) {
        return {
          success: false,
          message: 'Invalid PayPal payment request',
          status: PaymentStatus.FAILED
        };
      }

      const fees = this.calculateFees(request.amount);

      // Create PayPal order
      const orderRequest = new paypal.orders.OrdersCreateRequest();
      orderRequest.prefer("return=representation");
      orderRequest.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: request.currency,
            value: request.amount.toFixed(2)
          },
          reference_id: request.orderId
        }],
        payer: {
          email_address: request.customerInfo.email,
          name: {
            given_name: request.customerInfo.name.split(' ')[0],
            surname: request.customerInfo.name.split(' ').slice(1).join(' ')
          }
        }
      });

      const order = await this.client.execute(orderRequest);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, this.getProcessingTime()));

      return {
        success: true,
        transactionId: order.result.id,
        message: 'Payment processed successfully via PayPal',
        status: PaymentStatus.PENDING, // PayPal requires approval
        fees,
        processingTime: this.getProcessingTime(),
        redirectUrl: order.result.links.find(link => link.rel === 'approve')?.href
      };

    } catch (error) {
      return {
        success: false,
        message: `PayPal payment failed: ${error.message}`,
        status: PaymentStatus.FAILED
      };
    }
  }

  validatePayment(request: PaymentRequest): boolean {
    return request.amount > 0 &&
           request.currency.length === 3 &&
           request.customerInfo.email.includes('@') &&
           request.paymentMethod.type === 'paypal';
  }

  calculateFees(amount: number): number {
    return Math.round((amount * this.feePercentage + 0.49) * 100) / 100;
  }

  getProcessingTime(): number {
    return 3000; // 3 seconds
  }

  supportsRefund(): boolean {
    return true;
  }
}
```

```typescript
// strategies/BankTransferStrategy.ts
import { PaymentStrategy, PaymentRequest, PaymentResponse, PaymentStatus } from '../types/payment.types';

export class BankTransferStrategy implements PaymentStrategy {
  private feePercentage = 0.01; // 1% flat fee

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.validatePayment(request)) {
        return {
          success: false,
          message: 'Invalid bank transfer request',
          status: PaymentStatus.FAILED
        };
      }

      const fees = this.calculateFees(request.amount);

      // Generate transfer reference
      const transferReference = this.generateTransferReference(request.orderId);

      // Simulate bank processing
      await new Promise(resolve => setTimeout(resolve, this.getProcessingTime()));

      // Bank transfers are typically pending until manual verification
      return {
        success: true,
        transactionId: transferReference,
        message: `Bank transfer initiated. Reference: ${transferReference}. Processing may take 1-3 business days.`,
        status: PaymentStatus.PENDING,
        fees,
        processingTime: this.getProcessingTime()
      };

    } catch (error) {
      return {
        success: false,
        message: `Bank transfer failed: ${error.message}`,
        status: PaymentStatus.FAILED
      };
    }
  }

  validatePayment(request: PaymentRequest): boolean {
    return request.amount >= 10 && // Minimum transfer amount
           request.currency.length === 3 &&
           request.customerInfo.email.includes('@') &&
           request.paymentMethod.type === 'bank_transfer';
  }

  calculateFees(amount: number): number {
    return Math.max(5, Math.round(amount * this.feePercentage * 100) / 100); // Minimum $5 fee
  }

  getProcessingTime(): number {
    return 5000; // 5 seconds for initial processing
  }

  supportsRefund(): boolean {
    return false; // Bank transfers typically don't support automatic refunds
  }

  private generateTransferReference(orderId: string): string {
    return `BT-${orderId}-${Date.now().toString(36).toUpperCase()}`;
  }
}
```

```typescript
// strategies/CryptoStrategy.ts
import { PaymentStrategy, PaymentRequest, PaymentResponse, PaymentStatus } from '../types/payment.types';

export class CryptoStrategy implements PaymentStrategy {
  private feePercentage = 0.005; // 0.5% fee
  private supportedCurrencies = ['BTC', 'ETH', 'USDT', 'ADA'];

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.validatePayment(request)) {
        return {
          success: false,
          message: 'Invalid crypto payment request',
          status: PaymentStatus.FAILED
        };
      }

      const fees = this.calculateFees(request.amount);
      
      // Generate crypto wallet address
      const walletAddress = this.generateWalletAddress();
      const conversionRate = await this.getCryptoConversionRate(request.currency);
      const cryptoAmount = (request.amount + fees) / conversionRate;

      // Simulate blockchain processing
      await new Promise(resolve => setTimeout(resolve, this.getProcessingTime()));

      return {
        success: true,
        transactionId: this.generateTransactionHash(),
        message: `Crypto payment initiated. Send ${cryptoAmount.toFixed(8)} ${request.currency} to ${walletAddress}`,
        status: PaymentStatus.PENDING,
        fees,
        processingTime: this.getProcessingTime(),
        metadata: {
          walletAddress,
          cryptoAmount: cryptoAmount.toFixed(8),
          conversionRate
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Crypto payment failed: ${error.message}`,
        status: PaymentStatus.FAILED
      };
    }
  }

  validatePayment(request: PaymentRequest): boolean {
    return request.amount > 0 &&
           this.supportedCurrencies.includes(request.currency.toUpperCase()) &&
           request.paymentMethod.type === 'crypto';
  }

  calculateFees(amount: number): number {
    return Math.round(amount * this.feePercentage * 100) / 100;
  }

  getProcessingTime(): number {
    return 1000; // 1 second for initial setup
  }

  supportsRefund(): boolean {
    return false; // Crypto transactions are typically irreversible
  }

  private generateWalletAddress(): string {
    return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Mock Bitcoin address
  }

  private generateTransactionHash(): string {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private async getCryptoConversionRate(currency: string): Promise<number> {
    // Mock conversion rates - in real implementation, fetch from crypto API
    const rates: Record<string, number> = {
      'BTC': 45000,
      'ETH': 3000,
      'USDT': 1,
      'ADA': 0.5
    };
    return rates[currency.toUpperCase()] || 1;
  }
}
```

### 3. Strategy Factory

```typescript
// factories/PaymentStrategyFactory.ts
import { PaymentStrategy } from '../types/payment.types';
import { CreditCardStrategy } from '../strategies/CreditCardStrategy';
import { PayPalStrategy } from '../strategies/PayPalStrategy';
import { BankTransferStrategy } from '../strategies/BankTransferStrategy';
import { CryptoStrategy } from '../strategies/CryptoStrategy';

export class PaymentStrategyFactory {
  private static strategies = new Map<string, () => PaymentStrategy>();

  static {
    // Initialize default strategies
    this.registerStrategy('credit_card', () => 
      new CreditCardStrategy(process.env.STRIPE_SECRET_KEY!)
    );
    
    this.registerStrategy('paypal', () => 
      new PayPalStrategy(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!,
        process.env.NODE_ENV !== 'production'
      )
    );
    
    this.registerStrategy('bank_transfer', () => new BankTransferStrategy());
    this.registerStrategy('crypto', () => new CryptoStrategy());
  }

  static createStrategy(paymentType: string): PaymentStrategy {
    const strategyFactory = this.strategies.get(paymentType);
    
    if (!strategyFactory) {
      throw new Error(`Unsupported payment method: ${paymentType}`);
    }

    return strategyFactory();
  }

  static registerStrategy(type: string, factory: () => PaymentStrategy): void {
    this.strategies.set(type, factory);
  }

  static getSupportedMethods(): string[] {
    return Array.from(this.strategies.keys());
  }

  static isSupported(paymentType: string): boolean {
    return this.strategies.has(paymentType);
  }
}
```

### 4. Payment Context (Service)

```typescript
// services/PaymentService.ts
import { PaymentStrategy, PaymentRequest, PaymentResponse } from '../types/payment.types';
import { PaymentStrategyFactory } from '../factories/PaymentStrategyFactory';

export class PaymentService {
  private strategy: PaymentStrategy | null = null;

  constructor(private defaultPaymentType?: string) {
    if (defaultPaymentType) {
      this.setPaymentStrategy(defaultPaymentType);
    }
  }

  setPaymentStrategy(paymentType: string): void {
    this.strategy = PaymentStrategyFactory.createStrategy(paymentType);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!this.strategy) {
      this.setPaymentStrategy(request.paymentMethod.type);
    }

    if (!this.strategy) {
      return {
        success: false,
        message: 'No payment strategy available',
        status: 'failed' as any
      };
    }

    try {
      // Log payment attempt
      console.log(`Processing payment: ${request.orderId} via ${request.paymentMethod.type}`);
      
      const startTime = Date.now();
      const result = await this.strategy.processPayment(request);
      const endTime = Date.now();

      // Add actual processing time to result
      result.processingTime = endTime - startTime;

      // Log result
      console.log(`Payment ${result.success ? 'successful' : 'failed'}: ${request.orderId}`);

      return result;
    } catch (error) {
      return {
        success: false,
        message: `Payment processing error: ${error.message}`,
        status: 'failed' as any
      };
    }
  }

  async calculateFees(amount: number, paymentType: string): Promise<number> {
    const strategy = PaymentStrategyFactory.createStrategy(paymentType);
    return strategy.calculateFees(amount);
  }

  async getPaymentInfo(paymentType: string): Promise<{
    fees: number;
    processingTime: number;
    supportsRefund: boolean;
  }> {
    const strategy = PaymentStrategyFactory.createStrategy(paymentType);
    
    return {
      fees: strategy.calculateFees(100), // Sample calculation for $100
      processingTime: strategy.getProcessingTime(),
      supportsRefund: strategy.supportsRefund()
    };
  }

  getSupportedMethods(): string[] {
    return PaymentStrategyFactory.getSupportedMethods();
  }
}
```

### 5. Discount Strategy Pattern

```typescript
// types/discount.types.ts
export interface DiscountStrategy {
  calculateDiscount(order: Order): DiscountResult;
  isApplicable(order: Order): boolean;
  getName(): string;
  getDescription(): string;
}

export interface Order {
  subtotal: number;
  items: OrderItem[];
  customer: CustomerInfo;
  appliedCoupons: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface DiscountResult {
  amount: number;
  percentage?: number;
  description: string;
  applicable: boolean;
}

// Concrete Discount Strategies
export class PercentageDiscountStrategy implements DiscountStrategy {
  constructor(
    private percentage: number,
    private minimumAmount: number = 0,
    private maxDiscount?: number
  ) {}

  calculateDiscount(order: Order): DiscountResult {
    if (!this.isApplicable(order)) {
      return {
        amount: 0,
        description: 'Discount not applicable',
        applicable: false
      };
    }

    let discount = order.subtotal * (this.percentage / 100);
    
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }

    return {
      amount: Math.round(discount * 100) / 100,
      percentage: this.percentage,
      description: `${this.percentage}% discount${this.maxDiscount ? ` (max $${this.maxDiscount})` : ''}`,
      applicable: true
    };
  }

  isApplicable(order: Order): boolean {
    return order.subtotal >= this.minimumAmount;
  }

  getName(): string {
    return 'Percentage Discount';
  }

  getDescription(): string {
    return `${this.percentage}% off orders over $${this.minimumAmount}`;
  }
}

export class BuyXGetYFreeStrategy implements DiscountStrategy {
  constructor(
    private buyQuantity: number,
    private freeQuantity: number,
    private applicableCategories: string[] = []
  ) {}

  calculateDiscount(order: Order): DiscountResult {
    if (!this.isApplicable(order)) {
      return {
        amount: 0,
        description: 'Buy X Get Y promotion not applicable',
        applicable: false
      };
    }

    let totalDiscount = 0;
    const applicableItems = this.applicableCategories.length > 0
      ? order.items.filter(item => this.applicableCategories.includes(item.category))
      : order.items;

    for (const item of applicableItems) {
      const eligibleSets = Math.floor(item.quantity / this.buyQuantity);
      const freeItems = Math.min(eligibleSets * this.freeQuantity, item.quantity);
      totalDiscount += freeItems * item.price;
    }

    return {
      amount: Math.round(totalDiscount * 100) / 100,
      description: `Buy ${this.buyQuantity} get ${this.freeQuantity} free`,
      applicable: true
    };
  }

  isApplicable(order: Order): boolean {
    const applicableItems = this.applicableCategories.length > 0
      ? order.items.filter(item => this.applicableCategories.includes(item.category))
      : order.items;

    return applicableItems.some(item => item.quantity >= this.buyQuantity);
  }

  getName(): string {
    return 'Buy X Get Y Free';
  }

  getDescription(): string {
    return `Buy ${this.buyQuantity} items, get ${this.freeQuantity} free`;
  }
}
```

### 6. Express Controller

```typescript
// controllers/PaymentController.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { PaymentRequest } from '../types/payment.types';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentRequest: PaymentRequest = {
        amount: req.body.amount,
        currency: req.body.currency || 'USD',
        orderId: req.body.orderId,
        customerInfo: req.body.customerInfo,
        paymentMethod: req.body.paymentMethod,
        metadata: req.body.metadata
      };

      // Validate request
      if (!paymentRequest.amount || !paymentRequest.orderId || !paymentRequest.customerInfo) {
        res.status(400).json({
          success: false,
          message: 'Missing required payment information'
        });
        return;
      }

      // Process payment using strategy pattern
      const result = await this.paymentService.processPayment(paymentRequest);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Payment processing failed: ${error.message}`,
        status: 'failed'
      });
    }
  }

  async getPaymentMethods(req: Request, res: Response): Promise<void> {
    try {
      const supportedMethods = this.paymentService.getSupportedMethods();
      
      const methodsWithInfo = await Promise.all(
        supportedMethods.map(async (method) => {
          const info = await this.paymentService.getPaymentInfo(method);
          return {
            type: method,
            ...info
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          supportedMethods: methodsWithInfo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async calculateFees(req: Request, res: Response): Promise<void> {
    try {
      const { amount, paymentMethod } = req.body;

      if (!amount || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Amount and payment method are required'
        });
        return;
      }

      const fees = await this.paymentService.calculateFees(amount, paymentMethod);

      res.status(200).json({
        success: true,
        data: {
          amount,
          paymentMethod,
          fees,
          total: amount + fees
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
```

### 7. Express Routes

```typescript
// routes/paymentRoutes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = Router();
const paymentController = new PaymentController();

// Payment routes
router.post('/process', paymentController.processPayment.bind(paymentController));
router.get('/methods', paymentController.getPaymentMethods.bind(paymentController));
router.post('/calculate-fees', paymentController.calculateFees.bind(paymentController));

export default router;
```

### 8. Usage Examples

```typescript
// Example usage in Express app
import express from 'express';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
app.use(express.json());
app.use('/api/payments', paymentRoutes);

// Example client requests:

// 1. Process Credit Card Payment
const creditCardPayment = {
  amount: 99.99,
  currency: 'USD',
  orderId: 'ORDER-123',
  customerInfo: {
    id: 'CUST-456',
    email: 'customer@example.com',
    name: 'John Doe'
  },
  paymentMethod: {
    id: 'card_123',
    name: 'Visa ending in 4242',
    type: 'credit_card'
  }
};

// 2. Process PayPal Payment
const paypalPayment = {
  amount: 149.99,
  currency: 'USD',
  orderId: 'ORDER-124',
  customerInfo: {
    id: 'CUST-457',
    email: 'customer2@example.com',
    name: 'Jane Smith'
  },
  paymentMethod: {
    id: 'paypal_123',
    name: 'PayPal Account',
    type: 'paypal'
  }
};

// 3. Switch strategies at runtime
const paymentService = new PaymentService();

// Process with credit card
paymentService.setPaymentStrategy('credit_card');
const result1 = await paymentService.processPayment(creditCardPayment);

// Switch to PayPal for next payment
paymentService.setPaymentStrategy('paypal');
const result2 = await paymentService.processPayment(paypalPayment);
```

## Testing

```typescript
// tests/PaymentService.test.ts
import { PaymentService } from '../src/services/PaymentService';
import { PaymentRequest } from '../src/types/payment.types';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  test('should process credit card payment successfully', async () => {
    const request: PaymentRequest = {
      amount: 100,
      currency: 'USD',
      orderId: 'TEST-123',
      customerInfo: {
        id: 'CUST-123',
        email: 'test@example.com',
        name: 'Test User'
      },
      paymentMethod: {
        id: 'card_123',
        name: 'Test Card',
        type: 'credit_card'
      }
    };

    const result = await paymentService.processPayment(request);
    
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.status).toBe('completed');
  });

  test('should calculate fees correctly for different payment methods', async () => {
    const creditCardFees = await paymentService.calculateFees(100, 'credit_card');
    const paypalFees = await paymentService.calculateFees(100, 'paypal');
    
    expect(creditCardFees).toBeGreaterThan(0);
    expect(paypalFees).toBeGreaterThan(creditCardFees);
  });

  test('should switch strategies at runtime', async () => {
    paymentService.setPaymentStrategy('credit_card');
    expect(paymentService.getSupportedMethods()).toContain('credit_card');

    paymentService.setPaymentStrategy('paypal');
    expect(paymentService.getSupportedMethods()).toContain('paypal');
  });
});
```

## Kết luận

Strategy Pattern trong ví dụ này:

1. **Encapsulation**: Mỗi payment method được đóng gói trong một strategy riêng
2. **Flexibility**: Có thể thay đổi payment method trong runtime
3. **Extensibility**: Dễ dàng thêm payment method mới
4. **Single Responsibility**: Mỗi strategy chỉ xử lý một loại payment
5. **Testability**: Có thể test từng strategy độc lập

Strategy Pattern đặc biệt hữu ích trong:
- Payment processing systems
- Pricing calculations
- Sorting algorithms
- Validation rules
- Business logic có nhiều variations