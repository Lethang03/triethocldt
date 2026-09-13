# Báo Cáo Audit Chấm Điểm Sequence & Text (Câu 56-60, Đề 02-11)

## 1. Lỗi Hiển Thị Đúng Nhưng Không Cộng Điểm (Visually Correct but Excluded)
**Nguyên nhân gốc:** 
Một số câu hỏi bị thiếu trường `"type": "mcq"` trong `questions.json`. Khi type bị thiếu:
- `HistoryDetail.jsx` (Giao diện): Fallback về hàm render MCQ, so sánh `selected.charAt(0) === q.correct`. Nếu khớp, giao diện hiển thị là **Đúng**.
- `historyService.js` (Logic chấm): Biến `isMcq = question.type === 'mcq'` trả về `false`. Câu hỏi bị chấm theo logic của câu Text tự luận. Vì câu trả lời MCQ (ví dụ: "A. Quan điểm lịch sử") không khớp chính xác 100% với đáp án "A", hàm `matches` trả về `false` ➔ Biến `wrongCount` tăng lên, `correctCount` không tăng, và không được cộng điểm vào tổng số điểm.

**Cách khắc phục:** 
Đã sửa đổi logic trong `historyService.js`: `const isMcq = !question.type || question.type === 'mcq'`. Câu hỏi thiếu type sẽ được chấm chuẩn xác như câu MCQ, đồng bộ 100% với giao diện UI.

## 2. Lỗi Crash Chấm Điểm Sequence (TypeError)
**Nguyên nhân gốc:**
Khi thực hiện lưu điểm các đề từ 03 đến 11, `historyService.js` cố gắng truy cập `reference.points` để cộng điểm cho câu sequence. Do file `essayAnswers.json` hiện tại chỉ định nghĩa dữ liệu cho Đề 02, biến `reference` bị `undefined`, gây ra lỗi `TypeError: Cannot read properties of undefined (reading 'points')`. 

**Cách khắc phục:**
Đã đổi thành Optional Chaining: `reference?.points ?? 1` ở cả 2 block chấm điểm `sequence` và `text`. Đảm bảo hệ thống không bao giờ bị crash khi lưu History cho các Đề 03-11. Hệ thống sẽ tự động dùng giá trị mặc định là 1 point nếu file Word chưa được map chi tiết.

## 3. Kiểm Tra Chuẩn Hoá Đáp Án (Normalization)
**Kết quả Audit:** ✅ An toàn & Chính xác
Logic chuẩn hoá hiện tại: 
`normalize(selected).replace(/ /g, '') === normalize(referenceAnswer).replace(/ /g, '')`
(Hàm normalize: Chuyển in thường, loại bỏ dấu tiếng Việt, thay thế toàn bộ ký tự không phải chữ/số thành dấu cách).
- Nếu user nhập `3-1-2-4` ➔ Chuyển thành `3 1 2 4` ➔ Thay dấu cách ➔ `3124`
- Nếu user nhập `3 1 2 4` ➔ `3124`
- Nếu user nhập `3,1,2,4` ➔ `3124`
Tất cả các định dạng trên đều được tính là **Chính xác (Đúng)**, `correctCount += 1`.

## 4. Xác Minh Luồng Tính Điểm (Scoring Flow)
**Trạng thái Audit:** ✅ Xác minh hoạt động đúng
- `correctCount` được cộng thêm 1 nếu trả lời đúng Sequence hoặc đoán chính xác Text.
- `wrongCount` được cộng thêm 1 nếu trả lời sai.
- `unansweredCount` tăng nếu bỏ trống.
- **Tổng Điểm (`score`):** Điểm `score` hiển thị `/10` được tính dựa trên phần trăm `correctCount / totalQuestions`. Do đó, khi `correctCount` tăng 1, phần trăm tự động tăng, kéo theo `score` tăng tương ứng (ví dụ: +0.16 điểm / câu). Điểm được cộng đúng như kỳ vọng mà không cần sửa đổi thêm công thức percentage.
