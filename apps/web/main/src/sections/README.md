
### Cấu hình chung cho `src/sections`

- **Mục tiêu**: Gom mã theo domain/feat (auth, notifications, explore, profile, post-detail, message, bookmark, home, settings, followers). Mỗi miền tự chứa trang (`view/`), phần tử con (`components/`/`subsections/`), dữ liệu cục bộ (`data/`), và tiện ích riêng (`utils/` khi cần).
- **Entry-point trang**: `view/` chứa component trang chính `*-view.tsx`, được import trực tiếp từ App Router.
- **Dữ liệu & schema**: đặt ở `data/` (Zod schemas, mock), re-export qua `data/index.ts`.
- **Tổ chức UI**: UI con/khối phức tạp vào `components/` hoặc `subsections/` (ví dụ settings).
- **Export**: Ưu tiên barrel `view/index.ts` để import gọn từ route: `import { XxxView } from '@/sections/<domain>/view'`.
- **Tránh phụ thuộc chéo**: Nếu cần dùng chung, đẩy lên `src/components/` dùng lại.

### Cấu trúc gợi ý
```
sections/
  <domain>/
    view/
      <domain>-view.tsx
      index.ts              # export { <Domain>View }
    components/             # (nếu có)
    <subsections>/            # (settings, v.v.)
    data/
      schema.ts
      index.ts
    utils/                  # (nếu có)
```

### Import mẫu ở route
```ts
import { ExploreView } from '@/sections/explore/view';
import { ProfileView } from '@/sections/profile/view';
import { MessageView } from '@/sections/message/view';
```
Hoặc (khi chưa có barrel): `import SettingsView from '@/sections/settings/view/setting-view'`.

### Ví dụ: `auth`

Cấu trúc:
```
sections/auth/
  data/
    schema.ts
    index.ts
  view/
    login-view.tsx
    register-view.tsx
    index.ts              # export { LoginView, RegisterView }
```

- Route sử dụng:

- /auth/login/page.tsx

```ts
import { LoginView } from '@main/sections/auth/view';

export const metadata = { title: 'Login Page' };

export default function LoginPage() {
  return <LoginView />;
}
```

- /auth/register/page.tsx
```ts
import { RegisterView } from '@main/sections/auth/view';

export const metadata = { title: 'Register Page' };

export default function RegisterPage() {
  return <RegisterView />;
}
```

- Schema và re-export:
```ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }).max(30, { message: 'Username must be 30 characters or less' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).max(30, { message: 'Password must be 30 characters or less' }),
});

export type LoginData = z.infer<typeof loginSchema>;
```

```ts
export {
  type LoginData,
  loginSchema,
  type RegisterData,
  registerSchema,
} from './schema';
```

- `LoginView` dùng schema để validate và gọi API đăng nhập:

- `RegisterView` tương tự, dùng `registerSchema` và `register` API.

### Gợi ý thống nhất nhanh
- Mỗi `view/` có `index.ts` export named `XxxView`; route import từ `@/sections/<domain>/view`.
- Chuẩn hóa tên export `home/view/index.ts` để khớp với route (đang export `PostListView` trong khi route dùng `HomeView`).

- - -

- Đã tổng hợp cấu hình chung cho `sections` và ví dụ chi tiết cho `auth` (schema, view, route).
- Nếu bạn muốn, tôi có thể thêm/điều chỉnh các `index.ts` còn thiếu để chuẩn hóa import từ tất cả các section.