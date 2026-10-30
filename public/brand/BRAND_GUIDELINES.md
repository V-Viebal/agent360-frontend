# Skyer Brand Guidelines & Identity Kit

> **Skyer — Autonomous AI Teammates with persistent memory, terminal tools, and real execution environments.**

---

## 1. Logo Architecture

Biểu tượng của Skyer là **cối xoay gió 4 cánh bán nguyệt (Geometric Pinwheel)**:
- **Tượng trưng:** 4 nhân viên AI tự trị phối hợp nhịp nhàng, liên tục thúc đẩy công việc tiến lên.
- **Điểm nhấn thương hiệu:** 1 cánh giữ màu cam ấm (`#F8A87C`), 3 cánh còn lại giữ màu mực tương phản theo nền.
- **Chữ Skyer:** Sử dụng font Sans-serif trung tính, viết hoa chữ `S`, `font-weight: 600`, tracking khít `-0.04em`, cân giữa quang học (optical vertical center) với tâm trục của cánh xoay.

### Khoảng cách & Vùng an toàn (Clearspace)
- **Tỷ lệ khoảng cách:** Khoảng cách giữa Biểu tượng và Chữ là **4px** (tỷ lệ 1:8 so với chiều cao logo 32px).
- **Vùng đệm an toàn tối thiểu:** Bằng 1/2 chiều cao logo (`16px`) xung quanh mọi cạnh, không để các thành phần đồ họa hay văn bản khác xâm lấn.

---

## 2. Màu Sắc Thương Hiệu (Color Palette)

### Primary Brand Color
| Vai trò | Tên màu | HEX | RGB | HSL |
| :--- | :--- | :--- | :--- | :--- |
| **Accent Primary** | Skyer Ember / Pastel Orange | `#F8A87C` | `rgb(248, 168, 124)` | `hsl(21, 88%, 73%)` |
| **Primary Hover** | Deep Sunset | `#F27A54` | `rgb(242, 122, 84)` | `hsl(14, 86%, 64%)` |

### Neutral Colors (Dual Theme)
| Vai trò | Tên màu | HEX | Mô tả |
| :--- | :--- | :--- | :--- |
| **Light Surface** | Warm Cream | `#FFFDF9` | Nền canvas chủ đạo chế độ Light |
| **Light Secondary**| Sand Paper | `#F8F3ED` | Nền container phụ, card, dock |
| **Light Ink** | Charcoal Black | `#252522` | Chữ chính và 3 cánh logo trên nền sáng |
| **Light Border** | Sand Border | `rgba(37, 37, 34, 0.08)` | Đường viền mảnh siêu thanh lịch |
| **Dark Surface** | Deep Obsidian | `#0A0C13` / `#151513` | Nền canvas chế độ Dark |
| **Dark Ink** | Off-White Cream | `#FFFDF9` | Chữ chính và 3 cánh logo trên nền tối |

---

## 3. Font Chữ Chuẩn (Typography)

- **Primary Font:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Hệ quy chiếu:**
  - Tiêu đề & Logo: `font-semibold` (600), `letter-spacing: -0.04em`
  - Body: `font-normal` (400) / `font-medium` (500), `letter-spacing: -0.01em`
  - Code / Terminal / Badge: `JetBrains Mono`, `monospace`, `font-bold`

---

## 4. Danh mục File Tài nguyên (Brand Assets)

Các file vector chuẩn được lưu trữ sẵn trong thư mục `/brand/`:

1. `skyer-logo-horizontal.svg`: Logo hoàn chỉnh (Biểu tượng + Chữ Skyer), tự động đảo màu theo theme.
2. `skyer-logo-dark.svg`: Logo dùng trên nền sáng (Chữ than `#252522`).
3. `skyer-logo-light.svg`: Logo dùng trên nền tối (Chữ kem `#FFFDF9`).
4. `skyer-mark.svg`: Biểu tượng độc lập (Icon/Avatar/Favicon), tự đổi màu theo theme.
5. `skyer-mark-dark.svg`: Biểu tượng nền sáng.
6. `skyer-mark-light.svg`: Biểu tượng nền tối.
7. `skyer-mark-mono-black.svg`: Biểu tượng đơn sắc đen 100% (cho in ấn, khắc laser).
8. `skyer-mark-mono-white.svg`: Biểu tượng đơn sắc trắng 100%.

---

## 5. Quy tắc Sử dụng Logo (Do's and Don'ts)

### DO:
- Giữ nguyên tỷ lệ chiều rộng và chiều cao khi scale.
- Cho phép logo xoay nhẹ tối đa `30deg` khi hover với easing mượt mà.
- Ưu tiên sử dụng bản vector SVG để đảm bảo độ sắc nét trên mọi mật độ điểm ảnh (Retina / 4K).

### DON'T:
- Không kéo giãn (stretch) méo tỷ lệ logo.
- Không thay đổi màu cam `#F8A87C` sang màu khác khi không thuộc hệ thống màu được duyệt.
- Không áp dụng hiệu ứng đổ bóng dày, viền stroke thô hoặc 3D gradient lỗi thời.
