# MVP Project Brief: Retail POS System

## 1. Mục tiêu dự án
Xây dựng hệ thống quản lý

### MVP Success Criteria (Retail Domain):
- ✅ **User Management**: Người dùng có thể đăng ký, đăng nhập vào retail tenant
- ✅ **Retail Product Management**: Tạo, chỉnh sửa, xóa sản phẩm và categories cho retail
- ✅ **Retail Inventory**: Quản lý tồn kho với low-stock alerts cho retail products
- ✅ **Retail Invoicing**: Tạo và quản lý hóa đơn bán hàng (không cần restaurant features như table, menu)
- ✅ **Customer Management**: Quản lý thông tin khách hàng retail
- ✅ **Retail Reporting**: Báo cáo doanh thu, top products cho retail business
- ✅ **Tenant Isolation**: Dữ liệu của mỗi retail tenant hoàn toàn tách biệt
- ✅ **Subscription Management**: Quản lý subscription cho retail tenants
- ✅ **Responsive UI**: Giao diện retail-focused responsive desktop/mobile
- ✅ **POS Interface**: Giao diện bán hàng cho cashier (retail-specific)

### Tiêu chí kỹ thuật (Technical Criteria):
- ✅ **Multi-Domain Architecture**: Codebase structure sẵn sàng cho restaurant/pharmacy domains
- ✅ **Deployment**: System deploy thành công trên ssit.company
- ✅ **Performance**: Retail workflows hoạt động mượt mà
- ✅ **Security**: Multi-tenant security implementation

### Tiêu chí sẵn sàng sau MVP (Post-MVP Readiness):
- 🔄 **Restaurant Domain**: Architecture sẵn sàng để implement restaurant features
- 🔄 **Pharmacy Domain**: Database schema extensible cho pharmacy business
- 🔄 **Other Domains**: Core system support thêm business typesàng (POS) đa tenant **tập trung vào loại hình bán lẻ (Retail)** giúp các cửa hàng nhỏ có thể bán hàng, theo dõi kho, và tạo hóa đơn nhanh chóng mà không cần cài đặt phức tạp.

**Lưu ý**: Hệ thống được thiết kế với architecture multi-domain để có thể mở rộng cho các loại hình kinh doanh khác (restaurant, pharmacy, v.v.) trong tương lai, nhưng MVP này chỉ phát triển đầy đủ tính năng cho **bán lẻ**.

---

## 2. Đối tượng sử dụng (Target Users)
**Chỉ tập trung vào retail trong MVP:**
- Chủ cửa hàng bán lẻ (tạp hóa, shop quần áo, cửa hàng tiện lợi, v.v.)
- Nhân viên thu ngân cửa hàng bán lẻ
- Quản lý kho hàng bán lẻ

**Các loại hình khác sẽ được phát triển sau MVP:**
- Nhà hàng/quán ăn (restaurant domain)
- Hiệu thuốc/pharmacy
- Dịch vụ/service business

---

## 3. Phạm vi MVP (Scope)
Những tính năng **bắt buộc** phải có trong phiên bản MVP cho **Retail Domain**:

### Core Features (Retail-specific):
- Đăng ký / đăng nhập người dùng
- Tạo và chọn tenant (cửa hàng bán lẻ)
- Quản lý sản phẩm và danh mục sản phẩm (retail products)
- Quản lý tồn kho với alerts khi hết hàng
- Tạo hóa đơn bán hàng đơn giản (retail invoice)
- Quản lý khách hàng cơ bản
- Báo cáo doanh thu theo ngày/tháng cho retail
- Giao diện quản trị cho retail business
- Giao diện POS cơ bản cho cashier
- Subscription model cho retail tenants

### Technical Foundation (Multi-Domain Ready):
- Multi-tenant architecture với row-level isolation
- Domain service pattern (chỉ implement retail domain)
- Extensible database schema (sẵn sàng cho restaurant/other domains)
- Modular frontend structure (retail app hoàn chỉnh)

**Những tính năng KHÔNG nằm trong MVP:**
- Restaurant domain features (menu, table management, kitchen orders)
- Pharmacy domain features (prescription management, drug inventory)
- Service business features (appointment booking, service catalog)
- Chatbot hỗ trợ khách hàng
- Thanh toán online integration
- Mobile app native
- Advanced reporting & analytics
- Multi-location management

---

## 4. Nguyên tắc & ràng buộc    
- **Thời gian triển khai**: 4 tuần (MVP retail domain)
- **Tech Stack**: Next.js, Express, MongoDB, Prisma, Tailwind CSS, React
- **Architecture**: Multi-domain architecture (chỉ implement retail domain trong MVP)
- **Scalability**: Phải có khả năng mở rộng để thêm restaurant/pharmacy domains sau MVP
- **UI/UX**: Giao diện responsive cho desktop và mobile (retail-focused)
- **Multi-tenant**: Hỗ trợ đa tenant với mô hình row-level isolation
- **Containerization**: Phải chạy trên môi trường Docker
- **Deployment**: Deploy được lên domain ssit.company (retail.ssit.company)
- **Admin Interface**: Trang quản trị đơn giản cho retail management
- **Domain Separation**: Codebase structure sẵn sàng cho multiple domains nhưng chỉ build retail

### Chiến lược nghiệp vụ (Domain Strategy):
- **Core System**: Shared authentication, tenant management, subscription
- **Retail Domain**: Đầy đủ tính năng cho retail business
- **Future Domains**: Restaurant/Pharmacy domains sẽ được phát triển post-MVP với cùng architecture

---

## 5. Mốc thời gian (Milestones)
| Giai đoạn | Thời gian | Nội dung |
|----------|-----------|----------|
| **Phase 1** | Tuần 1 | **Foundation**: Auth + Multi-tenant + Subscription + Domain Architecture Setup |
| **Phase 2** | Tuần 2-3 | **Retail Core**: Product Management + Inventory + Retail Invoicing + Customer Management |
| **Phase 3** | Tuần 4 | **Retail Complete**: Reporting + POS Interface + Retail Admin Dashboard + Testing & Deploy |

### Chi tiết mốc thời gian (Timeline):
- **Tuần 1**: Core system + Domain structure (extensible cho restaurant/pharmacy)
- **Tuần 2-3**: Complete retail domain implementation
- **Tuần 4**: Retail-specific UI/UX + deployment


---

## 6. Định nghĩa “xong” (Definition of Done)
- Người dùng có thể đăng ký, tạo sản phẩm, xuất hóa đơn
- Người dùng có thể quản lý subscription cho tenant
- Dữ liệu của mỗi tenant phải tách biệt
- Có thể xem báo cáo doanh thu cơ bản
- Giao diện hiển thị mượt mà, tối thiểu responsive

---

## 7. Người liên quan (Stakeholders)
- Project Owner: Anh Kiên
- Product Manager: Dương
- Tech Lead: Du
- Dev Lead: Hữu Thành
- BA: Anh Dũng
