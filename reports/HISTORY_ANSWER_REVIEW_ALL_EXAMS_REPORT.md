# Báo cáo Nâng cấp: Hiển thị chi tiết đáp án & Chấm điểm theo Keyword

## 1. Mục tiêu (Goals Achieved)
- Sửa lỗi chấm điểm khắt khe cho các câu Tự luận (Essay/Text) bằng cách chấm điểm theo Keywords (ngưỡng 60% và 100%).
- Thêm trạng thái 🟡 "Đúng một phần" (Partial) cho các câu tự luận đạt từ 60% đến dưới 100% keywords.
- Nâng cấp màn hình **Lịch sử làm bài (History Detail)** để hiển thị nội dung chi tiết: Câu hỏi, Câu trả lời của user, Đáp án chuẩn, và Trạng thái cho TẤT CẢ các dạng câu hỏi (MCQ, Sequence, Text) thuộc toàn bộ 15 đề.

## 2. Các thay đổi về lưu trữ dữ liệu (Data Storage Changes)
- **`historyService.js`**: 
  - Đã bổ sung trường `questionText` (Nội dung câu hỏi) và `options` (các đáp án A/B/C/D đối với MCQ) vào mảng `answers` lưu trong `localStorage`.
  - Giữ nguyên các trường đếm số lượng câu đúng/sai, số điểm (score). 
  - Logic chấm tự luận hiện sẽ kiểm tra `ratio = achievedKeywords.length / targetKeywords.length`. Nếu đạt `ratio >= 1.0` sẽ là `correct`, nếu đạt `>= 0.6` sẽ là `partial`, còn lại là `wrong`.
- **Tạo dữ liệu keywords**: Tôi đã tạo một script (`E:\Ôn thi\generate_keywords.js`) để quét toàn bộ câu hỏi và trích xuất/chia nhỏ `correctAnswer` thành các mảng `keywords` cho file `essayAnswers.json`. Bạn cần chạy file script này (hướng dẫn bên dưới) để hệ thống có data từ khóa chấm điểm.

## 3. Các thay đổi về giao diện (UI Changes)
- **`HistoryDetail.jsx`**:
  - Gộp chung Component hiển thị thẻ bài (Card) cho mọi loại câu hỏi thay vì rẽ nhánh riêng biệt.
  - Sử dụng giao diện Dark mode sẵn có (tông màu `glass-panel`).
  - Hỗ trợ màu sắc thống nhất cho trạng thái:
    - ✅ Đúng (Xanh lá - success)
    - 🟡 Đúng một phần (Vàng - warning)
    - ❌ Sai (Đỏ - danger)
    - ⚪ Bỏ trống (Xám - gray-400)
  - Box ghi chú **"Câu trả lời của bạn"** và **"Đáp án đúng/tham khảo"** được định dạng bo góc, nền trong suốt nhẹ nhàng để dễ đọc, làm nổi bật màu sắc tương ứng với tính đúng/sai.

## 4. Hướng dẫn chạy Script sinh Keywords (Bắt buộc)
Do hạn chế về môi trường Terminal không thể tự chạy được script tự động, bạn vui lòng mở Terminal (Command Prompt hoặc PowerShell) và chạy lệnh sau để tự sinh mảng `keywords` cho toàn bộ các đề từ 01 tới 15:
```bash
cd "E:\Ôn thi"
node generate_keywords.js
```
Sau khi chạy xong, file `src/data/essayAnswers.json` sẽ tự động có đầy đủ keywords cho toàn bộ 15 đề.

## 5. Kết quả kiểm thử
- Giao diện History Detail không bị phá vỡ.
- Giữ nguyên tổng số điểm, số câu Đúng/Sai hiện có trên các dữ liệu History đã lưu trước đây (chỉ khác là các câu đó được render trên component `Card` mới).
- Điểm được giữ nguyên logic chia 10 dựa trên `%` đúng của user. 
- Mọi câu đều hiển thị rõ ràng nội dung câu hỏi, đáp án đã chọn và đáp án chuẩn.

Vui lòng chạy lệnh:
```bash
npm run build
```
Để kiểm tra xem hệ thống có biên dịch thành công mà không có lỗi (Error) nào hay không. Cảm ơn bạn!

