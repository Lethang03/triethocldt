# BÁO CÁO KIỂM TRA SCORING LOGIC

> Thời gian: 10/09/2026 23:27
> Phân tích từ: `src/services/historyService.js` + `src/data/questions.json`

## Công Thức Chấm Điểm Hiện Tại

```js
// historyService.js — calculateAttempt()
const isCorrect = question.type === 'mcq'
  ? selected && selected.charAt(0).toUpperCase() === question.correct
  : selected.trim() === String(question.correct || '').trim()

const percentage = Math.round((correct / totalQuestions) * 100)
const score = Number((percentage / 10).toFixed(1))
```

## Phân Tích Logic

| Loại câu | Cách chấm | Kết quả |
|---|---|---|
| `type: "mcq"` | So ký tự đầu của đáp án chọn với `q.correct` | ✅ Chính xác |
| `type: "sequence"` | So toàn bộ chuỗi (VD: `"3-1-2-4"`) | ⚠️ Không có giao diện nhập |
| `type: "text"` | So toàn bộ chuỗi văn bản dài | ⚠️ Gần như không thể khớp |

## Kết Quả Unit Test (14 đề)

### CASE 1: Trả lời đúng tất cả câu MCQ (câu 1-54)

| Đề | Câu MCQ | Câu Non-MCQ | Score thực tế | Score kỳ vọng | Pass? |
|---|---|---|---|---|---|
| 02-11 (×10) | 54/54 đúng | 6 không trả lời | **9.0/10** | 10/10 | ⚠️ Không bao giờ đạt 10/10 |
| 12-15 (×4) | ~64/64 đúng | 6 không trả lời | **9.1/10** | 10/10 | ⚠️ |

**Nguyên nhân**: 6 câu cuối (sequence + text) không có giao diện → `unanswered` → giảm điểm.

### CASE 2: Trả lời đúng 27/54 MCQ

| Đề | Câu đúng | Score | Pass? |
|---|---|---|---|
| Đề 02-11 | 27/60 | **4.5** | ✅ |

### CASE 3: Không trả lời

| Đề | Score | Unanswered | Pass? |
|---|---|---|---|
| Tất cả | 0 | 60 hoặc 70 | ✅ |

## Kết Luận

- Logic chấm điểm MCQ: **CHÍNH XÁC** ✅
- Điểm tối đa có thể đạt: **~9.0-9.1/10** (không bao giờ đạt 10/10 vì câu text/sequence)
- Đề xuất: Loại câu `sequence` và `text` ra khỏi tổng số câu tính điểm, hoặc thêm giao diện nhập liệu phù hợp.

