## Providers

Thư mục `providers` chứa các React Context Providers để chia sẻ state/dịch vụ dùng chung trên toàn ứng dụng (theme, auth, i18n, configs, cache...). Mỗi provider nên nhỏ gọn, tách biệt theo domain và dễ kết hợp (composition).

### Quy ước
- Mỗi provider nằm ở file riêng, tên dạng `<feature>-provider.tsx` và export:
  - `Context` (vd: `AppProviderContext`)
  - `Provider` (vd: `AppProvider`)
  - Hook truy cập (vd: `useAppProvider`)
- Ưu tiên named exports, tránh default nếu không cần.
- Provider dùng hooks (state, effect) phải là client component (cân nhắc thêm `"use client"`).
- Tránh nhồi quá nhiều trách nhiệm vào một provider; tách theo domain và lồng ghép ở “root providers”.

### Cách mở rộng `AppProvider`
```tsx
// apps/web/main/src/providers/app-provider.tsx (ví dụ mở rộng)
"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export interface AppProviderContextType {
  userId?: string;
  setUserId: (id?: string) => void;
}

export const AppProviderContext = createContext<AppProviderContextType | undefined>(undefined);

export const useAppProvider = () => {
  const context = useContext(AppProviderContext);
  if (!context) throw new Error("useAppProvider must be used within an AppProvider");
  return context;
};

export interface AppProviderProps { children: React.ReactNode }

export function AppProvider({ children }: AppProviderProps) {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const value = useMemo(() => ({ userId, setUserId }), [userId]);
  return <AppProviderContext.Provider value={value}>{children}</AppProviderContext.Provider>;
}
```

### Sử dụng
```tsx
// Root app/layout.tsx bọc ứng dụng bằng provider
import { AppProvider } from "@/providers/app-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
```

```tsx
// Bên trong component bất kỳ: truy cập context qua hook
import { useAppProvider } from "@/providers/app-provider";

export function ProfileButton() {
  const { userId, setUserId } = useAppProvider();
  return <button onClick={() => setUserId("u_123")}>{userId ?? "Set User"}</button>;
}
```

### Tổ chức nhiều provider (composition)
```tsx
// providers/root-providers.tsx
import { AppProvider } from "@/providers/app-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { I18nProvider } from "@/providers/i18n-provider";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppProvider>{children}</AppProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
```

### Best practices
- Tuân thủ React hooks rules; giữ state càng gần nơi dùng càng tốt.
- Memo hóa `value` của provider bằng `useMemo` để tránh re-render không cần thiết.
- Tách nhỏ providers theo domain; dễ thay thế/test.
- Hook `useXxxProvider` nên throw error khi dùng ngoài provider để fail-fast.
- Không đưa logic nặng (fetch liên tục, tính toán lớn) vào provider; chuyển sang services hoặc hooks riêng.

### Testing nhanh
```tsx
// test-utils.tsx
import { render } from "@testing-library/react";
import { AppProvider } from "@/providers/app-provider";

export const renderWithProviders = (ui: React.ReactElement) =>
  render(<AppProvider>{ui}</AppProvider>);
```


