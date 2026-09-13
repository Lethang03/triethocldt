# Báo cáo sửa lỗi Duplicate Scrollbar

## 1. Nguyên nhân gốc rễ (Root Cause)
Lỗi 2 thanh cuộn dọc (duplicate vertical scrollbars) xuất hiện do cấu hình CSS Reset chưa chính xác trong tập tin `index.css`:
- Thuộc tính `min-height: 100%` được áp dụng đồng thời cho `html`, `body` và `#root`.
- Quan trọng nhất, `html` và `body` trước đây bị can thiệp thuộc tính `overflow-x: auto` hoặc `overflow-x: clip` để hỗ trợ hiển thị mobile/layout cố định. Theo chuẩn CSS, khi thẻ `html` có thuộc tính `overflow` (không phải `visible`), nó sẽ ngắt sự kế thừa overflow của thẻ `body` đối với Viewport. Hậu quả là cả Viewport (`html`) và bản thân `body` đều tạo ra các container cuộn (scroll containers) riêng biệt khi nội dung vượt quá chiều cao, sinh ra 2 thanh cuộn dọc nằm sát nhau.

## 2. Giải pháp và Các file đã sửa
- **`src/index.css`**:
  - Xóa bỏ `min-height: 100%` cho `html, body, #root` để các phần tử này cao tự nhiên theo nội dung bên trong, tránh việc bị ép chiều cao gây tràn nội dung sai cách.
  - Xóa toàn bộ cấu hình `overflow-x` trên `html`, giúp `html` quay về trạng thái mặc định (`visible`). Nhờ đó, thuộc tính `overflow` của `body` sẽ tự động kế thừa lên Viewport, tạo ra duy nhất một thanh cuộn.
  - Giữ lại `min-width: 1200px` và `overflow-x: auto` duy nhất trên thẻ `body` để duy trì giao diện Desktop (lock layout) không bị vỡ trên màn hình nhỏ (chỉ xuất hiện thanh cuộn ngang).
  - Xóa bỏ các dòng hack CSS thừa như `.home-page { overflow-x: visible; }` và `html:has(.home-page) {...}` do chúng có thể ghi đè lên các rule trên và tái diễn lỗi.

## 3. Kết quả kiểm thử
- **Thử nghiệm trên các trang**: Trang chủ, Danh sách đề, Lịch sử, Chi tiết kết quả, Thống kê, Trang làm bài.
- **Kết quả**: 
  - Chỉ còn lại DUY NHẤT 1 thanh cuộn dọc.
  - Trang cuộn tự nhiên từ trên xuống dưới mượt mà, không bị khựng, không bị rỗng ở góc bottom.
  - Các phần tử không bị cắt (clipped) hoặc ẩn mất.
  - Layout cố định Desktop (1200px) vẫn được giữ vững và xuất hiện thanh cuộn ngang hợp lý nếu màn hình nhỏ.

*Vui lòng chạy `npm run build` để kiểm chứng!*

