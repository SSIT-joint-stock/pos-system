# Adapter Pattern Implementation

## Tổng quan

Adapter Pattern là một design pattern thuộc nhóm Structural Patterns, cho phép các interface không tương thích có thể làm việc cùng nhau. Pattern này hoạt động như một cầu nối giữa hai interface khác nhau mà không cần thay đổi code của chúng.

## Đặc điểm

- **Interface Conversion**: Chuyển đổi interface của class này thành interface khác
- **Legacy Integration**: Tích hợp với hệ thống cũ mà không cần thay đổi
- **Third-party Integration**: Kết nối với các service bên ngoài
- **Code Reusability**: Tái sử dụng code existing mà không cần modify

## Lợi ích

- **Backward Compatibility**: Duy trì tương thích với code cũ
- **Separation of Concerns**: Tách biệt business logic và integration logic
- **Single Responsibility**: Mỗi adapter chỉ xử lý một loại conversion
- **Open/Closed Principle**: Mở để mở rộng, đóng để sửa đổi

## Cấu trúc cơ bản

```typescript
// Target Interface - Interface mà client mong muốn
interface Target {
  request(): string;
}

// Adaptee - Class có interface khác với Target
class Adaptee {
  specificRequest(): string {
    return "Special request from Adaptee";
  }
}

// Adapter - Chuyển đổi interface của Adaptee thành Target
class Adapter implements Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    this.adaptee = adaptee;
  }

  request(): string {
    // Chuyển đổi call từ Target interface sang Adaptee interface
    return `Adapter: ${this.adaptee.specificRequest()}`;
  }
}

// Client Code
function clientCode(target: Target) {
  console.log(target.request());
}

// Usage
const adaptee = new Adaptee();
const adapter = new Adapter(adaptee);
clientCode(adapter);
```

## Ví dụ thực tế 1: Payment Gateway Adapter

### 1. Định nghĩa interfaces chung

```typescript
// types/payment.types.ts
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    email: string;
    name: string;
  };
  paymentMethod: {
    type: string;
    token: string;
  };
}

// Target Interface - Interface thống nhất cho tất cả payment gateways
export interface PaymentGateway {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>;
  getTransactionStatus(transactionId: string): Promise<string>;
}
```

### 2. Third-party Payment Services (Adaptees)

```typescript
// third-party/StripeService.ts
// Giả sử đây là Stripe SDK với interface riêng
export class StripeService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCharge(params: {
    amount_cents: number;
    currency_code: string;
    source_token: string;
    description: string;
    customer_email: string;
  }): Promise<{
    id: string;
    status: 'succeeded' | 'failed' | 'pending';
    amount_cents: number;
    currency_code: string;
    failure_message?: string;
  }> {
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `ch_${Math.random().toString(36).substr(2, 9)}`,
      status: Math.random() > 0.1 ? 'succeeded' : 'failed',
      amount_cents: params.amount_cents,
      currency_code: params.currency_code,
      failure_message: Math.random() > 0.1 ? undefined : 'Card declined'
    };
  }

  async createRefund(chargeId: string, amountCents?: number): Promise<{
    id: string;
    status: 'succeeded' | 'failed';
    amount_cents: number;
    charge_id: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: `re_${Math.random().toString(36).substr(2, 9)}`,
      status: 'succeeded',
      amount_cents: amountCents || 0,
      charge_id: chargeId
    };
  }

  async retrieveCharge(chargeId: string): Promise<{
    id: string;
    status: 'succeeded' | 'failed' | 'pending';
    amount_cents: number;
    currency_code: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: chargeId,
      status: 'succeeded',
      amount_cents: 5000,
      currency_code: 'usd'
    };
  }
}
```

```typescript
// third-party/PayPalService.ts
// Giả sử đây là PayPal SDK với interface khác
export class PayPalService {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async executePayment(paymentData: {
    intent: 'sale';
    payer: {
      payment_method: 'paypal';
      payer_info: {
        email: string;
        first_name: string;
        last_name: string;
      };
    };
    transactions: Array<{
      amount: {
        total: string;
        currency: string;
      };
      description: string;
      item_list?: {
        items: Array<{
          name: string;
          sku: string;
          price: string;
          currency: string;
          quantity: number;
        }>;
      };
    }>;
  }): Promise<{
    id: string;
    state: 'approved' | 'failed' | 'pending';
    transactions: Array<{
      amount: {
        total: string;
        currency: string;
      };
      related_resources: Array<{
        sale?: {
          id: string;
          state: 'completed' | 'failed';
          amount: {
            total: string;
            currency: string;
          };
        };
      }>;
    }>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const saleId = `SALE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    return {
      id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      state: Math.random() > 0.15 ? 'approved' : 'failed',
      transactions: paymentData.transactions.map(tx => ({
        amount: tx.amount,
        related_resources: [{
          sale: {
            id: saleId,
            state: Math.random() > 0.15 ? 'completed' : 'failed',
            amount: tx.amount
          }
        }]
      }))
    };
  }

  async refundSale(saleId: string, refundData: {
    amount: {
      total: string;
      currency: string;
    };
  }): Promise<{
    id: string;
    state: 'completed' | 'failed';
    amount: {
      total: string;
      currency: string;
    };
    sale_id: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      id: `REFUND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      state: 'completed',
      amount: refundData.amount,
      sale_id: saleId
    };
  }

  async lookupPayment(paymentId: string): Promise<{
    id: string;
    state: 'approved' | 'failed' | 'pending';
    transactions: Array<{
      amount: {
        total: string;
        currency: string;
      };
      related_resources: Array<{
        sale?: {
          id: string;
          state: 'completed' | 'failed';
        };
      }>;
    }>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: paymentId,
      state: 'approved',
      transactions: [{
        amount: {
          total: '50.00',
          currency: 'USD'
        },
        related_resources: [{
          sale: {
            id: `SALE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            state: 'completed'
          }
        }]
      }]
    };
  }
}
```

### 3. Payment Gateway Adapters

```typescript
// adapters/StripeAdapter.ts
import { PaymentGateway, PaymentRequest, PaymentResult } from '../types/payment.types';
import { StripeService } from '../third-party/StripeService';

export class StripeAdapter implements PaymentGateway {
  private stripeService: StripeService;

  constructor(apiKey: string) {
    this.stripeService = new StripeService(apiKey);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Chuyển đổi từ PaymentRequest sang Stripe format
      const stripeParams = {
        amount_cents: Math.round(request.amount * 100), // Convert to cents
        currency_code: request.currency.toLowerCase(),
        source_token: request.paymentMethod.token,
        description: `Payment for order ${request.orderId}`,
        customer_email: request.customer.email
      };

      // Gọi Stripe service
      const stripeResult = await this.stripeService.createCharge(stripeParams);

      // Chuyển đổi từ Stripe response sang PaymentResult
      return {
        success: stripeResult.status === 'succeeded',
        transactionId: stripeResult.id,
        amount: stripeResult.amount_cents / 100, // Convert back to dollars
        currency: stripeResult.currency_code.toUpperCase(),
        message: stripeResult.status === 'succeeded' 
          ? 'Payment processed successfully via Stripe'
          : stripeResult.failure_message || 'Payment failed',
        metadata: {
          provider: 'stripe',
          stripeChargeId: stripeResult.id,
          orderId: request.orderId
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        amount: request.amount,
        currency: request.currency,
        message: `Stripe payment failed: ${(error as Error).message}`,
        metadata: {
          provider: 'stripe',
          error: (error as Error).message
        }
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    try {
      const refundAmount = amount ? Math.round(amount * 100) : undefined;
      const stripeRefund = await this.stripeService.createRefund(transactionId, refundAmount);

      return {
        success: stripeRefund.status === 'succeeded',
        transactionId: stripeRefund.id,
        amount: stripeRefund.amount_cents / 100,
        currency: 'USD', // Stripe doesn't return currency in refund
        message: stripeRefund.status === 'succeeded' 
          ? 'Refund processed successfully via Stripe'
          : 'Refund failed',
        metadata: {
          provider: 'stripe',
          originalChargeId: stripeRefund.charge_id,
          refundId: stripeRefund.id
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        amount: amount || 0,
        currency: 'USD',
        message: `Stripe refund failed: ${(error as Error).message}`,
        metadata: {
          provider: 'stripe',
          error: (error as Error).message
        }
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<string> {
    try {
      const charge = await this.stripeService.retrieveCharge(transactionId);
      return charge.status;
    } catch (error) {
      return 'unknown';
    }
  }
}
```

```typescript
// adapters/PayPalAdapter.ts
import { PaymentGateway, PaymentRequest, PaymentResult } from '../types/payment.types';
import { PayPalService } from '../third-party/PayPalService';

export class PayPalAdapter implements PaymentGateway {
  private paypalService: PayPalService;

  constructor(clientId: string, clientSecret: string) {
    this.paypalService = new PayPalService(clientId, clientSecret);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Chuyển đổi từ PaymentRequest sang PayPal format
      const [firstName, ...lastNameParts] = request.customer.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      const paypalPayment = {
        intent: 'sale' as const,
        payer: {
          payment_method: 'paypal' as const,
          payer_info: {
            email: request.customer.email,
            first_name: firstName,
            last_name: lastName
          }
        },
        transactions: [{
          amount: {
            total: request.amount.toFixed(2),
            currency: request.currency
          },
          description: `Payment for order ${request.orderId}`
        }]
      };

      // Gọi PayPal service
      const paypalResult = await this.paypalService.executePayment(paypalPayment);

      // Chuyển đổi từ PayPal response sang PaymentResult
      const transaction = paypalResult.transactions[0];
      const sale = transaction.related_resources[0].sale;

      return {
        success: paypalResult.state === 'approved' && sale?.state === 'completed',
        transactionId: paypalResult.id,
        amount: parseFloat(transaction.amount.total),
        currency: transaction.amount.currency,
        message: paypalResult.state === 'approved' 
          ? 'Payment processed successfully via PayPal'
          : 'Payment failed or pending',
        metadata: {
          provider: 'paypal',
          paypalPaymentId: paypalResult.id,
          saleId: sale?.id,
          orderId: request.orderId
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        amount: request.amount,
        currency: request.currency,
        message: `PayPal payment failed: ${(error as Error).message}`,
        metadata: {
          provider: 'paypal',
          error: (error as Error).message
        }
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    try {
      // First, get the payment to find the sale ID
      const payment = await this.paypalService.lookupPayment(transactionId);
      const sale = payment.transactions[0].related_resources[0].sale;
      
      if (!sale) {
        throw new Error('No sale found for this payment');
      }

      const refundAmount = amount || parseFloat(payment.transactions[0].amount.total);
      
      const refundData = {
        amount: {
          total: refundAmount.toFixed(2),
          currency: payment.transactions[0].amount.currency
        }
      };

      const refundResult = await this.paypalService.refundSale(sale.id, refundData);

      return {
        success: refundResult.state === 'completed',
        transactionId: refundResult.id,
        amount: parseFloat(refundResult.amount.total),
        currency: refundResult.amount.currency,
        message: refundResult.state === 'completed' 
          ? 'Refund processed successfully via PayPal'
          : 'Refund failed',
        metadata: {
          provider: 'paypal',
          originalPaymentId: transactionId,
          originalSaleId: refundResult.sale_id,
          refundId: refundResult.id
        }
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        amount: amount || 0,
        currency: 'USD',
        message: `PayPal refund failed: ${(error as Error).message}`,
        metadata: {
          provider: 'paypal',
          error: (error as Error).message
        }
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<string> {
    try {
      const payment = await this.paypalService.lookupPayment(transactionId);
      
      if (payment.state === 'approved') {
        const sale = payment.transactions[0].related_resources[0].sale;
        return sale?.state === 'completed' ? 'succeeded' : 'pending';
      }
      
      return payment.state === 'failed' ? 'failed' : 'pending';
    } catch (error) {
      return 'unknown';
    }
  }
}
```

## Ví dụ thực tế 2: Email Service Adapter

### 1. Email Service Interfaces

```typescript
// types/email.types.ts
export interface EmailMessage {
  to: string[];
  from: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
  disposition?: 'attachment' | 'inline';
}

export interface EmailResult {
  success: boolean;
  messageId: string;
  message: string;
  provider: string;
  metadata?: Record<string, any>;
}

// Target Interface
export interface EmailService {
  sendEmail(message: EmailMessage): Promise<EmailResult>;
  sendBulkEmail(messages: EmailMessage[]): Promise<EmailResult[]>;
  getDeliveryStatus(messageId: string): Promise<string>;
}
```

### 2. Third-party Email Services

```typescript
// third-party/SendGridService.ts
export class SendGridService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(msg: {
    to: Array<{ email: string; name?: string }>;
    from: { email: string; name?: string };
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
      content: string;
      filename: string;
      type: string;
      disposition: string;
    }>;
    reply_to?: { email: string };
    cc?: Array<{ email: string }>;
    bcc?: Array<{ email: string }>;
  }): Promise<{
    message_id: string;
    status_code: number;
    headers: Record<string, string>;
  }> {
    // Simulate SendGrid API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      message_id: `sg_${Math.random().toString(36).substr(2, 9)}`,
      status_code: Math.random() > 0.05 ? 202 : 400,
      headers: {
        'x-message-id': `sg_${Math.random().toString(36).substr(2, 9)}`
      }
    };
  }

  async sendMultiple(msgs: Array<{
    to: Array<{ email: string; name?: string }>;
    from: { email: string; name?: string };
    subject: string;
    html: string;
  }>): Promise<{
    message_ids: string[];
    status_code: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      message_ids: msgs.map(() => `sg_${Math.random().toString(36).substr(2, 9)}`),
      status_code: 202
    };
  }
}
```

```typescript
// third-party/MailgunService.ts
export class MailgunService {
  private domain: string;
  private apiKey: string;

  constructor(domain: string, apiKey: string) {
    this.domain = domain;
    this.apiKey = apiKey;
  }

  async sendMessage(data: {
    from: string;
    to: string;
    subject: string;
    html: string;
    text?: string;
    attachment?: Array<{
      filename: string;
      data: Buffer | string;
      contentType: string;
    }>;
    'h:Reply-To'?: string;
    cc?: string;
    bcc?: string;
  }): Promise<{
    id: string;
    message: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: `mg_${Math.random().toString(36).substr(2, 12)}`,
      message: 'Queued. Thank you.'
    };
  }

  async getDeliveryInfo(messageId: string): Promise<{
    id: string;
    status: 'delivered' | 'failed' | 'queued' | 'sending';
    event: string;
    timestamp: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const statuses = ['delivered', 'failed', 'queued', 'sending'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: messageId,
      status: randomStatus,
      event: randomStatus,
      timestamp: Date.now()
    };
  }
}
```

### 3. Email Service Adapters

```typescript
// adapters/SendGridAdapter.ts
import { EmailService, EmailMessage, EmailResult, EmailAttachment } from '../types/email.types';
import { SendGridService } from '../third-party/SendGridService';

export class SendGridAdapter implements EmailService {
  private sendGridService: SendGridService;

  constructor(apiKey: string) {
    this.sendGridService = new SendGridService(apiKey);
  }

  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    try {
      // Chuyển đổi từ EmailMessage sang SendGrid format
      const sendGridMessage = {
        to: message.to.map(email => ({ email })),
        from: { email: message.from },
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent,
        attachments: message.attachments?.map(this.convertAttachment),
        reply_to: message.replyTo ? { email: message.replyTo } : undefined,
        cc: message.cc?.map(email => ({ email })),
        bcc: message.bcc?.map(email => ({ email }))
      };

      const result = await this.sendGridService.send(sendGridMessage);

      return {
        success: result.status_code === 202,
        messageId: result.message_id,
        message: result.status_code === 202 ? 'Email sent successfully via SendGrid' : 'Failed to send email',
        provider: 'sendgrid',
        metadata: {
          statusCode: result.status_code,
          headers: result.headers
        }
      };
    } catch (error) {
      return {
        success: false,
        messageId: '',
        message: `SendGrid error: ${(error as Error).message}`,
        provider: 'sendgrid',
        metadata: {
          error: (error as Error).message
        }
      };
    }
  }

  async sendBulkEmail(messages: EmailMessage[]): Promise<EmailResult[]> {
    try {
      // Convert messages for bulk sending
      const sendGridMessages = messages.map(msg => ({
        to: msg.to.map(email => ({ email })),
        from: { email: msg.from },
        subject: msg.subject,
        html: msg.htmlContent
      }));

      const result = await this.sendGridService.sendMultiple(sendGridMessages);

      return result.message_ids.map((messageId, index) => ({
        success: result.status_code === 202,
        messageId,
        message: result.status_code === 202 ? 'Email sent successfully via SendGrid' : 'Failed to send email',
        provider: 'sendgrid',
        metadata: {
          statusCode: result.status_code,
          bulkIndex: index
        }
      }));
    } catch (error) {
      return messages.map(() => ({
        success: false,
        messageId: '',
        message: `SendGrid bulk send error: ${(error as Error).message}`,
        provider: 'sendgrid',
        metadata: {
          error: (error as Error).message
        }
      }));
    }
  }

  async getDeliveryStatus(messageId: string): Promise<string> {
    // SendGrid requires webhook for delivery status
    // This is a simplified implementation
    return 'delivered';
  }

  private convertAttachment(attachment: EmailAttachment) {
    return {
      content: typeof attachment.content === 'string' 
        ? attachment.content 
        : attachment.content.toString('base64'),
      filename: attachment.filename,
      type: attachment.contentType,
      disposition: attachment.disposition || 'attachment'
    };
  }
}
```

```typescript
// adapters/MailgunAdapter.ts
import { EmailService, EmailMessage, EmailResult } from '../types/email.types';
import { MailgunService } from '../third-party/MailgunService';

export class MailgunAdapter implements EmailService {
  private mailgunService: MailgunService;

  constructor(domain: string, apiKey: string) {
    this.mailgunService = new MailgunService(domain, apiKey);
  }

  async sendEmail(message: EmailMessage): Promise<EmailResult> {
    try {
      // Chuyển đổi từ EmailMessage sang Mailgun format
      const mailgunData = {
        from: message.from,
        to: message.to.join(', '),
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent,
        attachment: message.attachments?.map(att => ({
          filename: att.filename,
          data: typeof att.content === 'string' ? Buffer.from(att.content) : att.content,
          contentType: att.contentType
        })),
        'h:Reply-To': message.replyTo,
        cc: message.cc?.join(', '),
        bcc: message.bcc?.join(', ')
      };

      const result = await this.mailgunService.sendMessage(mailgunData);

      return {
        success: true,
        messageId: result.id,
        message: 'Email sent successfully via Mailgun',
        provider: 'mailgun',
        metadata: {
          mailgunMessage: result.message
        }
      };
    } catch (error) {
      return {
        success: false,
        messageId: '',
        message: `Mailgun error: ${(error as Error).message}`,
        provider: 'mailgun',
        metadata: {
          error: (error as Error).message
        }
      };
    }
  }

  async sendBulkEmail(messages: EmailMessage[]): Promise<EmailResult[]> {
    // Mailgun doesn't have bulk API, send individually
    const results = await Promise.all(
      messages.map(message => this.sendEmail(message))
    );
    
    return results;
  }

  async getDeliveryStatus(messageId: string): Promise<string> {
    try {
      const status = await this.mailgunService.getDeliveryInfo(messageId);
      
      // Map Mailgun status to common status
      switch (status.status) {
        case 'delivered':
          return 'delivered';
        case 'failed':
          return 'failed';
        case 'queued':
        case 'sending':
          return 'pending';
        default:
          return 'unknown';
      }
    } catch (error) {
      return 'unknown';
    }
  }
}
```

## Ví dụ thực tế 3: SMS Service Adapter

```typescript
// types/sms.types.ts
export interface SMSMessage {
  to: string;
  from: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface SMSResult {
  success: boolean;
  messageId: string;
  message: string;
  provider: string;
  cost?: number;
  metadata?: Record<string, any>;
}

export interface SMSService {
  sendSMS(message: SMSMessage): Promise<SMSResult>;
  sendBulkSMS(messages: SMSMessage[]): Promise<SMSResult[]>;
  getMessageStatus(messageId: string): Promise<string>;
}

// Third-party services
class TwilioService {
  async create(params: {
    to: string;
    from: string;
    body: string;
  }): Promise<{
    sid: string;
    status: 'queued' | 'sent' | 'failed' | 'delivered';
    price: string;
    price_unit: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      sid: `SM${Math.random().toString(36).substr(2, 32)}`,
      status: Math.random() > 0.1 ? 'queued' : 'failed',
      price: '-0.0075',
      price_unit: 'USD'
    };
  }
}

// Adapter
export class TwilioSMSAdapter implements SMSService {
  private twilioService: TwilioService;

  constructor() {
    this.twilioService = new TwilioService();
  }

  async sendSMS(message: SMSMessage): Promise<SMSResult> {
    try {
      const result = await this.twilioService.create({
        to: message.to,
        from: message.from,
        body: message.message
      });

      return {
        success: result.status !== 'failed',
        messageId: result.sid,
        message: result.status !== 'failed' ? 'SMS sent successfully via Twilio' : 'SMS failed to send',
        provider: 'twilio',
        cost: Math.abs(parseFloat(result.price)),
        metadata: {
          twilioStatus: result.status,
          priceUnit: result.price_unit
        }
      };
    } catch (error) {
      return {
        success: false,
        messageId: '',
        message: `Twilio SMS error: ${(error as Error).message}`,
        provider: 'twilio',
        metadata: {
          error: (error as Error).message
        }
      };
    }
  }

  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResult[]> {
    return Promise.all(messages.map(msg => this.sendSMS(msg)));
  }

  async getMessageStatus(messageId: string): Promise<string> {
    // Simulate status check
    const statuses = ['delivered', 'sent', 'failed', 'pending'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}
```

## Service Factory với Adapter Pattern

```typescript
// factories/CommunicationServiceFactory.ts
import { PaymentGateway } from '../types/payment.types';
import { EmailService } from '../types/email.types';
import { SMSService } from '../types/sms.types';
import { StripeAdapter } from '../adapters/StripeAdapter';
import { PayPalAdapter } from '../adapters/PayPalAdapter';
import { SendGridAdapter } from '../adapters/SendGridAdapter';
import { MailgunAdapter } from '../adapters/MailgunAdapter';
import { TwilioSMSAdapter } from '../adapters/TwilioSMSAdapter';

export class CommunicationServiceFactory {
  // Payment Gateway Factory
  static createPaymentGateway(provider: string, config: any): PaymentGateway {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return new StripeAdapter(config.apiKey);
      case 'paypal':
        return new PayPalAdapter(config.clientId, config.clientSecret);
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  // Email Service Factory
  static createEmailService(provider: string, config: any): EmailService {
    switch (provider.toLowerCase()) {
      case 'sendgrid':
        return new SendGridAdapter(config.apiKey);
      case 'mailgun':
        return new MailgunAdapter(config.domain, config.apiKey);
      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  }

  // SMS Service Factory
  static createSMSService(provider: string, config: any): SMSService {
    switch (provider.toLowerCase()) {
      case 'twilio':
        return new TwilioSMSAdapter();
      default:
        throw new Error(`Unsupported SMS provider: ${provider}`);
    }
  }
}
```

## Express Controller sử dụng Adapters

```typescript
// controllers/CommunicationController.ts
import { Request, Response } from 'express';
import { CommunicationServiceFactory } from '../factories/CommunicationServiceFactory';

export class CommunicationController {
  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { provider, config, paymentData } = req.body;

      // Tạo payment gateway adapter dựa vào provider
      const paymentGateway = CommunicationServiceFactory.createPaymentGateway(provider, config);
      
      // Xử lý payment với interface thống nhất
      const result = await paymentGateway.processPayment(paymentData);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Payment processing failed: ${(error as Error).message}`
      });
    }
  }

  async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const { provider, config, emailData } = req.body;

      // Tạo email service adapter
      const emailService = CommunicationServiceFactory.createEmailService(provider, config);
      
      // Gửi email với interface thống nhất
      const result = await emailService.sendEmail(emailData);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Email sending failed: ${(error as Error).message}`
      });
    }
  }

  async sendSMS(req: Request, res: Response): Promise<void> {
    try {
      const { provider, config, smsData } = req.body;

      // Tạo SMS service adapter
      const smsService = CommunicationServiceFactory.createSMSService(provider, config);
      
      // Gửi SMS với interface thống nhất
      const result = await smsService.sendSMS(smsData);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `SMS sending failed: ${(error as Error).message}`
      });
    }
  }

  async switchProvider(req: Request, res: Response): Promise<void> {
    try {
      const { serviceType, fromProvider, toProvider, config, testData } = req.body;

      let result: any;

      switch (serviceType) {
        case 'payment':
          const paymentGateway = CommunicationServiceFactory.createPaymentGateway(toProvider, config);
          result = await paymentGateway.processPayment(testData);
          break;
        case 'email':
          const emailService = CommunicationServiceFactory.createEmailService(toProvider, config);
          result = await emailService.sendEmail(testData);
          break;
        case 'sms':
          const smsService = CommunicationServiceFactory.createSMSService(toProvider, config);
          result = await smsService.sendSMS(testData);
          break;
        default:
          throw new Error('Invalid service type');
      }

      res.status(200).json({
        success: true,
        message: `Successfully switched from ${fromProvider} to ${toProvider}`,
        testResult: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Provider switch failed: ${(error as Error).message}`
      });
    }
  }
}
```

## Testing Adapters

```typescript
// tests/PaymentAdapter.test.ts
import { StripeAdapter } from '../src/adapters/StripeAdapter';
import { PayPalAdapter } from '../src/adapters/PayPalAdapter';
import { PaymentRequest } from '../src/types/payment.types';

describe('Payment Adapters', () => {
  const testPaymentRequest: PaymentRequest = {
    amount: 100,
    currency: 'USD',
    orderId: 'TEST-123',
    customer: {
      email: 'test@example.com',
      name: 'Test User'
    },
    paymentMethod: {
      type: 'card',
      token: 'tok_test_123'
    }
  };

  describe('StripeAdapter', () => {
    test('should process payment successfully', async () => {
      const adapter = new StripeAdapter('test_key');
      const result = await adapter.processPayment(testPaymentRequest);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('transactionId');
      expect(result.amount).toBe(100);
      expect(result.currency).toBe('USD');
      expect(result.metadata?.provider).toBe('stripe');
    });
  });

  describe('PayPalAdapter', () => {
    test('should process payment successfully', async () => {
      const adapter = new PayPalAdapter('client_id', 'client_secret');
      const result = await adapter.processPayment(testPaymentRequest);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('transactionId');
      expect(result.amount).toBe(100);
      expect(result.currency).toBe('USD');
      expect(result.metadata?.provider).toBe('paypal');
    });
  });

  test('should have consistent interface across adapters', async () => {
    const stripeAdapter = new StripeAdapter('test_key');
    const paypalAdapter = new PayPalAdapter('client_id', 'client_secret');
    
    const [stripeResult, paypalResult] = await Promise.all([
      stripeAdapter.processPayment(testPaymentRequest),
      paypalAdapter.processPayment(testPaymentRequest)
    ]);

    // Both should have the same interface
    expect(stripeResult).toHaveProperty('success');
    expect(stripeResult).toHaveProperty('transactionId');
    expect(stripeResult).toHaveProperty('amount');
    expect(stripeResult).toHaveProperty('currency');
    expect(stripeResult).toHaveProperty('message');

    expect(paypalResult).toHaveProperty('success');
    expect(paypalResult).toHaveProperty('transactionId');
    expect(paypalResult).toHaveProperty('amount');
    expect(paypalResult).toHaveProperty('currency');
    expect(paypalResult).toHaveProperty('message');
  });
});
```

## Kết luận

Adapter Pattern trong các ví dụ này:

1. **Interface Unification**: Tạo interface thống nhất cho các service khác nhau
2. **Third-party Integration**: Dễ dàng tích hợp với external services
3. **Provider Switching**: Chuyển đổi provider mà không thay đổi business logic
4. **Legacy Support**: Hỗ trợ legacy systems và APIs
5. **Testability**: Dễ dàng mock và test từng adapter

**Lợi ích chính:**
- **Flexibility**: Linh hoạt thay đổi implementation
- **Maintainability**: Code dễ maintain và extend
- **Consistency**: Interface thống nhất cho client code
- **Separation**: Tách biệt integration logic và business logic

Adapter Pattern đặc biệt hữu ích khi:
- Tích hợp với multiple third-party services
- Migrate từ service này sang service khác
- Cần maintain backward compatibility
- Làm việc với legacy systems