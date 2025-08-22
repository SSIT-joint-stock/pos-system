# Frontend Tech Stack - Multi-Domain POS System

## Tổng quan

Frontend stack cho hệ thống POS multi-domain sử dụng Next.js 14 với architecture hiện đại, hỗ trợ multiple business domains (restaurant, retail) với shared components và domain-specific features.

## Core Technologies

### 1. Framework & Runtime

```json
{
  "next": "^14.2.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "5.5.4"
}
```

**Next.js 14 Features:**

- App Router với Server Components
- Streaming với Suspense
- Edge Runtime support
- Built-in optimizations (Image, Font, Bundle)

### 2. Styling & UI Framework

```json
{
  "@tailwindcss/typography": "^0.5.13",
  "tailwindcss": "^3.4.1",
  "@mantine/core": "^8.2.5",
  "@mantine/hooks": "^8.2.5",
  "@mantine/form": "^7.8.1",
  "@mantine/dates": "^7.14.3",
  "@mantine/notifications": "^8.2.5",
  "@mantine/modals": "^8.2.5",
  "@mantine/spotlight": "^8.2.5",
  "@mantine/carousel": "^8.2.5",
  "@mantine/charts": "^7.14.3",
  "@mantine/dropzone": "^7.14.3",
  "@mantine/tiptap": "^7.14.3"
}
```

**Tailwind CSS v3:**

- Stable version with full feature set
- Improved performance
- Better IntelliSense
- JIT (Just-In-Time) engine

**Mantine v7:**

- Complete UI component library
- Built-in dark mode
- Form management
- Hooks collection
- Notification system

## State Management

### 1. Local State

```json
{
  "jotai": "^2.9.0"
}
```

### 2. Server State & API Client

```json
{
  "axios": "^1.7.7"
}
```

### 3. Form State

```json
{
  "react-hook-form": "^7.53.2",
  "@hookform/resolvers": "^3.3.4",
  "zod": "^3.23.7"
}
```

## Utility Libraries

### 1. Date & Time

```json
{
  "dayjs": "^1.11.13"
}
```

### 2. Search & Data Processing

```json
{
  //   "fuse.js": "^7.0.0",
  "lodash.isequal": "^4.5.0",
  "@types/lodash.isequal": "^4.5.0"
}
```

### 3. Hooks Collections

```json
{
  "usehooks-ts": "^3.1.0",
  "@uidotdev/usehooks": "^2.4.1"
}
```

## Business Logic Libraries

### 1. Print & Barcode

```json
{
  "react-to-print": "^3.0.2",
  "jsbarcode": "^3.11.6",
  "@types/jsbarcode": "^3.11.3",
  "react-barcode": "^1.6.1"
}
```

### 2. Vietnamese Number Processing

```json
{
  "read-vietnamese-number": "^2.1.4"
}
```

### 3. Charts & Visualization

```json
{
  "recharts": "^2.15.0"
}
```

### 4. Notifications

```json
{
  "react-toastify": "^10.0.5"
}
```

## Icons & Theming

```json
{
  "lucide-react": "^0.460.0",
  //   "next-themes": "^0.3.0",
  "@tabler/icons-react": "^3.24.0",
  "react-icons": "^5.3.0"
}
```

## Monorepo Packages

```json
{
  "@repo/design-system": "*",
  "@repo/shared": "*",
  "@repo/types": "*",
  "@repo/utils": "*"
}
```

## Project Structure

```
apps/
├── restaurant-web/          # Restaurant domain app
├── retail-web/             # Retail domain app
└── main-web/              # Main domain (account, billing)

packages/
├── ui/                    # Shared UI components
├── shared/               # Shared utilities
├── types/               # TypeScript definitions
└── utils/              # Common utilities
```

## Package.json Configuration

### Root Package.json

```json
{
  "name": "pos-system",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*"
  }
}
```

### Restaurant App Package.json

```json
{
  "name": "@pos/restaurant-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mantine/core": "^8.2.5",
    "@mantine/hooks": "^8.2.5",
    "@mantine/form": "^7.8.1",
    "@mantine/dates": "^7.14.3",
    "@mantine/notifications": "^8.2.5",
    "@mantine/modals": "^8.2.5",
    "@mantine/carousel": "^8.2.5",
    "@mantine/charts": "^7.14.3",
    "@mantine/dropzone": "^7.14.3",
    "@mantine/tiptap": "^7.14.3",
    "tailwindcss": "^3.4.1",
    "jotai": "^2.9.0",

    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.23.7",
    "axios": "^1.7.7",
    "dayjs": "^1.11.13",
    "fuse.js": "^7.0.0",
    "react-to-print": "^3.0.2",
    "jsbarcode": "^3.11.6",
    "react-barcode": "^1.6.1",
    "read-vietnamese-number": "^2.1.4",
    "recharts": "^2.15.0",
    "react-toastify": "^10.0.5",
    "lucide-react": "^0.460.0",
    "next-themes": "^0.3.0",
    "@tabler/icons-react": "^3.24.0",
    "react-icons": "^5.3.0",
    "lodash.isequal": "^4.5.0",
    "usehooks-ts": "^3.1.0",
    "@uidotdev/usehooks": "^2.4.1",
    "@repo/design-system": "*",
    "@repo/shared": "*",
    "@repo/types": "*",
    "@repo/utils": "*"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "@types/lodash.isequal": "^4.5.0",
    "@types/jsbarcode": "^3.11.3",
    "typescript": "5.5.4",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.3",
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*"
  }
}
```

### Retail App Package.json

```json
{
  "name": "@pos/retail-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3002",
    "build": "next build",
    "start": "next start --port 3002",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mantine/core": "^8.2.5",
    "@mantine/hooks": "^8.2.5",
    "@mantine/form": "^7.8.1",
    "@mantine/dates": "^7.14.3",
    "@mantine/notifications": "^8.2.5",
    "@mantine/modals": "^8.2.5",
    "@mantine/spotlight": "^8.2.5",
    "@mantine/carousel": "^8.2.5",
    "@mantine/charts": "^7.14.3",
    "@mantine/dropzone": "^7.14.3",
    "@mantine/tiptap": "^7.14.3",
    "tailwindcss": "^3.4.1",
    "jotai": "^2.9.0",

    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.23.7",
    "axios": "^1.7.7",
    "dayjs": "^1.11.13",
    "fuse.js": "^7.0.0",
    "react-to-print": "^3.0.2",
    "jsbarcode": "^3.11.6",
    "react-barcode": "^1.6.1",
    "read-vietnamese-number": "^2.1.4",
    "recharts": "^2.15.0",
    "react-toastify": "^10.0.5",
    "lucide-react": "^0.460.0",
    "next-themes": "^0.3.0",
    "@tabler/icons-react": "^3.24.0",
    "react-icons": "^5.3.0",
    "@fortawesome/fontawesome-svg-core": "^6.7.2",
    "@fortawesome/free-brands-svg-icons": "^6.7.2",
    "@fortawesome/free-regular-svg-icons": "^6.7.2",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "lodash.isequal": "^4.5.0",
    "usehooks-ts": "^3.1.0",
    "@uidotdev/usehooks": "^2.4.1",
    "@repo/design-system": "*",
    "@repo/shared": "*",
    "@repo/types": "*",
    "@repo/utils": "*"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "@types/lodash.isequal": "^4.5.0",
    "@types/jsbarcode": "^3.11.3",
    "typescript": "5.5.4",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.3",
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*"
  }
}
```

## Shared UI Package Structure

### @repo/design-system Package

```typescript
// packages/design-system/package.json
{
  "name": "@repo/design-system",
  "version": "0.0.0",
  "private": true,
  "main": "./index.tsx",
  "types": "./index.tsx",
  "dependencies": {
    "react": "^18.2.0",
    "@mantine/core": "^8.2.5",
    "@mantine/hooks": "^8.2.5",
    "lucide-react": "^0.460.0",
    "tailwindcss": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.61",
    "typescript": "5.5.4",
    "@repo/typescript-config": "*"
  }
}

// packages/design-system/components/button/index.tsx
import { Button as MantineButton, ButtonProps } from '@mantine/core';
import { forwardRef } from 'react';
import { cn } from '@repo/utils';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-700'
    };

    return (
      <MantineButton
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// packages/design-system/components/card/index.tsx
import { Paper, PaperProps } from '@mantine/core';
import { forwardRef } from 'react';
import { cn } from '@repo/utils';

export interface CardProps extends PaperProps {
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Paper
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </Paper>
    );
  }
);

Card.displayName = 'Card';

// packages/design-system/components/data-table/index.tsx
import { Table, ScrollArea, Checkbox, ActionIcon } from '@mantine/core';
import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  loading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  onRowSelect,
  loading = false
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = sortConfig
    ? [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(data.filter(row => newSelected.has(row.id)));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(data.map(row => row.id)) : new Set();
    setSelectedRows(newSelected);
    onRowSelect?.(checked ? data : []);
  };

  return (
    <ScrollArea>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {selectable && (
              <Table.Th>
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                  onChange={(event) => handleSelectAll(event.currentTarget.checked)}
                />
              </Table.Th>
            )}
            {columns.map((column) => (
              <Table.Th
                key={String(column.key)}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        size={12}
                        className={
                          sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }
                      />
                      <ChevronDown
                        size={12}
                        className={
                          sortConfig?.key === column.key && sortConfig.direction === 'desc'
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }
                      />
                    </div>
                  )}
                </div>
              </Table.Th>
            ))}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length + (selectable ? 2 : 1)}>
                <div className="text-center py-4">Loading...</div>
              </Table.Td>
            </Table.Tr>
          ) : (
            sortedData.map((row) => (
              <Table.Tr key={row.id}>
                {selectable && (
                  <Table.Td>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onChange={(event) =>
                        handleRowSelect(row.id, event.currentTarget.checked)
                      }
                    />
                  </Table.Td>
                )}
                {columns.map((column) => (
                  <Table.Td key={String(column.key)}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </Table.Td>
                ))}
                <Table.Td>
                  <ActionIcon variant="subtle">
                    <MoreHorizontal size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

// packages/design-system/index.tsx
export { Button } from './components/button';
export { Card } from './components/card';
export { DataTable } from './components/data-table';
export type { CardProps } from './components/card';
```

## Shared Types Package

```typescript
// packages/types/package.json
{
  "name": "@repo/types",
  "version": "0.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "devDependencies": {
    "typescript": "^5.5.0",
    "@repo/typescript-config": "*"
  }
}

// packages/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  accountId: string;
  businessType: 'RESTAURANT' | 'RETAIL';
  name: string;
  subdomain: string;
  customDomain?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL';
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// packages/types/restaurant.ts
export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  location?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'OUT_OF_SERVICE';
  currentOrder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  preparationTime?: number;
  calories?: number;
  allergens: string[];
  dietaryInfo: string[];
  images: string[];
  isAvailable: boolean;
  sortOrder: number;
  modifiers?: MenuItemModifier[];
  category?: MenuCategory;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  availableTime?: {
    start: string;
    end: string;
  };
}

export interface MenuItemModifier {
  id: string;
  menuItemId: string;
  name: string;
  type: 'SIZE' | 'OPTION' | 'ADDON' | 'SUBSTITUTION';
  options: Array<{
    name: string;
    price: number;
  }>;
  required: boolean;
  multiSelect: boolean;
}

export interface RestaurantOrder {
  id: string;
  restaurantId: string;
  orderNumber: string;
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'DRIVE_THROUGH';
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED';
  specialNotes?: string;
  estimatedTime?: number;
  actualTime?: number;
  items: RestaurantOrderItem[];
  table?: Table;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantOrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  modifiers?: Array<{
    name: string;
    price: number;
  }>;
  specialNotes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';
  total: number;
  menuItem?: MenuItem;
}

// packages/types/retail.ts
export interface Product {
  id: string;
  retailStoreId: string;
  categoryId?: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  cost?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  variants: Array<{
    name: string;
    value: string;
    price?: number;
  }>;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  category?: ProductCategory;
  inventory?: Inventory;
}

export interface ProductCategory {
  id: string;
  retailStoreId: string;
  name: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  parent?: ProductCategory;
  children?: ProductCategory[];
}

export interface Inventory {
  id: string;
  retailStoreId: string;
  productId: string;
  quantity: number;
  reserved: number;
  minStock: number;
  maxStock?: number;
  reorderPoint: number;
  lastUpdated: string;
  product?: Product;
}

export interface Customer {
  id: string;
  retailStoreId: string;
  code: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  loyaltyPoints: number;
  totalSpent: number;
  isActive: boolean;
}

export interface RetailOrder {
  id: string;
  retailStoreId: string;
  orderNumber: string;
  customerId?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'E_WALLET' | 'STORE_CREDIT' | 'OTHER';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  notes?: string;
  items: RetailOrderItem[];
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface RetailOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  product?: Product;
}

// packages/types/index.ts
export * from './api';
export * from './restaurant';
export * from './retail';
```

## Shared Utils Package

```typescript
// packages/utils/package.json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
    "dayjs": "^1.11.13",
    "read-vietnamese-number": "^2.1.4"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "@repo/typescript-config": "*"
  }
}

// packages/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// packages/utils/format.ts
import dayjs from 'dayjs';
import { readVietnameseNumber } from 'read-vietnamese-number';

export function formatCurrency(
  amount: number,
  currency = 'VND',
  locale = 'vi-VN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(
  number: number,
  locale = 'vi-VN'
): string {
  return new Intl.NumberFormat(locale).format(number);
}

export function formatDate(
  date: string | Date,
  format = 'DD/MM/YYYY'
): string {
  return dayjs(date).format(format);
}

export function formatDateTime(
  date: string | Date,
  format = 'DD/MM/YYYY HH:mm'
): string {
  return dayjs(date).format(format);
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function numberToVietnameseText(number: number): string {
  return readVietnameseNumber(number);
}

export function formatPhoneNumber(phone: string): string {
  // Format Vietnamese phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
}

// packages/utils/validation.ts
import { z } from 'zod';

export const phoneSchema = z.string()
  .regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số');

export const emailSchema = z.string()
  .email('Email không hợp lệ');

export const currencySchema = z.number()
  .min(0, 'Giá trị phải lớn hơn 0');

export const requiredStringSchema = z.string()
  .min(1, 'Trường này là bắt buộc');

export const optionalStringSchema = z.string().optional();

// packages/utils/constants.ts
export const BUSINESS_TYPES = {
  RESTAURANT: 'RESTAURANT',
  RETAIL: 'RETAIL',
} as const;

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  SERVED: 'SERVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  E_WALLET: 'E_WALLET',
  STORE_CREDIT: 'STORE_CREDIT',
  OTHER: 'OTHER',
} as const;

export const TABLE_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
  CLEANING: 'CLEANING',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
} as const;

// packages/utils/index.ts
export { cn } from './cn';
export * from './format';
export * from './validation';
export * from './constants';
```

## State Management Configuration

### Jotai Store Setup

```typescript
// packages/shared/store/atoms.ts
import { atom } from "jotai";
import { User, Tenant } from "@repo/types";

// Auth atoms
export const userAtom = atom<User | null>(null);
export const tenantAtom = atom<Tenant | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

// UI atoms
export const sidebarOpenAtom = atom(true);
export const themeAtom = atom<"light" | "dark">("light");
export const loadingAtom = atom(false);

// Business-specific atoms
export const selectedTableAtom = atom<string | null>(null);
export const cartItemsAtom = atom<any[]>([]);
export const currentOrderAtom = atom<any | null>(null);

// Search atoms
export const searchQueryAtom = atom("");
export const searchResultsAtom = atom<any[]>([]);
```

### React Query Configuration

```typescript
// packages/shared/api/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// packages/shared/api/axios.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant header
    const tenantId = localStorage.getItem("tenantId");
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tenantId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## Configuration Files

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        restaurant: {
          50: '#fdf4ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        },
        retail: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};

export default config;
```

### TypeScript Configuration

```json
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/design-system": ["../../packages/design-system"],
      "@repo/shared": ["../../packages/shared"],
      "@repo/types": ["../../packages/types"],
      "@repo/utils": ["../../packages/utils"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}

// apps/restaurant-web/tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@repo/design-system": ["../../packages/design-system"],
      "@repo/shared": ["../../packages/shared"],
      "@repo/types": ["../../packages/types"],
      "@repo/utils": ["../../packages/utils"]
    }
  }
}
```

### ESLint Configuration

```javascript
// packages/eslint-config/next.js
module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
```

## Development Scripts

### Turbo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "test": {
      "dependsOn": ["^test"]
    }
  }
}
```

## Key Features & Benefits

### 1. **Monorepo Architecture**

- Shared components và utilities
- Type safety across packages
- Consistent development experience
- Easy code reuse between domains

### 2. **Modern State Management**

- Jotai cho local state (atomic)
- React Query cho server state
- Context API cho theme/auth
- TypeScript type safety

### 3. **UI/UX Excellence**

- Mantine component library
- Tailwind CSS v4 styling
- Dark/light mode support
- Responsive design
- Accessibility built-in

### 4. **Business-Specific Features**

- Print receipts với react-to-print
- Barcode generation với jsBarcode
- Vietnamese number reading
- Search với FlexSearch
- Charts với Recharts

### 5. **Developer Experience**

- TypeScript strict mode
- ESLint + Prettier
- Hot reload với Turbo
- Type-safe API calls
- Form validation với Zod

### 6. **Performance Optimizations**

- Next.js 14 App Router
- Server Components
- Image optimization
- Bundle splitting
- Edge runtime support

Kiến trúc này cung cấp foundation mạnh mẽ cho hệ thống POS multi-domain với khả năng mở rộng cao và developer experience tốt.
