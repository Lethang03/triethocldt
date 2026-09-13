# Báo cáo Hợp nhất Trang Review và History Detail

## 1. Mục tiêu (Goals Achieved)
Trang **Xem lại đáp án** (sau khi nộp bài) và **Xem chi tiết bài làm** (từ Lịch sử) nay đã được đồng bộ giao diện 100%, chia sẻ chung cùng một Component, giải quyết tình trạng mỗi nơi hiển thị một kiểu.

## 2. Các Components Đã Sửa Đổi
- TẠO MỚI: `src/components/ExamResultReview.jsx` - Đây là Shared Component chứa toàn bộ giao diện xem lại bài thi.
- REFACTOR: `src/pages/HistoryDetail.jsx` - Rút gọn chỉ còn vài dòng code, gọi Component `ExamResultReview` và truyền biến `backUrl="/history"`.
- REFACTOR: `src/pages/Review.jsx` - Xóa bỏ toàn bộ layout cũ, gọi Component `ExamResultReview` và truyền biến `backUrl="/result"`.

## 3. Các tính năng của Shared Component (`ExamResultReview`)
- **Result Header**: Hiển thị tên Đề, Điểm (VD: 8.5/10), và Thời gian làm bài theo định dạng phút:giây.
- **Statistic Cards (Thống kê)**: 4 ô hiển thị tổng quát kết quả: ✅ Câu đúng, 🟡 Đúng một phần, ❌ Câu sai, và ⚪ Bỏ trống.
- **Question Filter Tabs (Bộ lọc)**: Thanh lọc câu hỏi với các tuỳ chọn: Tất cả, Đúng, Đúng một phần, Sai, Bỏ trống. Tích hợp Filter hoạt động theo trạng thái thực tế của từng câu.
- **Question Detail Card**: Kế thừa toàn bộ giao diện Dark-theme dạng Glass-panel của HistoryDetail cũ:
  - Hiển thị Nội dung câu hỏi (`q.question`).
  - Hỗ trợ cả 3 dạng: MCQ, Sequence, Essay/Text.
  - Box `BẠN TRẢ LỜI` hiển thị đáp án User đã chọn.
  - Tự động show số lượng "Từ khóa đạt được" đối với câu Tự luận.
  - Box `ĐÁP ÁN ĐÚNG / THAM KHẢO` hiển thị đáp án chuẩn.
  - Màu viền Card và Icon đổi màu linh hoạt theo Status (Đúng/Sai/Partial/Unanswered).

## 4. Dữ liệu (Data Flow)
Trang `Review.jsx` nay không sử dụng State tạm thời nữa mà lấy trực tiếp đối tượng Attempt từ URL (`?attempt=ID`) bằng hàm `getAttempt(id)`. Điều này đảm bảo trang Review có sẵn dữ liệu sau khi chấm tự luận phức tạp (đã có keywords, targetKeywords, result status) y hệt như trang Lịch sử.

## 5. Kết quả kiểm thử
- `Review.jsx` và `HistoryDetail.jsx` hiển thị chung một layout giống nhau y hệt.
- Các bộ lọc tab hoạt động mượt mà.
- Giao diện đáp ứng đúng yêu cầu thiết kế bằng Tailwind (glass-panel, rounded-3xl).

Vui lòng chạy lệnh:
```bash
npm run build
```
Để kiểm chứng việc biên dịch thành công!

