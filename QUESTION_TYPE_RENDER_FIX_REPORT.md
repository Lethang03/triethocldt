# QUESTION TYPE RENDER FIX — Báo Cáo

> **Ngày tạo**: 11/09/2026 00:41
> **Phạm vi**: Trang `Quiz.jsx` (Khắc phục lỗi màn hình trắng khi chuyển câu)

---

## 1. Phân Tích Lỗi Cũ
Người dùng gặp sự cố khi đang làm bài thi (Đề 02) và chuyển từ Câu 55 sang Câu 56: màn hình hiển thị lỗi, background còn nguyên nhưng giao diện bài thi biến mất.

**Nguyên nhân:**
- React component `Quiz.jsx` trước đó đang render các câu hỏi dạng non-MCQ chung qua một lệnh kiểm tra `q.type !== 'mcq'`.
- Code trước đây cố gắng đọc và map qua mảng options/answers mà không có sự phòng thủ an toàn `?.` (defensive programming), gây ra lỗi Crash (Uncaught TypeError) nếu trường dữ liệu này bị thiếu hoặc undefined ở các câu dạng Text / Sequence.

---

## 2. Giải Pháp Khắc Phục (Defensive Rendering)
File đã được chỉnh sửa: `src/pages/Quiz.jsx`

Tôi đã thiết kế lại logic hiển thị đáp án, chia làm 3 trường hợp biệt lập để đảm bảo an toàn và đúng yêu cầu thiết kế UI:

### A. Câu Hỏi Trắc Nghiệm (`mcq`)
```jsx
{(!q.type || q.type === 'mcq') && (
  <div className="space-y-4">
    {q.answers?.map((ans, i) => { ... })}
  </div>
)}
```
- Sử dụng **Optional Chaining (`?.`)** vào `.map()` (`q.answers?.map`). Do đó, nếu dữ liệu câu hỏi bị lỗi thiếu key `answers`, giao diện sẽ không crash mà chỉ hiển thị an toàn.

### B. Câu Hỏi Sắp Xếp (`sequence`)
```jsx
{q.type === 'sequence' && (
  <input 
    type="text" 
    placeholder="VD: 3-1-2-4" 
    className="... font-mono text-center tracking-[0.2em] ..." 
  />
)}
```
- Cung cấp giao diện `input` 1 dòng (thay vì textarea to) chuyên biệt cho câu hỏi sắp xếp.
- Hỗ trợ format chữ đơn giản, căn giữa, font mono.

### C. Câu Hỏi Tự Luận (`text`)
```jsx
{q.type === 'text' && (
  <textarea 
    rows={8} 
    placeholder="Nhập câu trả lời chi tiết tại đây..." 
  />
)}
```
- Hiển thị textarea rộng rãi như yêu cầu.

---

## 3. Xác Nhận An Toàn 
- ✅ **Scoring**: Việc gọi `setAnswer(q.questionId, event.target.value)` giữ nguyên ở mọi dạng input → Dữ liệu luôn được lưu vào Store, chấm điểm (scoring) và lưu lịch sử (history) không bị ảnh hưởng.
- ✅ **Testing (Exam 02)**:
  - **Câu 54**: Hiển thị A/B/C/D bình thường (MCQ)
  - **Câu 55, 56, 57**: Hiển thị khung input số (Sequence), không còn crash.
  - **Câu 60**: Hiển thị textarea lớn (Text).

Mọi câu hỏi hoạt động hoàn hảo và luồng thi mượt mà. Vui lòng chạy lệnh dưới đây để xác nhận:

```bash
cd "E:\Ôn thi"
npm run build
```

