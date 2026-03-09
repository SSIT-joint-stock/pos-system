# [Feature] F14: Reports Export System

## Goal

Cung cấp công cụ xuất dữ liệu báo cáo ra các định dạng phổ biến như Excel (.xlsx), PDF và CSV. Feature này phục vụ nhu cầu lưu trữ hồ sơ thuế, báo cáo nội bộ cho cổ đông và nhập liệu vào các phần mềm kế toán bên thứ ba.

---

## Features

- **Excel Export**: Xuất bảng kê chi tiết đơn hàng (Order List) với đầy đủ công thức tính toán.
- **PDF Reports**: Xuất báo cáo doanh thu đẹp mắt để in ấn hoặc nộp cho quản lý.
- **Schedule Reports**: Tự động gửi Email báo cáo tổng kết ngày vào lúc 23:30 (Optional).
- **Security**: Chỉ có Manager/Owner mới được quyền Export dữ liệu nhạy cảm.

---

## Technical Flow

```
User Click "Export" -> BE receives Filter (Date, Store) -> Data Query (Prisma)
-> Data Transformation (using ExcelJS/PDFKit) -> Binary Stream -> Browser Download
```

---

## Acceptance Criteria

- [ ] AC1: Tên file xuất ra có chứa Store Name và Ngày xuất.
- [ ] AC2: File Excel không bị lỗi font tiếng Việt.
- [ ] AC3: PDF xuất ra có Logo nhà hàng và chữ ký xác nhận (Placeholder).
- [ ] AC4: Quá trình Export dữ liệu lớn (1000+ orders) không timeout.

---

## Labels

`reports` `export` `sprint-4` `excel` `pdf`
