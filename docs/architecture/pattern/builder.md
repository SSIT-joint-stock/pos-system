# Builder Pattern Implementation

## Tổng quan

Builder Pattern là một design pattern thuộc nhóm Creational Patterns, cho phép xây dựng các đối tượng phức tạp từng bước một. Pattern này tách biệt quá trình xây dựng đối tượng khỏi representation của nó, cho phép cùng một quá trình xây dựng có thể tạo ra các representation khác nhau.

## Đặc điểm

- **Step-by-step Construction**: Xây dựng object từng bước
- **Fluent Interface**: Chainable method calls
- **Flexible Configuration**: Nhiều cách khác nhau để cấu hình object
- **Immutable Result**: Object cuối cùng thường là immutable

## Lợi ích

- **Complex Object Creation**: Xử lý việc tạo object phức tạp
- **Readable Code**: Code dễ đọc và hiểu
- **Parameter Validation**: Validate từng bước
- **Optional Parameters**: Xử lý nhiều optional parameters
- **Method Chaining**: Syntax gọn và liền mạch

## Cấu trúc cơ bản

```typescript
// Product - Object cần được xây dựng
class Product {
  private parts: string[] = [];

  addPart(part: string): void {
    this.parts.push(part);
  }

  listParts(): void {
    console.log(`Product parts: ${this.parts.join(', ')}`);
  }
}

// Builder Interface
interface Builder {
  producePartA(): this;
  producePartB(): this;
  producePartC(): this;
  getResult(): Product;
}

// Concrete Builder
class ConcreteBuilder implements Builder {
  private product: Product;

  constructor() {
    this.reset();
  }

  reset(): this {
    this.product = new Product();
    return this;
  }

  producePartA(): this {
    this.product.addPart('PartA');
    return this;
  }

  producePartB(): this {
    this.product.addPart('PartB');
    return this;
  }

  producePartC(): this {
    this.product.addPart('PartC');
    return this;
  }

  getResult(): Product {
    const result = this.product;
    this.reset();
    return result;
  }
}

// Director - Điều khiển quá trình xây dựng
class Director {
  private builder: Builder;

  setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }

  buildFullFeaturedProduct(): void {
    this.builder.producePartA().producePartB().producePartC();
  }
}

// Usage
const director = new Director();
const builder = new ConcreteBuilder();
director.setBuilder(builder);

director.buildFullFeaturedProduct();
const product = builder.getResult();
```

## Ví dụ thực tế 1: SQL Query Builder

### 1. Query Types và Interfaces

```typescript
// types/query.types.ts
export interface QueryCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'between';
  value: any;
  logic?: 'AND' | 'OR';
}

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  on: string;
  alias?: string;
}

export interface OrderClause {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface GroupClause {
  field: string;
}

export interface QueryResult {
  sql: string;
  params: any[];
  type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
}
```

### 2. Query Builder Implementation

```typescript
// builders/QueryBuilder.ts
import { QueryCondition, JoinClause, OrderClause, GroupClause, QueryResult } from '../types/query.types';

export class QueryBuilder {
  private selectFields: string[] = [];
  private fromTable: string = '';
  private tableAlias: string = '';
  private joins: JoinClause[] = [];
  private conditions: QueryCondition[] = [];
  private groupBy: GroupClause[] = [];
  private having: QueryCondition[] = [];
  private orderBy: OrderClause[] = [];
  private limitCount?: number;
  private offsetCount?: number;
  private queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' = 'SELECT';
  private insertData: Record<string, any> = {};
  private updateData: Record<string, any> = {};
  private paramCounter = 0;

  // SELECT methods
  select(fields: string | string[]): this {
    this.queryType = 'SELECT';
    if (typeof fields === 'string') {
      this.selectFields = fields === '*' ? ['*'] : [fields];
    } else {
      this.selectFields = fields;
    }
    return this;
  }

  addSelect(field: string): this {
    this.selectFields.push(field);
    return this;
  }

  from(table: string, alias?: string): this {
    this.fromTable = table;
    if (alias) {
      this.tableAlias = alias;
    }
    return this;
  }

  // JOIN methods
  join(table: string, on: string, alias?: string): this {
    this.joins.push({ type: 'INNER', table, on, alias });
    return this;
  }

  leftJoin(table: string, on: string, alias?: string): this {
    this.joins.push({ type: 'LEFT', table, on, alias });
    return this;
  }

  rightJoin(table: string, on: string, alias?: string): this {
    this.joins.push({ type: 'RIGHT', table, on, alias });
    return this;
  }

  innerJoin(table: string, on: string, alias?: string): this {
    this.joins.push({ type: 'INNER', table, on, alias });
    return this;
  }

  // WHERE conditions
  where(field: string, operator: QueryCondition['operator'], value: any): this {
    this.conditions.push({ field, operator, value, logic: 'AND' });
    return this;
  }

  orWhere(field: string, operator: QueryCondition['operator'], value: any): this {
    this.conditions.push({ field, operator, value, logic: 'OR' });
    return this;
  }

  whereIn(field: string, values: any[]): this {
    return this.where(field, 'in', values);
  }

  whereNotIn(field: string, values: any[]): this {
    return this.where(field, 'nin', values);
  }

  whereLike(field: string, pattern: string): this {
    return this.where(field, 'like', pattern);
  }

  whereBetween(field: string, start: any, end: any): this {
    return this.where(field, 'between', [start, end]);
  }

  whereNull(field: string): this {
    return this.where(field, 'eq', null);
  }

  whereNotNull(field: string): this {
    return this.where(field, 'ne', null);
  }

  // GROUP BY and HAVING
  groupBy(field: string): this {
    this.groupBy.push({ field });
    return this;
  }

  having(field: string, operator: QueryCondition['operator'], value: any): this {
    this.having.push({ field, operator, value, logic: 'AND' });
    return this;
  }

  orHaving(field: string, operator: QueryCondition['operator'], value: any): this {
    this.having.push({ field, operator, value, logic: 'OR' });
    return this;
  }

  // ORDER BY
  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderBy.push({ field, direction });
    return this;
  }

  orderByDesc(field: string): this {
    return this.orderBy(field, 'DESC');
  }

  // LIMIT and OFFSET
  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  offset(count: number): this {
    this.offsetCount = count;
    return this;
  }

  paginate(page: number, perPage: number): this {
    this.limit(perPage);
    this.offset((page - 1) * perPage);
    return this;
  }

  // INSERT methods
  insert(data: Record<string, any>): this {
    this.queryType = 'INSERT';
    this.insertData = data;
    return this;
  }

  insertInto(table: string): this {
    this.fromTable = table;
    return this;
  }

  // UPDATE methods
  update(table: string): this {
    this.queryType = 'UPDATE';
    this.fromTable = table;
    return this;
  }

  set(field: string, value: any): this;
  set(data: Record<string, any>): this;
  set(fieldOrData: string | Record<string, any>, value?: any): this {
    if (typeof fieldOrData === 'string') {
      this.updateData[fieldOrData] = value;
    } else {
      this.updateData = { ...this.updateData, ...fieldOrData };
    }
    return this;
  }

  // DELETE method
  delete(): this {
    this.queryType = 'DELETE';
    return this;
  }

  deleteFrom(table: string): this {
    this.queryType = 'DELETE';
    this.fromTable = table;
    return this;
  }

  // Build final query
  build(): QueryResult {
    const params: any[] = [];
    let sql = '';

    switch (this.queryType) {
      case 'SELECT':
        sql = this.buildSelectQuery(params);
        break;
      case 'INSERT':
        sql = this.buildInsertQuery(params);
        break;
      case 'UPDATE':
        sql = this.buildUpdateQuery(params);
        break;
      case 'DELETE':
        sql = this.buildDeleteQuery(params);
        break;
    }

    return { sql: sql.trim(), params, type: this.queryType };
  }

  private buildSelectQuery(params: any[]): string {
    let sql = 'SELECT ';
    
    // SELECT fields
    sql += this.selectFields.length > 0 ? this.selectFields.join(', ') : '*';
    
    // FROM clause
    sql += ` FROM ${this.fromTable}`;
    if (this.tableAlias) {
      sql += ` AS ${this.tableAlias}`;
    }

    // JOIN clauses
    sql += this.buildJoinClauses();

    // WHERE clause
    sql += this.buildWhereClause(params);

    // GROUP BY clause
    if (this.groupBy.length > 0) {
      sql += ` GROUP BY ${this.groupBy.map(g => g.field).join(', ')}`;
    }

    // HAVING clause
    if (this.having.length > 0) {
      sql += this.buildHavingClause(params);
    }

    // ORDER BY clause
    if (this.orderBy.length > 0) {
      sql += ` ORDER BY ${this.orderBy.map(o => `${o.field} ${o.direction}`).join(', ')}`;
    }

    // LIMIT clause
    if (this.limitCount !== undefined) {
      sql += ` LIMIT ${this.limitCount}`;
    }

    // OFFSET clause
    if (this.offsetCount !== undefined) {
      sql += ` OFFSET ${this.offsetCount}`;
    }

    return sql;
  }

  private buildInsertQuery(params: any[]): string {
    let sql = `INSERT INTO ${this.fromTable}`;
    
    const fields = Object.keys(this.insertData);
    const values = Object.values(this.insertData);
    
    sql += ` (${fields.join(', ')})`;
    sql += ` VALUES (${values.map(() => this.getParameterPlaceholder()).join(', ')})`;
    
    params.push(...values);
    
    return sql;
  }

  private buildUpdateQuery(params: any[]): string {
    let sql = `UPDATE ${this.fromTable}`;
    
    const setClauses = Object.entries(this.updateData).map(([field, value]) => {
      params.push(value);
      return `${field} = ${this.getParameterPlaceholder()}`;
    });
    
    sql += ` SET ${setClauses.join(', ')}`;
    sql += this.buildWhereClause(params);
    
    return sql;
  }

  private buildDeleteQuery(params: any[]): string {
    let sql = `DELETE FROM ${this.fromTable}`;
    sql += this.buildWhereClause(params);
    return sql;
  }

  private buildJoinClauses(): string {
    return this.joins.map(join => {
      let clause = ` ${join.type} JOIN ${join.table}`;
      if (join.alias) {
        clause += ` AS ${join.alias}`;
      }
      clause += ` ON ${join.on}`;
      return clause;
    }).join('');
  }

  private buildWhereClause(params: any[]): string {
    if (this.conditions.length === 0) return '';
    
    let whereClause = ' WHERE ';
    whereClause += this.buildConditions(this.conditions, params);
    
    return whereClause;
  }

  private buildHavingClause(params: any[]): string {
    if (this.having.length === 0) return '';
    
    let havingClause = ' HAVING ';
    havingClause += this.buildConditions(this.having, params);
    
    return havingClause;
  }

  private buildConditions(conditions: QueryCondition[], params: any[]): string {
    return conditions.map((condition, index) => {
      let clause = '';
      
      // Add logic operator (AND/OR) for non-first conditions
      if (index > 0) {
        clause += ` ${condition.logic || 'AND'} `;
      }
      
      clause += this.buildSingleCondition(condition, params);
      
      return clause;
    }).join('');
  }

  private buildSingleCondition(condition: QueryCondition, params: any[]): string {
    const { field, operator, value } = condition;
    
    switch (operator) {
      case 'eq':
        if (value === null) {
          return `${field} IS NULL`;
        }
        params.push(value);
        return `${field} = ${this.getParameterPlaceholder()}`;
        
      case 'ne':
        if (value === null) {
          return `${field} IS NOT NULL`;
        }
        params.push(value);
        return `${field} != ${this.getParameterPlaceholder()}`;
        
      case 'gt':
        params.push(value);
        return `${field} > ${this.getParameterPlaceholder()}`;
        
      case 'gte':
        params.push(value);
        return `${field} >= ${this.getParameterPlaceholder()}`;
        
      case 'lt':
        params.push(value);
        return `${field} < ${this.getParameterPlaceholder()}`;
        
      case 'lte':
        params.push(value);
        return `${field} <= ${this.getParameterPlaceholder()}`;
        
      case 'in':
        const inPlaceholders = value.map(() => this.getParameterPlaceholder()).join(', ');
        params.push(...value);
        return `${field} IN (${inPlaceholders})`;
        
      case 'nin':
        const ninPlaceholders = value.map(() => this.getParameterPlaceholder()).join(', ');
        params.push(...value);
        return `${field} NOT IN (${ninPlaceholders})`;
        
      case 'like':
        params.push(value);
        return `${field} LIKE ${this.getParameterPlaceholder()}`;
        
      case 'between':
        params.push(value[0], value[1]);
        return `${field} BETWEEN ${this.getParameterPlaceholder()} AND ${this.getParameterPlaceholder()}`;
        
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  private getParameterPlaceholder(): string {
    // For PostgreSQL style ($1, $2, etc.)
    return `$${++this.paramCounter}`;
    // For MySQL style (?, ?, etc.)
    // return '?';
  }

  // Reset builder for reuse
  reset(): this {
    this.selectFields = [];
    this.fromTable = '';
    this.tableAlias = '';
    this.joins = [];
    this.conditions = [];
    this.groupBy = [];
    this.having = [];
    this.orderBy = [];
    this.limitCount = undefined;
    this.offsetCount = undefined;
    this.queryType = 'SELECT';
    this.insertData = {};
    this.updateData = {};
    this.paramCounter = 0;
    return this;
  }

  // Clone builder
  clone(): QueryBuilder {
    const cloned = new QueryBuilder();
    cloned.selectFields = [...this.selectFields];
    cloned.fromTable = this.fromTable;
    cloned.tableAlias = this.tableAlias;
    cloned.joins = [...this.joins];
    cloned.conditions = [...this.conditions];
    cloned.groupBy = [...this.groupBy];
    cloned.having = [...this.having];
    cloned.orderBy = [...this.orderBy];
    cloned.limitCount = this.limitCount;
    cloned.offsetCount = this.offsetCount;
    cloned.queryType = this.queryType;
    cloned.insertData = { ...this.insertData };
    cloned.updateData = { ...this.updateData };
    cloned.paramCounter = this.paramCounter;
    return cloned;
  }
}

// Factory function for creating new query builders
export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder();
}

// Convenience functions
export function select(fields?: string | string[]): QueryBuilder {
  return new QueryBuilder().select(fields || '*');
}

export function insertInto(table: string): QueryBuilder {
  return new QueryBuilder().insertInto(table);
}

export function update(table: string): QueryBuilder {
  return new QueryBuilder().update(table);
}

export function deleteFrom(table: string): QueryBuilder {
  return new QueryBuilder().deleteFrom(table);
}
```

## Ví dụ thực tế 2: Email Builder

### 1. Email Types

```typescript
// types/email-builder.types.ts
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
  disposition?: 'attachment' | 'inline';
  contentId?: string;
}

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailTemplate {
  name: string;
  variables: Record<string, any>;
}

export interface EmailTracking {
  openTracking: boolean;
  clickTracking: boolean;
  unsubscribeTracking: boolean;
}

export interface EmailScheduling {
  sendAt: Date;
  timezone?: string;
}

export interface EmailPriority {
  level: 'low' | 'normal' | 'high';
  importance?: 'low' | 'normal' | 'high';
}

export interface BuiltEmail {
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: EmailAttachment[];
  template?: EmailTemplate;
  tracking?: EmailTracking;
  scheduling?: EmailScheduling;
  priority?: EmailPriority;
  headers?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### 2. Email Builder Implementation

```typescript
// builders/EmailBuilder.ts
import { 
  EmailAddress, 
  EmailAttachment, 
  EmailTemplate, 
  EmailTracking, 
  EmailScheduling, 
  EmailPriority,
  BuiltEmail 
} from '../types/email-builder.types';

export class EmailBuilder {
  private email: Partial<BuiltEmail> = {
    to: [],
    cc: [],
    bcc: [],
    attachments: [],
    tags: [],
    metadata: {},
    headers: {}
  };

  // From address
  from(email: string, name?: string): this {
    this.email.from = { email, name };
    return this;
  }

  // To addresses
  to(email: string, name?: string): this {
    this.email.to!.push({ email, name });
    return this;
  }

  addTo(recipients: EmailAddress[]): this {
    this.email.to!.push(...recipients);
    return this;
  }

  // CC addresses
  cc(email: string, name?: string): this {
    this.email.cc!.push({ email, name });
    return this;
  }

  addCc(recipients: EmailAddress[]): this {
    this.email.cc!.push(...recipients);
    return this;
  }

  // BCC addresses
  bcc(email: string, name?: string): this {
    this.email.bcc!.push({ email, name });
    return this;
  }

  addBcc(recipients: EmailAddress[]): this {
    this.email.bcc!.push(...recipients);
    return this;
  }

  // Reply-to address
  replyTo(email: string, name?: string): this {
    this.email.replyTo = { email, name };
    return this;
  }

  // Subject
  subject(subject: string): this {
    this.email.subject = subject;
    return this;
  }

  // Content
  html(content: string): this {
    this.email.htmlContent = content;
    return this;
  }

  text(content: string): this {
    this.email.textContent = content;
    return this;
  }

  content(html: string, text?: string): this {
    this.email.htmlContent = html;
    if (text) {
      this.email.textContent = text;
    }
    return this;
  }

  // Template
  template(name: string, variables: Record<string, any> = {}): this {
    this.email.template = { name, variables };
    return this;
  }

  templateVariable(key: string, value: any): this {
    if (!this.email.template) {
      this.email.template = { name: '', variables: {} };
    }
    this.email.template.variables[key] = value;
    return this;
  }

  templateVariables(variables: Record<string, any>): this {
    if (!this.email.template) {
      this.email.template = { name: '', variables: {} };
    }
    this.email.template.variables = { ...this.email.template.variables, ...variables };
    return this;
  }

  // Attachments
  attach(filename: string, content: string | Buffer, contentType: string): this {
    this.email.attachments!.push({
      filename,
      content,
      contentType,
      disposition: 'attachment'
    });
    return this;
  }

  attachFile(attachment: EmailAttachment): this {
    this.email.attachments!.push(attachment);
    return this;
  }

  attachInline(filename: string, content: string | Buffer, contentType: string, contentId: string): this {
    this.email.attachments!.push({
      filename,
      content,
      contentType,
      disposition: 'inline',
      contentId
    });
    return this;
  }

  // Tracking
  enableTracking(options: Partial<EmailTracking> = {}): this {
    this.email.tracking = {
      openTracking: true,
      clickTracking: true,
      unsubscribeTracking: true,
      ...options
    };
    return this;
  }

  disableTracking(): this {
    this.email.tracking = {
      openTracking: false,
      clickTracking: false,
      unsubscribeTracking: false
    };
    return this;
  }

  openTracking(enabled: boolean = true): this {
    if (!this.email.tracking) {
      this.email.tracking = { openTracking: false, clickTracking: false, unsubscribeTracking: false };
    }
    this.email.tracking.openTracking = enabled;
    return this;
  }

  clickTracking(enabled: boolean = true): this {
    if (!this.email.tracking) {
      this.email.tracking = { openTracking: false, clickTracking: false, unsubscribeTracking: false };
    }
    this.email.tracking.clickTracking = enabled;
    return this;
  }

  // Scheduling
  sendAt(date: Date, timezone?: string): this {
    this.email.scheduling = { sendAt: date, timezone };
    return this;
  }

  sendLater(minutes: number): this {
    const sendAt = new Date(Date.now() + minutes * 60 * 1000);
    this.email.scheduling = { sendAt };
    return this;
  }

  // Priority
  priority(level: EmailPriority['level'], importance?: EmailPriority['importance']): this {
    this.email.priority = { level, importance };
    return this;
  }

  highPriority(): this {
    return this.priority('high', 'high');
  }

  lowPriority(): this {
    return this.priority('low', 'low');
  }

  // Headers
  header(name: string, value: string): this {
    this.email.headers![name] = value;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.email.headers = { ...this.email.headers, ...headers };
    return this;
  }

  // Tags
  tag(tag: string): this {
    if (!this.email.tags!.includes(tag)) {
      this.email.tags!.push(tag);
    }
    return this;
  }

  tags(tags: string[]): this {
    tags.forEach(tag => this.tag(tag));
    return this;
  }

  // Metadata
  metadata(key: string, value: any): this {
    this.email.metadata![key] = value;
    return this;
  }

  addMetadata(metadata: Record<string, any>): this {
    this.email.metadata = { ...this.email.metadata, ...metadata };
    return this;
  }

  // Convenience methods for common email types
  notification(title: string, message: string): this {
    return this
      .subject(`Notification: ${title}`)
      .html(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
        </div>
      `)
      .text(`${title}\n\n${message}`)
      .tag('notification');
  }

  welcome(userName: string, activationLink?: string): this {
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Welcome, ${userName}!</h1>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining us. We're excited to have you on board!
        </p>
    `;

    let textContent = `Welcome, ${userName}!\n\nThank you for joining us. We're excited to have you on board!`;

    if (activationLink) {
      htmlContent += `
        <p style="color: #666; line-height: 1.6;">
          Please click the button below to activate your account:
        </p>
        <a href="${activationLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Activate Account
        </a>
      `;
      textContent += `\n\nPlease visit the following link to activate your account:\n${activationLink}`;
    }

    htmlContent += '</div>';

    return this
      .subject('Welcome to our platform!')
      .html(htmlContent)
      .text(textContent)
      .tag('welcome')
      .enableTracking();
  }

  resetPassword(userName: string, resetLink: string, expirationMinutes: number = 30): this {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="color: #666; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        <a href="${resetLink}" style="display: inline-block; background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 14px;">
          This link will expire in ${expirationMinutes} minutes. If you didn't request this reset, please ignore this email.
        </p>
      </div>
    `;

    const textContent = `
      Password Reset Request

      Hi ${userName},

      We received a request to reset your password. Visit the following link to create a new password:
      ${resetLink}

      This link will expire in ${expirationMinutes} minutes. If you didn't request this reset, please ignore this email.
    `;

    return this
      .subject('Password Reset Request')
      .html(htmlContent)
      .text(textContent)
      .tag('password-reset')
      .highPriority()
      .openTracking(false); // Privacy consideration
  }

  // Validation
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.email.from) {
      errors.push('From address is required');
    }

    if (!this.email.to || this.email.to.length === 0) {
      errors.push('At least one recipient is required');
    }

    if (!this.email.subject) {
      errors.push('Subject is required');
    }

    if (!this.email.htmlContent && !this.email.textContent && !this.email.template) {
      errors.push('Either HTML content, text content, or template is required');
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (this.email.from && !emailRegex.test(this.email.from.email)) {
      errors.push('Invalid from email address');
    }

    this.email.to?.forEach((recipient, index) => {
      if (!emailRegex.test(recipient.email)) {
        errors.push(`Invalid to email address at index ${index}`);
      }
    });

    this.email.cc?.forEach((recipient, index) => {
      if (!emailRegex.test(recipient.email)) {
        errors.push(`Invalid CC email address at index ${index}`);
      }
    });

    this.email.bcc?.forEach((recipient, index) => {
      if (!emailRegex.test(recipient.email)) {
        errors.push(`Invalid BCC email address at index ${index}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Build final email object
  build(): BuiltEmail {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Email validation failed: ${validation.errors.join(', ')}`);
    }

    return {
      from: this.email.from!,
      to: this.email.to!,
      cc: this.email.cc?.length ? this.email.cc : undefined,
      bcc: this.email.bcc?.length ? this.email.bcc : undefined,
      replyTo: this.email.replyTo,
      subject: this.email.subject!,
      htmlContent: this.email.htmlContent,
      textContent: this.email.textContent,
      attachments: this.email.attachments?.length ? this.email.attachments : undefined,
      template: this.email.template,
      tracking: this.email.tracking,
      scheduling: this.email.scheduling,
      priority: this.email.priority,
      headers: Object.keys(this.email.headers!).length ? this.email.headers : undefined,
      tags: this.email.tags?.length ? this.email.tags : undefined,
      metadata: Object.keys(this.email.metadata!).length ? this.email.metadata : undefined
    };
  }

  // Reset builder for reuse
  reset(): this {
    this.email = {
      to: [],
      cc: [],
      bcc: [],
      attachments: [],
      tags: [],
      metadata: {},
      headers: {}
    };
    return this;
  }

  // Clone builder
  clone(): EmailBuilder {
    const cloned = new EmailBuilder();
    cloned.email = JSON.parse(JSON.stringify(this.email));
    return cloned;
  }
}

// Factory functions
export function createEmail(): EmailBuilder {
  return new EmailBuilder();
}

export function createNotification(title: string, message: string): EmailBuilder {
  return new EmailBuilder().notification(title, message);
}

export function createWelcomeEmail(userName: string, activationLink?: string): EmailBuilder {
  return new EmailBuilder().welcome(userName, activationLink);
}

export function createPasswordResetEmail(userName: string, resetLink: string): EmailBuilder {
  return new EmailBuilder().resetPassword(userName, resetLink);
}
```

## Ví dụ thực tế 3: HTTP Request Builder

```typescript
// builders/RequestBuilder.ts
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  params: Record<string, any>;
  data?: any;
  timeout: number;
  retries: number;
  retryDelay: number;
  validateStatus?: (status: number) => boolean;
  responseType: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials: boolean;
}

export class RequestBuilder {
  private options: Partial<RequestOptions> = {
    method: 'GET',
    headers: {},
    params: {},
    timeout: 30000,
    retries: 0,
    retryDelay: 1000,
    responseType: 'json',
    withCredentials: false
  };

  // URL
  url(url: string): this {
    this.options.url = url;
    return this;
  }

  baseUrl(baseUrl: string): this {
    if (this.options.url) {
      this.options.url = `${baseUrl.replace(/\/$/, '')}/${this.options.url.replace(/^\//, '')}`;
    } else {
      this.options.url = baseUrl;
    }
    return this;
  }

  path(path: string): this {
    if (this.options.url) {
      this.options.url += `/${path.replace(/^\//, '')}`;
    } else {
      this.options.url = path;
    }
    return this;
  }

  // HTTP Methods
  get(): this {
    this.options.method = 'GET';
    return this;
  }

  post(data?: any): this {
    this.options.method = 'POST';
    if (data !== undefined) {
      this.options.data = data;
    }
    return this;
  }

  put(data?: any): this {
    this.options.method = 'PUT';
    if (data !== undefined) {
      this.options.data = data;
    }
    return this;
  }

  delete(): this {
    this.options.method = 'DELETE';
    return this;
  }

  patch(data?: any): this {
    this.options.method = 'PATCH';
    if (data !== undefined) {
      this.options.data = data;
    }
    return this;
  }

  // Headers
  header(name: string, value: string): this {
    this.options.headers![name] = value;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.options.headers = { ...this.options.headers, ...headers };
    return this;
  }

  contentType(type: string): this {
    return this.header('Content-Type', type);
  }

  json(): this {
    return this.contentType('application/json');
  }

  form(): this {
    return this.contentType('application/x-www-form-urlencoded');
  }

  multipart(): this {
    return this.contentType('multipart/form-data');
  }

  auth(token: string, type: 'Bearer' | 'Basic' = 'Bearer'): this {
    return this.header('Authorization', `${type} ${token}`);
  }

  // Query Parameters
  param(name: string, value: any): this {
    this.options.params![name] = value;
    return this;
  }

  params(params: Record<string, any>): this {
    this.options.params = { ...this.options.params, ...params };
    return this;
  }

  // Request Body
  data(data: any): this {
    this.options.data = data;
    return this;
  }

  jsonData(data: object): this {
    this.json();
    this.options.data = JSON.stringify(data);
    return this;
  }

  formData(data: Record<string, any>): this {
    this.form();
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    this.options.data = formData.toString();
    return this;
  }

  // Configuration
  timeout(ms: number): this {
    this.options.timeout = ms;
    return this;
  }

  retries(count: number, delay: number = 1000): this {
    this.options.retries = count;
    this.options.retryDelay = delay;
    return this;
  }

  responseType(type: RequestOptions['responseType']): this {
    this.options.responseType = type;
    return this;
  }

  withCredentials(enabled: boolean = true): this {
    this.options.withCredentials = enabled;
    return this;
  }

  validateStatus(validator: (status: number) => boolean): this {
    this.options.validateStatus = validator;
    return this;
  }

  // Build and execute
  build(): RequestOptions {
    if (!this.options.url) {
      throw new Error('URL is required');
    }

    return {
      method: this.options.method!,
      url: this.options.url,
      headers: this.options.headers!,
      params: this.options.params!,
      data: this.options.data,
      timeout: this.options.timeout!,
      retries: this.options.retries!,
      retryDelay: this.options.retryDelay!,
      validateStatus: this.options.validateStatus,
      responseType: this.options.responseType!,
      withCredentials: this.options.withCredentials!
    };
  }

  async execute(): Promise<any> {
    const options = this.build();
    
    // Implement actual HTTP request logic here
    // This is a simplified example
    console.log('Executing request with options:', options);
    
    // Mock response
    return {
      status: 200,
      data: { message: 'Success' },
      headers: {},
      config: options
    };
  }
}

// Factory functions
export function createRequest(): RequestBuilder {
  return new RequestBuilder();
}

export function get(url: string): RequestBuilder {
  return new RequestBuilder().url(url).get();
}

export function post(url: string, data?: any): RequestBuilder {
  return new RequestBuilder().url(url).post(data);
}
```

## Usage Examples

```typescript
// Query Builder Examples
import { select, insertInto, update, deleteFrom } from './builders/QueryBuilder';

// Complex SELECT query
const userQuery = select(['u.id', 'u.name', 'u.email', 'p.title', 'c.name as category'])
  .from('users', 'u')
  .leftJoin('posts p', 'p.user_id = u.id')
  .leftJoin('categories c', 'c.id = p.category_id')
  .where('u.active', 'eq', true)
  .where('u.created_at', 'gte', '2023-01-01')
  .whereIn('u.role', ['admin', 'editor'])
  .orderBy('u.created_at', 'DESC')
  .limit(10)
  .offset(20)
  .build();

console.log(userQuery.sql);
console.log(userQuery.params);

// INSERT query
const insertQuery = insertInto('users')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    created_at: new Date()
  })
  .build();

// Email Builder Examples
import { createEmail, createWelcomeEmail } from './builders/EmailBuilder';

// Simple email
const simpleEmail = createEmail()
  .from('noreply@example.com', 'Example App')
  .to('user@example.com', 'John Doe')
  .subject('Test Email')
  .html('<h1>Hello World!</h1>')
  .text('Hello World!')
  .build();

// Welcome email with tracking
const welcomeEmail = createWelcomeEmail('John Doe', 'https://example.com/activate?token=123')
  .from('welcome@example.com', 'Example Team')
  .to('john@example.com')
  .enableTracking()
  .tag('onboarding')
  .metadata('user_id', '12345')
  .build();

// Complex email with attachments
const complexEmail = createEmail()
  .from('sales@example.com')
  .to('client@example.com')
  .cc('manager@example.com')
  .subject('Monthly Report')
  .template('monthly_report', {
    month: 'January',
    revenue: '$10,000',
    growth: '15%'
  })
  .attach('report.pdf', reportBuffer, 'application/pdf')
  .highPriority()
  .sendLater(60) // Send in 1 hour
  .build();

// Request Builder Examples
import { createRequest, get, post } from './builders/RequestBuilder';

// Simple GET request
const users = await get('https://api.example.com/users')
  .param('page', 1)
  .param('limit', 10)
  .auth('your-token')
  .execute();

// POST request with JSON data
const newUser = await post('https://api.example.com/users')
  .jsonData({
    name: 'John Doe',
    email: 'john@example.com'
  })
  .auth('your-token')
  .timeout(5000)
  .retries(3)
  .execute();

// Complex request with file upload
const uploadResult = await createRequest()
  .url('https://api.example.com/upload')
  .post()
  .multipart()
  .headers({
    'X-Custom-Header': 'value'
  })
  .data(formData)
  .timeout(30000)
  .validateStatus(status => status < 400)
  .execute();
```

## Testing Builder Patterns

```typescript
// tests/QueryBuilder.test.ts
import { select, insertInto } from '../src/builders/QueryBuilder';

describe('QueryBuilder', () => {
  test('should build simple SELECT query', () => {
    const query = select('*')
      .from('users')
      .where('active', 'eq', true)
      .build();

    expect(query.sql).toBe('SELECT * FROM users WHERE active = $1');
    expect(query.params).toEqual([true]);
  });

  test('should build complex query with joins', () => {
    const query = select(['u.name', 'p.title'])
      .from('users', 'u')
      .leftJoin('posts p', 'p.user_id = u.id')
      .where('u.active', 'eq', true)
      .orderBy('u.created_at', 'DESC')
      .limit(10)
      .build();

    expect(query.sql).toContain('LEFT JOIN posts p ON p.user_id = u.id');
    expect(query.sql).toContain('ORDER BY u.created_at DESC');
    expect(query.sql).toContain('LIMIT 10');
  });

  test('should build INSERT query', () => {
    const query = insertInto('users')
      .insert({ name: 'John', email: 'john@example.com' })
      .build();

    expect(query.sql).toBe('INSERT INTO users (name, email) VALUES ($1, $2)');
    expect(query.params).toEqual(['John', 'john@example.com']);
  });
});

// tests/EmailBuilder.test.ts
import { createEmail, createWelcomeEmail } from '../src/builders/EmailBuilder';

describe('EmailBuilder', () => {
  test('should build simple email', () => {
    const email = createEmail()
      .from('test@example.com')
      .to('user@example.com')
      .subject('Test')
      .html('<p>Hello</p>')
      .build();

    expect(email.from.email).toBe('test@example.com');
    expect(email.to[0].email).toBe('user@example.com');
    expect(email.subject).toBe('Test');
    expect(email.htmlContent).toBe('<p>Hello</p>');
  });

  test('should validate email addresses', () => {
    expect(() => {
      createEmail()
        .from('invalid-email')
        .to('user@example.com')
        .subject('Test')
        .html('<p>Hello</p>')
        .build();
    }).toThrow('Email validation failed');
  });

  test('should create welcome email', () => {
    const email = createWelcomeEmail('John Doe', 'https://example.com/activate')
      .from('welcome@example.com')
      .to('john@example.com')
      .build();

    expect(email.subject).toBe('Welcome to our platform!');
    expect(email.htmlContent).toContain('Welcome, John Doe!');
    expect(email.htmlContent).toContain('https://example.com/activate');
    expect(email.tags).toContain('welcome');
  });
});
```

## Kết luận

Builder Pattern trong các ví dụ này:

1. **Complex Object Construction**: Xây dựng object phức tạp từng bước
2. **Fluent Interface**: Method chaining dễ đọc và sử dụng
3. **Validation**: Validate từng bước và final object
4. **Flexibility**: Nhiều cách khác nhau để cấu hình
5. **Reusability**: Builder có thể được reset và tái sử dụng

**Lợi ích chính:**
- **Readability**: Code dễ đọc và hiểu
- **Maintainability**: Dễ maintain và extend
- **Type Safety**: TypeScript đảm bảo type safety
- **Method Chaining**: Syntax liền mạch
- **Validation**: Built-in validation logic

Builder Pattern đặc biệt hữu ích cho:
- SQL Query builders
- Email/Message builders  
- HTTP Request builders
- Configuration builders
- Test data builders
- Complex form builders