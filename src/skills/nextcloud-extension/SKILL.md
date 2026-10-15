---
name: agent360-nextcloud-extension
status: active
owner: agent360-core
description: Hướng dẫn chi tiết cách đóng gói, tích hợp sâu và triển khai Agent360 Workspace dưới dạng một ứng dụng Native Extension trong Nextcloud.
---

# Agent360 Nextcloud Extension Integration Skill

Skill này định nghĩa chuẩn mực kiến trúc, quy trình đóng gói và hướng dẫn tích hợp sâu giao diện **Agent360 GrokBot Workspace** vào hệ sinh thái Nextcloud.

---

## 1. Kiến trúc Tích hợp (Nextcloud Native App Architecture)

Nextcloud hỗ trợ tích hợp ứng dụng SPA/React thông qua **Nextcloud App Framework**:

```text
projects/agent360/nextcloud-app/
├── agent360/
│   ├── appinfo/
│   │   ├── info.xml            # Khai báo App ID, version, dependencies (NC 28-33), icon navigation
│   │   └── routes.php          # Định nghĩa URL routing cho Web UI & API Proxy
│   ├── lib/
│   │   ├── AppInfo/
│   │   │   └── Application.php # Bootstrap class kế thừa OCP\AppFramework\App
│   │   └── Controller/
│   │       ├── PageController.php # Render template nhúng SPA, inject CSS/JS bundles
│   │       └── ApiController.php  # Reverse proxy an toàn về Agent360 Backend (ACP/QwenPaw)
│   ├── templates/
│   │   └── index.php           # Canvas HTML gắn thẻ `<div id="root">` đón React runtime
│   ├── css/
│   │   └── agent360.css        # Khắc phục layout, chiếm full height trừ topbar Nextcloud
│   ├── js/
│   │   └── agent360.js         # Single-bundle JavaScript của React frontend
│   └── img/
│       └── app.svg             # Icon nhận diện trên thanh top navigation Nextcloud
├── dist/
│   ├── agent360-1.0.0.tar.gz   # Gói release hoàn chỉnh sẵn sàng nạp qua `occ`
│   └── agent360-1.0.0.tar.gz.sha256
└── package.sh                  # Script đóng gói tự động hóa
```

---

## 2. Các bước Triển khai vào Nextcloud (Deployment Runbook)

### Bước 1: Build Frontend Bundle
Tại thư mục `projects/agent360/frontend`:
```bash
# Đảm bảo frontend đã build các file JS/CSS vào dist/
npm run build
```

### Bước 2: Đóng gói Extension
Chạy script đóng gói tại thư mục `projects/agent360/nextcloud-app`:
```bash
./package.sh
```
Kết quả sẽ tạo ra file lưu trữ chuẩn `agent360-1.0.0.tar.gz` kèm mã băm SHA-256.

### Bước 3: Triển khai vào thư mục Apps của Nextcloud Instance
Khi đưa vào máy chủ Nextcloud (ví dụ Nextcloud tại VPS hoặc Docker container):

1. **Copy thư mục app vào Nextcloud:**
   ```bash
   # Nếu dùng Docker Nextcloud
   docker cp projects/agent360/nextcloud-app/agent360 nextcloud_app:/var/www/html/apps/
   
   # Hoặc giải nén từ tarball
   tar -xzf agent360-1.0.0.tar.gz -C /var/www/html/apps/
   ```

2. **Thiết lập quyền sở hữu web server:**
   ```bash
   chown -R www-data:www-data /var/www/html/apps/agent360
   ```

3. **Kích hoạt ứng dụng bằng `occ`:**
   ```bash
   sudo -u www-data php /var/www/html/occ app:enable agent360
   ```

4. **Cấu hình Backend Endpoint (nếu có custom gateway):**
   ```bash
   sudo -u www-data php /var/www/html/occ config:app:set agent360 backend_url --value="https://ai.hmz.one"
   ```

---

## 3. Các đặc tính tích hợp sâu (Deep Integration Features)

1. **Top Navigation App Bar:** Icon `Agent360` hiển thị trực tiếp trên thanh menu chính của Nextcloud cùng với Files, Talk, Deck.
2. **Context & Identity Sharing:** Ứng dụng đọc trực tiếp ID người dùng Nextcloud (`$this->userSession->getUser()->getUID()`) truyền vào React qua `data-user-id` để gán đúng quyền và lịch sử chat của từng user.
3. **Session & Security Boundary:** Sử dụng CSRF Token và Auth Cookie của Nextcloud cho các request proxy; không cần đăng nhập lại khi người dùng đã có phiên Nextcloud hợp lệ.
4. **Seamless Dark Aesthetics:** Container `#agent360-root` tự động khớp chiều cao `calc(100vh - 50px)`, loại bỏ scroll thừa và thanh margin của Nextcloud, đem lại trải nghiệm workspace như desktop app độc lập.

---

## 4. Tích hợp Dạng Widget & Bot Assists Overlay Sidebar (Tất cả màn hình Nextcloud)

Ngoài chế độ Full Page App độc lập, extension `agent360` hỗ trợ 2 chế độ nhúng sâu trực tiếp vào toàn bộ trải nghiệm Nextcloud:

### 4.1. Bot Assists Overlay Sidebar (Floating Action Button + Slide-out Drawer)
- **Cơ chế Hook:** Lắng nghe sự kiện `BeforeTemplateRenderedEvent` trong `lib/Listener/LoadSidebarOverlayListener.php`.
- **Hành vi trên UI:**
  - Nút tròn nổi (Floating Action Button) màu cam góc dưới cùng bên phải (`#agent360-fab-trigger`) hiển thị trên **mọi màn hình Nextcloud** (Files, Deck, Talk, Calendar, v.v.).
  - Khi click vào nút (hoặc bấm phím `Escape`/`Ctrl+Space`), một **Overlay Drawer Sidebar** rộng 480px trượt ra từ cạnh phải với hiệu ứng mượt mà.
  - Người dùng có thể vừa làm việc với tài liệu, bảng Kanban Deck hoặc chat Talk, vừa ra lệnh cho các Agent360 (SWE, SRE, QA, Research) song song mà không cần rời khỏi trang hiện tại.

### 4.2. Nextcloud Dashboard Widget (`Agent360Widget`)
- **Cơ chế Hook:** Đăng ký `$context->registerDashboardWidget(Agent360Widget::class)` trong `Application::register`.
- **Hành vi trên UI:**
  - Hiển thị widget trạng thái của Agent360 ngay trên trang chủ Dashboard của Nextcloud.
  - Cho biết trạng thái fleet (Running / HTTP 200), nút `Mở Workspace` và nút `Chat nhanh` (kích hoạt mở ngay Overlay Sidebar).

---

## 5. Kiến trúc Chuyển đổi Trạng thái Kép (Dual-State Widget & Right Sidebar)

Để tối ưu hóa diện tích hiển thị và tính đa nhiệm của người dùng khi làm việc trên Nextcloud, extension hỗ trợ 2 chế độ hiển thị linh hoạt được điều khiển qua nút toggle trên thanh header:

```text
[Mặc định khi click FAB] 
       ↓ 
[Chế độ 1: Widget Mở Nhỏ (Compact Floating Popover)]
- Kích thước: 400px x 580px (bo góc 18px, nổi ở góc dưới phải)
- Mục đích: Hỏi đáp nhanh, tra cứu mã, không chiếm che khuất tài liệu/bảng làm việc chính.
       ↓ (Click nút Maximize trên Control Bar)
[Chế độ 2: Right Sidebar Docking (Expanded)]
- Kích thước: Width 520px, Height 100vh (neo trực tiếp toàn bộ cạnh phải Nextcloud)
- Mục đích: Không gian làm việc sâu, theo dõi stream logs, xem chi tiết file code hoặc danh sách Agent fleet.
```

- **CSS Classes áp dụng:**
  - `mode-compact`: `bottom: 84px; right: 24px; width: 400px; height: 580px; border-radius: 18px;`
  - `mode-sidebar`: `top: 0; right: 0; bottom: 0; height: 100vh; width: 520px; border-radius: 0; border-left: 1px solid #22222e;`
  - Chuyển động mượt mà với `cubic-bezier(0.16, 1, 0.3, 1)`.
