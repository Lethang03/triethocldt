# Báo Cáo Debug & Sửa Lỗi Thanh Cuộn (Scrollbar Debug Report)

## 1. Nguyên Nhân Gốc Rễ (Root Cause)
Đã phát hiện 3 nguyên nhân chính gây ra lỗi hiển thị thanh cuộn bất thường trên toàn bộ hệ thống:
1. **Custom Webkit Scrollbar Track cứng ngắc**: Lỗi thanh cuộn "lúc nào cũng hiện dù không cần thiết" phát sinh từ CSS Custom Scrollbar (`::-webkit-scrollbar-track`). Việc set màu nền cố định (`#071426`) khiến rãnh thanh cuộn (gutter) luôn được vẽ ra trên trình duyệt Webkit (Chrome/Edge) ngay cả khi nội dung trang web đã vừa khít 100vh và không bị tràn. 
2. **Sticky panel bị đứt quãng**: Trong bản fix trước, khối Aside (điều hướng) của trang Quiz được đưa về dạng `sticky` nhưng thiếu độ co giãn linh hoạt khi danh sách câu hỏi quá dài, gián tiếp tạo cảm giác bị kẹt thanh cuộn bên phải.
3. **Nguy cơ tràn ngang (Horizontal Overflow)**: Việc set `width: 100%` trên thẻ `html, body` kết hợp cùng thanh cuộn dọc (nếu có) trên Windows có thể vô tình sinh ra thanh cuộn ngang do tính toán sai kích thước Viewport.

---

## 2. Giải Pháp Áp Dụng (Solutions Applied) & Các File Đã Sửa

### A. Tối ưu Global CSS (`src/index.css`)
- **Trong dõi lớp (layer base):**
  - Đã loại bỏ `width: 100%` khỏi thẻ `html, body, #root`, để cho các phần tử dạng Block này tự động chiếm toàn bộ chiều ngang khả dụng mà không tính lấn vào không gian của thanh cuộn hệ điều hành.
  - Đã bổ sung `overflow-x: hidden` nhằm triệt tiêu hoàn toàn rủi ro xuất hiện thanh cuộn ngang trên mọi trang.
- **Trong Custom Scrollbar:**
  - Thay đổi `::-webkit-scrollbar-track { background: transparent; }`. Giờ đây rãnh cuộn sẽ vô hình nếu không cần cuộn, loại bỏ hoàn toàn lỗi "xuất hiện thanh cuộn dù không cần thiết".

### B. Mở Rộng Linh Hoạt Trang Làm Bài (`src/pages/Quiz.jsx`)
- Gỡ bỏ hoàn toàn trạng thái `sticky` khỏi thanh Aside (Bảng điều hướng câu hỏi bên tay phải).
- Giờ đây, thanh Aside đóng vai trò như một cột nội dung trôi chảy tự nhiên cùng với phần bài làm bên trái. Toàn bộ trang `Quiz` sẽ sử dụng **duy nhất 1 thanh cuộn của trình duyệt**, giải quyết dứt điểm hiện tượng 2 thanh cuộn song song ở lề phải màn hình. 

---

## 3. Kết Quả Kiểm Thử (Responsive Testing Results)
Đã xác nhận sự mượt mà trên tất cả màn hình:
- **Desktop (1920x1080 / 1440x900)**: Chỉ có 1 thanh cuộn trình duyệt (hiện ra khi trang cần cuộn). Thiết kế mượt mà, khung nền che phủ trọn vẹn. 
- **Tablet (768x1024)**: Bảng câu hỏi thu vào bottom-sheet hiển thị thanh cuộn độc lập (chính xác về mặt logic UI của Modal/Sheet).
- **Mobile (390x844)**: Loại bỏ hoàn toàn thanh cuộn ngang, trải nghiệm vuốt dọc 100% tự nhiên của Native Web.
- Giao diện Premium 2026, màu sắc và background glassmorphism giữ nguyên 100% chất lượng ban đầu. Data và Logic của bài test không bị tác động.

