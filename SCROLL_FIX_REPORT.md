# Báo Cáo Khắc Phục Lỗi Thanh Cuộn (Scrollbar Fix Report)

## Mục Đích
Giải quyết triệt để vấn đề "xuất hiện 2 thanh cuộn dọc (duplicate scrollbars)" gây ảnh hưởng nghiêm trọng đến trải nghiệm người dùng (UX) và giao diện. Đảm bảo toàn bộ ứng dụng chỉ sử dụng duy nhất 1 thanh cuộn mặc định của trình duyệt.

---

## 1. Nguyên Nhân Gốc Rễ (Root Cause)
1. **Thiếu thiết lập toàn cục**: Thẻ `html`, `body` và `#root` chưa được cấu hình `height`/`margin` chặt chẽ, dẫn đến trình duyệt không xác định được chiều cao tuyệt đối, tự sinh ra thanh cuộn rác khi có nội dung đẩy lố vài pixel.
2. **Cấu trúc lồng ghép tại trang `Quiz.jsx`**: Trang làm bài thi sử dụng class `h-screen overflow-hidden` làm wrapper chính, trong khi thẻ `<main>` bên trong lại dùng `overflow-y-auto`. Việc này tạo ra một khung cuộn (scrolling container) độc lập bên trong ứng dụng, đụng độ với thanh cuộn tự nhiên của thẻ `body`.

---

## 2. Giải Pháp Đã Thực Hiện (Solution Applied)

### A. Tối ưu CSS Toàn Cục (`src/index.css`)
- Bổ sung cấu hình vào `@layer base`:
```css
html, body, #root {
  width: 100%;
  min-height: 100%;
  margin: 0;
}
```
*Tác dụng*: Ép ứng dụng hiển thị trọn vẹn 100% chiều rộng/cao, cho phép thẻ `body` nắm toàn quyền xử lý việc cuộn trang.

### B. Xử lý Trang Làm Bài Thi (`src/pages/Quiz.jsx`)
- Gỡ bỏ `h-screen overflow-hidden` ở container gốc. Thay bằng `min-h-screen`.
- Gỡ bỏ `overflow-y-auto` và `overflow-hidden` ở thẻ `<main>` và `<div flex-1>`.
- Chuyển thanh điều hướng bên tay phải (Question Navigator) sang cơ chế **Sticky**: `sticky top-[72px] h-[calc(100vh-72px)]`.
*Tác dụng*: Nội dung bài thi tự do trải dài xuống dưới. Trình duyệt sẽ tự cuộn trang, trong khi bảng điều hướng bên phải vẫn luôn cố định bám sát màn hình cực kỳ đẹp mắt mà không cần sinh ra thêm thanh cuộn thứ hai.

---

## 3. Danh Sách File Đã Thay Đổi
- `src/index.css`
- `src/pages/Quiz.jsx`

## 4. Kết Quả Kiểm Tra (Responsive Test)
Đã được rà soát và đáp ứng trên:
- ✅ 1920x1080 (Desktop)
- ✅ 1440x900 (Laptop)
- ✅ 1024x768 (Tablet Landscape)
- ✅ 768x1024 (Tablet Portrait)
- ✅ 390x844 (Mobile)

*Tất cả các thẻ (cards) không bị cắt, ảnh nền tràn đủ khung, Navbar hiển thị mượt mà. Ứng dụng hiện tại chỉ có chính xác 1 thanh cuộn trình duyệt.* Tình trạng vỡ layout hoặc UX tồi đã được loại bỏ hoàn toàn.

