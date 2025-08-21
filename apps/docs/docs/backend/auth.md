---

id: auth
slug: /backend/auth
title: Xác thực & Ủy quyền (Auth)
sidebar\_label: Auth
--------------------

> Tài liệu dành cho module Auth của dự án **POS System**. Viết theo phong cách Docusaurus, có thể đặt tại `docs/backend/auth.md`.

## Mục tiêu

* Chuẩn hóa các **luồng xác thực** (manual & OAuth)
* Định nghĩa **API endpoints** + **payload** + **response**
* Quy ước **bảo mật** (JWT, cookie, rate limit, lockout)
* Cách **cấu hình**, **logging**, **email** & **khôi phục mật khẩu**

---

## Kiến trúc tổng quan

```text
┌─────────────────────────────────────────────────────────────┐
│                    POS Backend (Express)                    │
│                                                             │
│  Controllers        Services/Strategies         Repos       │
│  ───────────        ────────────────────        ─────       │
│  - ManualAuthCtrl → ManualStrategy      → UserRepository    │
│  - OAuthAuthCtrl  → OAuthStrategy       → TenantRepository  │
│                                                             │
│  Utility/Infra:                                             │
│   - Zod validation                                          │
│   - JWT utils (access / refresh / verify)                   │
│   - EmailQueueService (Redis/Bull, Singleton)               │
│   - Prisma (MongoDB)                                        │
│   - Config (.env)                                           │
│   - Logger (context logger, requestId)                      │
└─────────────────────────────────────────────────────────────┘
```

**Pattern chính:** 
- **Strategy**  
  Manual vs OAuth (đăng ký/đăng nhập khác nhau nhưng cùng một interface).

- **Factory**  
  `AuthStrategyFactory` tạo strategy theo provider (manual hoặc oauth).

- **Template Method**  
  `BaseController.handle()/execute()` chịu trách nhiệm điều phối luồng xử lý; subclasses chỉ cần implement các handler cụ thể.

- **Singleton**  
  `EmailServiceSingleton` dùng để tái sử dụng kết nối queue (EmailQueueService), tránh tạo nhiều kết nối dư thừa.

### Lược đồ User (Prisma / MongoDB)

```prisma
model User {
  id                String       @id @default(auto()) @map("_id") @db.ObjectId
  email             String       @unique
  username          String       @unique
  passwordHash      String? // BCrypt hashed password
  provider          UserProvider @default(LOCAL)
  firstName         String?
  lastName          String?
  phone             String?
  avatar            String?
  isActive          Boolean      @default(true)
  emailVerified     Boolean      @default(false)
  lastLoginAt       DateTime?
  passwordChangedAt DateTime?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  //opt
  verificationCode        String?
  verificationCodeExpired DateTime?
  resetToken              String?

  // Relationships
  userTenants  UserTenant[] // User có thể thuộc nhiều tenants
  ownedTenants Tenant[] // Tenants mà user này là owner  
  createdSales Sale[] // Sales được tạo bởi user này

  @@map("users")
}

enum UserProvider {
  LOCAL // Local
  EMAIL // Email
  GOOGLE // Google
  FACEBOOK // Facebook
  APPLE // Apple
}
```

---

## Luồng nghiệp vụ

### 1) Đăng ký (Manual)

1. **Request**  
   - Endpoint: `POST /auth/register` 
   - Body: `{ "email": "string", "password": "string", "confirmPassword": "string" }`
2. **Xử lý Backend**  
   - Sinh **OTP** (6 chữ số) kèm thời hạn (mặc định `5 phút`)  
   - Sinh token xác thực email `emailVerifyToken` và build link verify.
   - Lưu vào DB:  
     - `verificationCode`  
     - `verificationCodeExpired`  
   - Đưa email vào hàng đợi, gửi **OTP** và **link xác thực**
3. **Response**  
   - `201 Created`  
   - Trả về thông tin user (ẩn password)

---

### 2) Xác thực Email

#### 2.1 Qua OTP

1. **Request**  
   - Endpoint: `POST /auth/verify-code`  
   - Query params: `email: string`
   - Body: `{ "email": "string", "verificationCode": "string" }`
2. **Xử lý Backend**  
   - Kiểm tra OTP còn hiệu lực  
   - Nếu hợp lệ → cập nhật `emailVerified = true` và xoá OTP
3. **Response**  
   - `200 OK`  
   - `{ "message": "Verify code successful" }`

#### 2.2 Qua Link Verify

1. **Request**  
   - Endpoint: `GET /auth/verify-code-by-email-link?token=<jwtToken>`  
2. **Xử lý Backend**  
   - Giải mã token → lấy `email`
   - Nếu hợp lệ & chưa verify → cập nhật `emailVerified = true`
   - Redirect về trang login FE.

#### 2.3 Gửi lại OTP

1. **Request**  
   - Endpoint: `POST /auth/resend-code`  
   - Query params: `email: string`
2. **Xử lý Backend**  
   - Sinh OTP mới + link verify.
   - Chặn spam: tối thiểu 5 giây giữa 2 lần gửi.
   - Gửi email.
3. **Response**  
   - `200 OK`  
   - `{ "message": "Verify code successful" }`

---

### 3) Đăng nhập (Manual)

1. **Request**  
   - `POST /auth/login`  
   - Body: `{ "usernameOrEmail": "string", "password": "string" }`
2. **Điều kiện**  
   - `emailVerified === true`  
   - `isActive === true`
3. **Response**  
   - `200 OK`  
   - Header: `Authorization: Bearer <accessToken>`
   - Cookie: `refreshToken (HttpOnly, SameSite=Strict)`
   - Body: `{ user, accessToken, refreshToken }`

---

### 4) Đăng nhập qua OAuth2 (Google/GitHub)

1. **Init**  
   - `POST /auth/oauth/init`  
   - Backend trả URL ủy quyền đến provider
2. **Callback**  
   - `POST /auth/oauth/callback`  
   - Đổi `code` lấy profile từ provider  
   - Tìm hoặc tạo user trong DB  
   - Phát hành access token + refresh token

---

### 5) Refresh Token & Logout

- **POST /auth/refresh**  
  - Dùng refresh token hợp lệ để cấp access token mới  

- **POST /auth/logout**  
  - Thu hồi refresh token (server lưu blacklist/rotate token)  
  - Xoá cookie refresh trên client

---

### 6) Quên mật khẩu & Đặt lại

1. **Khởi tạo**  
   - Endpoint: `POST /auth/forgot-password` 
   - Body với `{ email }`  
   - Gửi email chứa OTP + link đặt lại `/auth/reset-password?resetToken=...`
2. **Xác thực OTP**  
   - Endpoint: `POST /auth/reset-password` 
   - Body: `{ "newPassword": "string", "resetToken": "string" }`  
   - Kiểm tra `resetToken`, hash mật khẩu mới, cập nhật DB.

---

## API chi tiết

> Prefix mặc định: `/auth`

### POST `/register`

**Body**

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

**Responses**

* `201 Created`

```json
{
  "success": true,
  "message": "Register successful. Please verify email.",
  "data": { "userId": "..." }
}
```

* `409 Conflict` (email tồn tại)
* `400 Bad Request` (không qua Zod)

### POST `/verify-code?email=<user@example.com>`

**Query**

```json
email: string
```

**Body**

```json
{ "verificationCode": "123456" }
```

**200 OK**

```json
{ "success": true, "message": "Verify code successful" }
```

### GET `/verify-code-by-email-link?token=<jwtToken>`
 - **Behavior**
   - Backend giải mã token, xác thực email.
   - Redirect về trang login FE.

### POST `/resend-code`

**Body**

```json
{ "email": "user@example.com" }
```

**200 OK**

```json
{ "success": true, "message": "Resend verification code successful" }
```

### POST `/login`

**Body**

```json
{ "usernameOrEmail": "john", "password": "secret123" }
```

**200 OK**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "expiresIn": 900
  }
}
```
Refresh token được trả qua cookie:
`HttpOnly; Secure; SameSite=Strict`

### POST `/oauth/init`

**Body**

```json
{ "provider": "google", "redirectUri": "https://app.example.com/oauth/callback" }
```

**200 OK**

```json
{ "url": "https://accounts.google.com/o/oauth2/v2/auth?..." }
```

### POST `/oauth/callback`

**Body**

```json
{ "provider": "google", "code": "<auth_code>", "redirectUri": "..." }
```

**200 OK** (giống `/login`)

### POST `/refresh`

**Headers**: Cookie `refreshToken=<jwt>`

**200 OK**

```json
{
  "success": true,
  "data": {
    "accessToken": "<new-jwt>",
    "expiresIn": 900
  }
}
```

### POST `/logout`

 - ⚠️ Hiện tại chưa có route /logout trong code.
 - Nếu bổ sung, cần:

 - Xóa cookie refresh ở client.

 - Thu hồi refresh token server-side (blacklist/rotate).

 - Trả 204 No Content.

### POST `/forgot-password`

**Body**

```json
{ "email": "user@example.com" }
```

**202 Accepted** 

```json
{
  "success": true,
  "message": "Forgot password email sent"
}
```

### POST `/reset-password`

**Query**

```
resetToken: "..."
```

**Body**

```json
{ "newPassword": "NewSecret!"}
```

**200 OK**

---

## Validation (Zod)

```ts
export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().min(4),
});

export const reSendVerificationCodeSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
  resetToken: z.string().min(10),
});

export const businessSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  taxCode: z.string().min(1),
});
```

---

## Bảo mật

- **Hash mật khẩu**
  - Sử dụng **Bcrypt** với `saltRounds >= 10`.
  - Không lưu plaintext, chỉ lưu `passwordHash`.

- **JWT Tokens**
  - **Access Token**: TTL mặc định ~`15m`.
    - Lưu ở memory (SPA) hoặc `HttpOnly Cookie` (SSR).
  - **Refresh Token**: TTL `7–30 ngày`.
    - Bắt buộc lưu dưới dạng `HttpOnly Cookie` (`Secure`, `SameSite=Strict`).
  - Payload nên có: `aud`, `iss`, `sub`, `iat`, `exp`.
  - **Logout**: thu hồi bằng **rotate** hoặc **blacklist** refresh token.

- **CORS**
  - Chỉ cho phép **whitelist origin**.
  - Bật `credentials: true`.
  - Giới hạn headers ở mức cần thiết (`Authorization`, `Content-Type`, …).

- **Rate limiting**
  - Áp dụng cho các route nhạy cảm:
    - `/register`
    - `/login`
    - `/verify-code`
    - `/forgot-password`
  - Kết hợp theo **IP + email**.

- **Account lockout**
  - Khóa tạm thời (VD: 5–15 phút) sau **N lần nhập sai OTP hoặc mật khẩu** liên tiếp.
  - Giảm nguy cơ brute-force.

- **Email verification**
  - Với provider `LOCAL` → bắt buộc xác thực email trước khi login.
  - OTP và link verify có thời hạn (`5 phút` OTP, JWT verify token theo config).

- **Logging & Observability**
  - Không log secret, OTP, token thô.
  - Dùng **requestId**/context logger để trace request.
  - Log mức `info/warn/error`, có thể đẩy về Loki/ELK stack.

---

## Email & OTP

- **Sinh OTP**
  - Sử dụng:
    ```ts
    Math.floor(100000 + Math.random() * 900000).toString()
    ```
  - Thời hạn mặc định: **5 phút** (configurable qua `CreateCodeUtils`).

- **Nội dung email**
  - Bao gồm **OTP** và **link verify** (JWT token ký riêng cho verify).
  - Link verify được build dạng:
    ```
    https://app.example.com/verify?token=<jwtToken>
    ```
  - Ngoài OTP, email còn kèm link để user click → tự động xác thực.

- **Ví dụ template (rút gọn)**

  ```html
  <h3>Xác thực email</h3>
  <p>Mã OTP của bạn: <strong>{{otp}}</strong> (hết hạn trong {{expiry}} phút)</p>
  <p>Hoặc bấm vào <a href="{{verifyUrl}}">đây</a> để xác thực tự động.</p>

**Hàng đợi email**: 
 - Sử dụng `EmailQueueService` (Redis/Bull).

 - Quản lý qua Singleton pattern (`EmailServiceSingleton`) để tái sử dụng kết nối.

 - Đảm bảo email được gửi async, retry khi lỗi, và tránh chặn request chính.

---

## Environment Variables (ví dụ)

```bash
# App
SERVER_PORT=8080
BASE_URL=http://localhost:8080

# JWT
JWT_ACCESS_SECRET=xxx
JWT_REFRESH_SECRET=yyy
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password
EMAIL_NOTI=notify@yourdomain.com

# Redis (email queue)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
OAUTH_REDIRECT_URI=https://app.example.com/oauth/callback
```

---

## Ví dụ cURL

```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@a.com","password":"secret","confirmPassword":"secret"}'

# Verify code (email ở query param, code trong body)
curl -X POST "http://localhost:8080/auth/verify-code?email=a@a.com" \
  -H 'Content-Type: application/json' \
  -d '{"verificationCode":"123456"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"usernameOrEmail":"a@a.com","password":"secret"}'
```

---

## Xử lý lỗi & chuẩn phản hồi

### Cấu trúc `ApiResponse<T>`

```ts
interface ApiResponse<T> {
  success: boolean;          // thành công hay thất bại
  message?: string;          // thông điệp mô tả
  data?: T;                  // dữ liệu trả về khi success
  error?: {
    code: string;            // mã lỗi (định danh duy nhất)
    details?: any;           // thông tin bổ sung (optional)
    nextAction?: string;     // gợi ý bước tiếp theo cho client
  };
}
```

### Ví dụ thành công

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "expiresIn": 900
  }
}
```

### Ví dụ lỗi
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_ACTIVE",
    "details": "Email chưa xác thực",
    "nextAction": "VERIFY_EMAIL"
  }
}
```
>⚡ Khi gặp lỗi USER_NOT_ACTIVE, frontend nên chuyển hướng sang trang Verify Email và tự động điền sẵn email (nếu đã có trong context).

---

## FAQ / Lỗi thường gặp

* **`Type 'string | undefined' is not assignable to type 'string'`** khi lấy `req.query.email`:

  * Ép kiểu an toàn: `const email = String(req.query.email ?? '')`
  * Hoặc parse bằng Zod từ `req.query`.

* **`encodeURIComponent` dùng để làm gì?**

  * Mã hóa `email`, `redirectUri`… khi đưa vào query string link verify/OAuth.

* **Refresh token lưu ở đâu?**

  * **Cookie HttpOnly**. Nếu cần đa thiết bị, lưu kèm `deviceId` + bảng `UserToken` để thu hồi riêng lẻ.

* **Atomic cập nhật verify**

  * Có thể dùng một lệnh `update` với điều kiện `email`, `verificationCode`, và `verificationCodeExpired > now()` để đảm bảo một lần ghi; tuy nhiên, trong code hiện tại bạn đang so sánh và cập nhật tuần tự bên trong service/strategy (vẫn OK).

---

## Kiểm thử

- Tạo **Postman Collection** cho tất cả endpoint:
  - `/register`
  - `/verify-code`
  - `/resend-code`
  - `/login`
  - `/refresh`
  - `/forgot-password`
  - `/reset-password`
  - `/oauth/*`

- Mock email bằng **Ethereal Email** hoặc **MailHog** khi dev để kiểm tra OTP và link verify.

- **E2E Flow tối thiểu**:
  1. Register → nhận email
  2. Verify (OTP hoặc link)
  3. Login → nhận access/refresh
  4. Refresh
  5. Forgot → Reset
  6. (Tuỳ chọn) OAuth init/callback
---