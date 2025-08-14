## Constants

Thư mục `constants` tập trung các hằng số dùng xuyên suốt ứng dụng web (route names, storage keys, feature flags, status maps, UI literals…). Mục tiêu: thống nhất tên gọi, dễ tìm/đổi, và tránh "magic string" rải rác.

### Quy ước
- Dùng named exports, gom theo chủ đề: `routes.ts`, `storage-keys.ts`, `feature-flags.ts`, `status.ts`, `app.ts`…
- Scalar hằng số viết UPPER_SNAKE_CASE. Nhóm nhiều giá trị dùng `as const` để có literal type.
- Tránh `enum`; dùng object literal `as const` hoặc union type để an toàn và nhẹ hơn.
- Chỉ xuất các hằng số thực sự tĩnh. Với biến cấu hình theo môi trường, ưu tiên đọc từ `NEXT_PUBLIC_*` (client) hoặc `@repo/config-env` (server).
- Tạo `index.ts` làm barrel export cho các file con.

### Cấu trúc gợi ý
```
constants/
  app.ts            # Tên app, phiên bản, domain UI (không nhạy cảm)
  routes.ts         # Đường dẫn điều hướng, basePath nếu có
  storage-keys.ts   # localStorage/sessionStorage keys
  feature-flags.ts  # Cờ bật/tắt tính năng ở client (không nhạy cảm)
  status.ts         # Map trạng thái (code → label/color)
  index.ts          # Barrel exports
```

### Ví dụ

```ts
// constants/app.ts
export const APP_NAME = 'POS Main';
export const APP_VERSION = '0.1.0';

// Chỉ expose biến an toàn lên client (NEXT_PUBLIC_)
export const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';
```

```ts
// constants/routes.ts
export const ROUTES = {
  home: '/',
  login: '/auth/login',
  dashboard: '/pos',
  products: '/pos/products',
} as const;

export type RouteKey = keyof typeof ROUTES;
```

```ts
// constants/storage-keys.ts
export const STORAGE_KEYS = {
  accessToken: 'pos.access_token',
  refreshToken: 'pos.refresh_token',
  theme: 'pos.theme',
} as const;
```

```ts
// constants/status.ts
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
```

```ts
// constants/feature-flags.ts
export const FEATURE_FLAGS = {
  enableNewCheckout: false,
  enableBetaBanner: true,
} as const;
```

```ts
// constants/index.ts (barrel)
export * from './app';
export * from './routes';
export * from './storage-keys';
export * from './feature-flags';
export * from './status';
```

### Lưu ý
- Không đặt secrets vào `constants/`. Secrets/nhạy cảm phải đọc qua API server hoặc biến `@repo/config-env` phía server.
- Với basePath (ví dụ `/pos`), đồng bộ với `next.config.js` và hằng số route để tránh lệch.
- Nếu một hằng số dùng chung nhiều app, cân nhắc đưa sang package `@repo/shared` hoặc `@repo/types` tùy mục đích.


