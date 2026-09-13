# HISTORY DETAIL UPGRADE — Báo Cáo Nâng Cấp

> **Ngày tạo**: 11/09/2026 00:35
> **Phạm vi**: Trang chi tiết lịch sử thi (`/history/:id`)

---

## 1. Files Đã Thay Đổi

| File | Loại thay đổi | Mô tả |
|---|---|---|
| `src/pages/HistoryDetail.jsx` | **REWRITE** | Toàn bộ trang được viết lại từ đầu |

**Không thay đổi**:
- `src/services/historyService.js` — Data flow giữ nguyên
- `src/App.jsx` — Route `/history/:id` vẫn giữ nguyên
- `src/pages/History.jsx` — Trang danh sách giữ nguyên
- `src/data/questions.json` — Dữ liệu câu hỏi không thay đổi

---

## 2. Tính Năng Đã Thêm (9 Parts)

### Part 1 — Result Summary Section ✅
- **Score Hero**: Circular progress bar với gradient xanh, hiển thị điểm X/10 và phần trăm
- **4 StatCards**: Câu đúng (xanh lá), Câu sai (đỏ), Bỏ trống (vàng), Thời gian (cyan)
- **Extra info row**: Tổng câu, điểm tự luận/sắp xếp (nếu có), tỉ lệ đúng MCQ

### Part 2 — Danh sách câu sai ✅
- Hiển thị tất cả số câu sai dưới dạng tag có thể click
- Click vào số câu → **scroll thẳng đến câu đó** (smooth scroll)
- Nếu không có câu sai: hiển thị "✓ Không có câu sai!"

### Part 3 — Danh sách câu bỏ trống ✅
- Tương tự Part 2, hiển thị tất cả số câu bỏ trống
- Nếu không có: hiển thị "✓ Không có câu bỏ trống."

### Part 4 — Hiển thị TẤT CẢ câu hỏi ✅
- **Tất cả** câu từ đầu đến cuối, không lọc
- Mỗi câu có ID DOM `q-{questionId}` để quick-jump hoạt động
- Border trái màu: xanh (đúng) / đỏ (sai) / vàng (bỏ trống/chưa chấm) / xám (bỏ trống)

### Part 5 — Xử lý 3 loại câu ✅
| Loại | Component | Hiển thị |
|---|---|---|
| `mcq` | `McqCard` | 4 đáp án, highlight đúng/sai/bạn chọn, badge rõ ràng |
| `text` | `TextCard` | Câu trả lời của bạn + Đáp án tham khảo + Nguồn grading |
| `sequence` | `SequenceCard` | Thứ tự bạn nhập ↔ Đáp án đúng (2 column so sánh) |

### Part 6 — Real Data (không fake) ✅
- Đọc thẳng từ `attempt.answers[]` trong localStorage
- Câu hỏi load từ `questions.json` theo `attempt.examId`
- Fallback an toàn nếu câu không có trong answers (hiển thị là unanswered)

### Part 7 — Bug Checks ✅
- **Không redirect**: Trang load độc lập qua `useParams()` → lấy `id` từ URL
- **Correct attempt**: `getAttempt(id)` tìm đúng bài thi theo UUID
- **Correct questions**: Load từ `questionsData.find(e => e.id === attempt.examId)`
- **Null check**: Nếu attempt không tồn tại → hiển thị thông báo lỗi thay vì crash

### Part 8 — UI ✅
- Giữ nguyên dark education theme (`#071426`)
- `glass-panel` cards với `backdrop-blur`
- `motion.div` với entrance animation
- Màu sắc: success=`#22C55E`, danger=`#EF4444`, warning=`#F59E0B`
- Typography: font-heading cho tiêu đề, font-mono cho sequence answers
- Bottom nav: "Quay lại lịch sử" + "Lên đầu trang"

### Part 9 — Responsive ✅
- Grid thích nghi: 4 cols desktop → 2 cols tablet → 1 col mobile
- Question cards: full width, padding responsive `p-6 md:p-10`
- Quick-jump tags: `flex-wrap` để không tràn

---

## 3. Data Flow

```
User nhấn "Xem chi tiết"
        ↓
Link to="/history/{attempt.id}"
        ↓
HistoryDetail.jsx — useParams() → id
        ↓
getAttempt(id) ← localStorage["exam_history"]
        ↓
attempt.examId → questionsData.find(e => e.id === attempt.examId)
        ↓
attempt.answers[] → ansMap { questionId → answerDetail }
        ↓
Render từng question với ansMap[q.questionId]
```

### Cấu trúc `answerDetail` (từ historyService.js):
```js
{
  questionId: number,
  type: "mcq" | "text" | "sequence",
  selected: string,       // Đáp án người dùng chọn
  correct: string,        // Đáp án đúng (A/B/C/D hoặc text)
  result: "correct" | "wrong" | "unanswered" | "manual" | "unanswered-manual",
  grading?: {             // Chỉ có với text/sequence
    source: string,
    score: number,
    points: number
  }
}
```

---

## 4. Vấn Đề Còn Tồn Đọng

| Vấn đề | Mức độ | Ghi chú |
|---|---|---|
| Câu text/sequence không có giao diện nhập trong Quiz | 🟡 | Cần thêm input UI vào Quiz.jsx trong tương lai |
| Đề 01 không có dữ liệu (ID mismatch) | 🔴 | Cần sửa questions.json hoặc examMeta.json |
| Nút "Bắt đầu ôn tập" trỏ `/setup/01` bị lỗi | 🔴 | Cần sửa HeroSection.jsx |

---

## 5. Hướng Dẫn Test

```
1. Mở http://localhost:5173
2. Chọn một đề (VD: Đề 02)
3. Làm bài: trả lời đúng 1 số câu, sai 1 số, bỏ trống 1 số
4. Nộp bài → xem kết quả
5. Vào History → click "Xem chi tiết"
6. Kiểm tra:
   ✓ Score card hiện đúng điểm
   ✓ StatCards đúng số câu đúng/sai/bỏ trống
   ✓ Quick-jump tags đúng số câu
   ✓ Click tag → scroll đến đúng câu đó
   ✓ MCQ: highlight đáp án đúng (xanh) và bạn chọn (đỏ nếu sai)
   ✓ Text/Sequence câu 55-60: hiển thị đúng loại card
```

---

## 6. Build

> Vui lòng chạy:
> ```bash
> cd "E:\Ôn thi"
> npm run build
> ```

