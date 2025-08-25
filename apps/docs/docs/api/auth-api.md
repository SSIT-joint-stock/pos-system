# Auth API Routes
---
## I. Manual
---
### 1. Đăng ký tài khoản
---
#### 1.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/register` |
| Request Method | POST |
| Request Header | Content-Type: application/json |
| Body data | JSON |

**JSON Schema**
```json
{
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```
#### 1.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| email           | string | ✓        | Email hợp lệ            |
| password        | string | ✓        | ≥ 6 ký tự               |
| confirmPassword | string | ✓        | Phải trùng với password |

#### 1.3. Dữ liệu đầu ra
**Success (200)**

```json
{
  "success": true,
  "meta": {
    "timestamp": "date",
    "version": "v1"
  },
  "data": {
    "user": {
      "id": "id",
      "email": "string",
      "username": "string",
      "isActive": true,
      "emailVerified": false,
      "firstName": null,
      "lastName": null,
      "avatar": null,
      "lastLoginAt": null,
      "createdAt": "date",
      "updatedAt": "date"
    }
  },
  "message": "Register successful"
}
```

**Error Response (400/401):**
```json
{
    "success": false,
    "error": {
        "code": "FORBIDDEN",
        "statusCode": 403,
        "message": "Tài khoản đã tồn tại"
    },
    "meta": {
        "timestamp": "2025-08-20T16:58:03.376Z",
        "version": "v1"
    }
}
```
### 2.Đăng nhập người dùng
---
#### 2.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/login` |
| Request Method | POST |
| Request Header | Content-Type: application/json |
| Body data | JSON |

**JSON Schema**
```json
{
  "usernameOrEmail": "string",
  "password": "string",
}
```
#### 2.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| email           | string | ✓        | Tên người dùng hoặc email là bắt buộc            |
| password        | string | ✓        | ≥ 6 ký tự               |

#### 2.3. Dữ liệu đầu ra
**Success (200)**

```json
{
    "success": true,
    "meta": {
        "timestamp": "date",
        "version": "v1"
    },
    "data": {
        "user": {
            "id": "string",
            "email": "string",
            "username": "string",
            "isActive": true,
            "emailVerified": true,
            "firstName": null,
            "lastName": null,
            "avatar": null,
            "lastLoginAt": null,
            "createdAt": "date",
            "updatedAt": "date"
        },
    },
    "message": "Login successful"
}
```

**Error Response (400/401):**
```json
{
    "success": false,
    "error": {
        "code": "BAD_REQUEST",
        "statusCode": 400,
        "message": "Email hoặc mật khẩu không chính xác"
    },
    "meta": {
        "timestamp": "2025-08-20T17:16:59.856Z",
        "version": "v1"
    }
}
```
### 3.Xác thực Email (Verify Code)
---
#### 3.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/verify-code?email=<user@example.com>` |
| Request Method | POST |
| Request Header | Content-Type: application/json |
| Body data | JSON |

**JSON Schema**
```json
{
  "email": "string",
  "verificationCode": "string",
}
```
#### 3.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| email           | string | ✓        | Email hợp lệ            |
| verificationcode        | string | ✓        | ≥ 4 ký tự               |

#### 3.3. Dữ liệu đầu ra
**Success (200)**

```json
{
    "success": true,
    "meta": {
        "timestamp": "date",
        "version": "v1"
    },
    "data": {
        "user": {
            "id": "string",
            "email": "string",
            "username": "string",
            "isActive": true,
            "emailVerified": true,
            "firstName": null,
            "lastName": null,
            "avatar": null,
            "lastLoginAt": null,
            "createdAt": "date",
            "updatedAt": "date"
        },
    },
    "message": "Verify code successful"
}
```

**Error Response (400/401):**
```json
{
    "success": false,
    "error": {
        "code": "BAD_REQUEST",
        "statusCode": 400,
        "message": "Mã OTP không đúng."
    },
    "meta": {
        "timestamp": "2025-08-21T03:02:31.931Z",
        "version": "v1"
    }
}
```

### 4.Gửi lại mã code
---
#### 4.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/resend-code` |
| Request Method | POST |
| Request Header | Content-Type: application/json |

**Body**

```json
{ "email": "string" }
```


#### 4.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| email           | string | ✓        | Email hợp lệ              |

#### 4.3. Dữ liệu đầu ra

**Success (200)**

```json
{
    "success": true,
    "meta": {
        "timestamp": "date",
        "version": "v1"
    },
    "data": {
        "user": {
            "id": "string",
            "email": "string",
            "username": "string",
            "isActive": true,
            "emailVerified": true,
            "firstName": null,
            "lastName": null,
            "avatar": null,
            "lastLoginAt": null,
            "createdAt": "date",
            "updatedAt": "date"
        },
    },
    "message": "Resend verification code successful" 
}
```

### 5.Xác thực Email (Verify by link)
---
#### 5.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/verify-code-by-email-link?token=<jwtToken>` |
| Request Method | GET |
| Request Header | Content-Type: application/json |

 - **Query**

```json
token: string
```

 - **Behavior**
   - Backend giải mã token, xác thực email.
   - Redirect về trang login FE.


#### 5.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| token           | string | ✓        | được gửi qua link email              |

#### 5.3. Dữ liệu đầu ra

**Success** -> redirect login FE

### 6.Quên mật khẩu
---
#### 6.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/forgot-password` |
| Request Method | POST |
| Request Header | Content-Type: application/json |

**Body**

```json
{ "email": "string" }
```

**JSON Schema**
```json
{
  "email": "string",
}
```
#### 6.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| email           | string | ✓        | Email hợp lệ            |

#### 6.3. Dữ liệu đầu ra
**Success (200)**

```json
{
    "success": true,
    "meta": {
        "timestamp": "date",
        "version": "v1"
    },
    "data": {
        "user": {
            "id": "string",
            "email": "string",
            "username": "string",
            "isActive": true,
            "emailVerified": true,
            "firstName": null,
            "lastName": null,
            "avatar": null,
            "lastLoginAt": null,
            "createdAt": "date",
            "updatedAt": "date"
        },
    },
    "message": "Forgot password email sent"
}
```

### 7.Đổi mật khẩu 
---
#### 7.1 Mô tả
| **Thuộc tính** | **Giá trị** |
|----------------|-------------|
| Request URL | `/api/v1/auth/reset-password?resetToken=<token>` |
| Request Method | POST |
| Request Header | Content-Type: application/json |

**Query**

```json
resetToken: string
```

**Body**

```json
{ "newPassword": "string" }
```

**JSON Schema**
```json
{
  "resetToken": "string",
  "newPassword": "string",
}
```
#### 7.2. Dữ liệu đầu vào
| Trường          | Kiểu   | Bắt buộc | Ghi chú                 |
| --------------- | ------ | -------- | ----------------------- |
| newPassword           | string | ✓        | ≥ 6 ký tự            |
| resetToken        | string | ✓        | ≥ 6 ký tự               |

#### 7.3. Dữ liệu đầu ra
**Success (200)**

```json
{
    "success": true,
    "meta": {
        "timestamp": "date",
        "version": "v1"
    },
    "data": {
        "user": {
            "id": "string",
            "email": "string",
            "username": "string",
            "isActive": true,
            "emailVerified": true,
            "firstName": null,
            "lastName": null,
            "avatar": null,
            "lastLoginAt": null,
            "createdAt": "date",
            "updatedAt": "date"
        },
    },
    "message": "Reset password successful"
}
```

### 8.Làm mới access token
---
#### 8.1 Mô tả

#### 8.2. Dữ liệu đầu vào

#### 8.3. Dữ liệu đầu ra

### 9.Đăng xuất
---
#### 9.1 Mô tả

#### 9.2. Dữ liệu đầu vào

#### 9.3. Dữ liệu đầu ra

## II. Oauth
---
# **Tk Minh làm oath với 8 9 ở trên**