# BÁO CÁO KIỂM TRA LỊCH SỬ THI (HISTORY SYSTEM)

> Thời gian: 10/09/2026 23:28
> Nguồn: `src/services/historyService.js`

## Storage Mechanism

```
Lưu vào: localStorage key = "exam_history"
Format: JSON array
```

## Required Fields trong Attempt Object

| Field | Type | Có không | Ghi chú |
|---|---|---|---|
| `id` | string | ✅ | `uuid` attempt |
| `examId` | string | ✅ | VD: `"02"` |
| `examName` | string | ✅ | VD: `"Đề ôn luyện số 02"` |
| `startedAt` | ISO string | ✅ | |
| `finishedAt` | ISO string | ✅ | |
| `date` | string | ✅ | `YYYY-MM-DD` |
| `duration` | number | ✅ | Giây |
| `totalQuestions` | number | ✅ | |
| `correct` | number | ✅ | |
| `correctCount` | number | ✅ | Alias |
| `wrong` | number | ✅ | |
| `wrongCount` | number | ✅ | Alias |
| `unanswered` | number | ✅ | |
| `unansweredCount` | number | ✅ | Alias |
| `score` | number | ✅ | X.X/10 |
| `percentage` | number | ✅ | % |
| `answers` | array | ✅ | Chi tiết từng câu |
| `selectedAnswers` | array | ✅ | |
| `correctAnswers` | array | ✅ | |
| `wrongQuestionNumbers` | array | ✅ | |
| `unansweredQuestionNumbers` | array | ✅ | |

## Chi Tiết Mảng `answers[]`

```js
// Mỗi phần tử trong answers[]
{
  questionId: number,
  selected: string,    // Đáp án người dùng chọn
  correct: string,     // Đáp án đúng (A/B/C/D hoặc text dài)
  result: "correct" | "wrong" | "unanswered"
}
```

## Kết Quả Kiểm Tra

| Test | Kết quả |
|---|---|
| Cấu trúc object đầy đủ | ✅ PASSED |
| `answers[]` đủ số câu | ✅ PASSED |
| `getExamHistory()` sort đúng | ✅ (sort by finishedAt DESC) |
| `getAttempt(id)` tìm đúng | ✅ |
| `saveExamResult()` không duplicate | ✅ (kiểm tra index trước khi push) |
| `calculateStatistics()` | ✅ |
| `getWeeklyActivity()` | ✅ |

## Kết Luận

**History System: PASSED ✅** — Cấu trúc hoàn chỉnh, đủ dữ liệu để hiển thị đầy đủ thông tin trên trang Review và History.

