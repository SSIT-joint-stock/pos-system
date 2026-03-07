# [Feature] F11: Order Modifications

## Goal

Xử lý các tình huống nghiệp vụ phát sinh sau khi đã gửi Order xuống bếp, bao gồm: Thay đổi số lượng món, Hủy món đã gọi, Thêm món mới vào Bill hiện tại và Điều chỉnh các ghi chú. Feature đảm bảo sự đồng nhất dữ liệu giữa Bồi bàn (POS) và Đầu bếp (KDS).

---

## Business Problems Solved

```
❌ Vấn đề: Khách báo hủy cơm do chờ quá lâu nhưng đầu bếp vẫn nấu.
✅ Giải pháp: Nhân viên bấm "Hủy món" trên POS -> KDS nhận thông báo "VOID" ngay lập tức.

❌ Vấn đề: Thêm 1 bát phở vào bàn cũ nhưng POS tạo Bill mới riêng lẻ.
✅ Giải pháp: Chức năng "Edit Order" gộp món mới vào đúng mã đơn ORD hiện có.
```

---

## Scope

- **Bao gồm:**
  - Lịch sử chỉnh sửa đơn hàng (OrderModification model).
  - VOID Item: Hủy món với lý do cụ thể (Gửi thông báo tức thì tới KDS).
  - EDIT Quantity: Tăng/giảm số lượng (Xử lý chênh lệch tiền & thông báo bếp).
  - ADD Item to existing order: Thêm món vào Bill đang mở.
  - Logic phân quyền: Một số thay đổi cần mật khẩu Manager (VD: Hủy món đã chế biến).

---

## Data Model (Modification Log)

```prisma
model OrderModification {
  id              String   @id @default(uuid())
  order_id        String
  item_id         String?  // Reference to item modified

  type            ModificationType
  reason          String?
  quantity_prev   Int?
  quantity_new    Int?

  created_by      String   // user_id
  createdAt       DateTime @default(now())
}

enum ModificationType { ITEM_ADDED, ITEM_REMOVED, QTY_CHANGED, VOIDED }
```

---

## Acceptance Criteria

- [ ] AC1: Mọi thay đổi số lượng món ăn đều tự động tính toán lại Total Amount của đơn hàng.
- [ ] AC2: Khi hủy món (Void), hệ thống gửi Event WebSocket tới KDS với dải màu cảnh báo (Đỏ/Gạch chéo).
- [ ] AC3: Log lại chính xác ai là người thực hiện chỉnh sửa và lý do (VD: "Khách đổi ý").
- [ ] AC4: Không thể chỉnh sửa món khi đơn hàng đã `COMPLETED`.

---

## Labels

`operations` `order` `sprint-3` `audit-log`
