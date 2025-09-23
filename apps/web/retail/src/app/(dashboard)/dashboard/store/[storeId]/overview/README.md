# 📊 Dashboard Module Documentation

## 1. Giới thiệu
Module `Dashboard` cung cấp giao diện tổng quan số liệu kinh doanh: doanh thu, lợi nhuận, nhập hàng, biểu đồ trực quan và thông báo.  
Được xây dựng bằng **React + TailwindCSS + Mantine Charts**, với các component tái sử dụng:

- `DashboardView` → giao diện chính.  
- `ItemBoxChart` → ô hiển thị chỉ số.  
- `ItemNoti` → mục thông báo.  
- `LineChart` → biểu đồ đường.  
- `PieChart` → biểu đồ tròn.  
- `SlidingTabs` → chọn chế độ hiển thị (ngày/tuần/tháng).  

---

## 2. Cấu trúc tổng quan

DashboardView
├── ItemBoxChart (nhiều lần)
├── LineChart
│ └── SlidingTabs (chuyển dữ liệu Ngày / Tuần / Tháng)
├── PieChart
└── ItemNoti (nhiều lần)
---

## 3. Chi tiết các thành phần

### 🔹 3.1. ItemBoxChart

**Mục đích**: Hiển thị một chỉ số kinh doanh (doanh thu, nhập hàng, lợi nhuận...).  

**Props**:
- `title?: string` → tên chỉ số.  
- `value?: number` → giá trị (VND).  
- `percent?: number` → % thay đổi so với kỳ trước.  

**Tính toán giá trị**:
- Nếu `value >= 1_000_000_000` → hiển thị `X Tỷ`.  
- Nếu `value >= 1_000_000` → hiển thị `X Triệu`.  
- Nếu `value >= 1_000` → hiển thị `X K`.  
- Ngược lại → hiển thị số gốc.  

```ts
function formatNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + " Tỷ";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + " Triệu";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}
Ví dụ:

500_000_000 → 500 Triệu.

2_000_000_000 → 2 Tỷ.

### 🔹 3.1. ItemBoxChart

Mục đích: Hiển thị thông báo dạng timeline.

Props:

isFirst?: boolean → vẽ line trên/dưới cho item đầu tiên.

isLast?: boolean → vẽ line cho item cuối cùng.

Thuộc tính mặc định:

const notification = [
  { title: "600 thùng Cocacola đã được nhập...", time: 5 },
];


Cách hiển thị:

Vẽ line dọc màu xanh bg-pos-blue-700.

Gắn node tròn (border-pos-blue-700) để biểu thị sự kiện.

Dữ liệu thời gian: time phút trước.

### 🔹 3.3. LineChart


### 🔹 3.4. SlidingTabs

Mục đích: Cho phép người dùng chọn dữ liệu theo Ngày, Tuần, Tháng.

Dữ liệu mẫu:

data1 (Ngày)

data2 (Tuần)

data3 (Tháng)

Cơ chế hoạt động:

Khi click tab → gọi setState(item.data) để thay đổi dữ liệu LineChart.

Có indicator (thanh nền trắng) chạy trượt theo tab hiện tại.

### 🔹 3.5. PieChart

Mục đích: Hiển thị phân bổ doanh thu theo ngành hàng.

Dữ liệu mẫu:

const data = [
  { name: "Đồ ăn", value: 400 },
  { name: "Đồ uống", value: 300 },
  { name: "Đồ cá nhân và gia dụng", value: 100 },
  { name: "Thực phẩm đông lạnh", value: 200 },
  { name: "Thuốc lá", value: 200 },
  { name: "Khác", value: 160 },
];


Cách tính toán:

Tổng doanh thu:

const total = data.reduce((sum, item) => sum + item.value, 0);


Tính % cho từng ngành:

(item.value * 100) / total


Ví dụ: nếu tổng = 1360, thì Đồ ăn (400) → 29%.

Gán màu từ pieChartColors cho từng mục để phân biệt.

UI:

Bên trái: danh sách legend (Tên - %).

Bên phải: Biểu đồ tròn DonutChart.