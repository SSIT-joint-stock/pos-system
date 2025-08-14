## Utils

Thư mục `utils` chứa các hàm tiện ích thuần (pure functions) và helper nhỏ phục vụ UI/logic client. Mục tiêu: tái sử dụng, dễ test, không phụ thuộc framework trừ khi cần thiết.

### Nguyên tắc
- Ưu tiên pure functions, không side-effects (không chạm DOM, không set global state).
- Nhỏ gọn, làm một việc, có test khi hợp lý.
- Không import ngược vào components để tránh vòng phụ thuộc.
- Tách theo chủ đề: `format/`, `date/`, `number/`, `string/`, `network/`, `validation/`…
- Dùng named exports; đặt tên mô tả chức năng rõ ràng.

### Cấu trúc gợi ý
```
utils/
  format/
    currency.ts
    phone.ts
    index.ts
  date/
    parse.ts
    format.ts
    index.ts
  number/
    clamp.ts
    round.ts
    index.ts
  network/
    fetch-json.ts
    with-timeout.ts
    index.ts
  validation/
    is-email.ts
    is-phone.ts
    index.ts
  index.ts
```

### Ví dụ

```ts
// utils/format/currency.ts
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
```

```ts
// utils/network/fetch-json.ts
export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
```

```ts
// utils/number/clamp.ts
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
```

### Import mẫu
```ts
import { formatCurrency } from '@main/utils/format';
import { clamp } from '@main/utils/number';
import { fetchJson } from '@main/utils/network';
```

### Lưu ý
- Nếu một util dùng chung đa app, cân nhắc đưa vào package `@repo/utils` trong monorepo.
- Với validation phức tạp, ưu tiên định nghĩa ở `schemas/` (Zod) và chỉ đặt helper mỏng ở đây.

