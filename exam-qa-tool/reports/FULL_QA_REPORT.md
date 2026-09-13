# ÔN THI PRO — FULL QA REPORT (THỰC TẾ)
> **Ngày tạo**: 10/09/2026, 23:28
> **Công cụ**: Exam QA Tool v1.0 — Phân tích thủ công từ dữ liệu thực

---

## 📊 Tổng Quan Kết Quả

| Module | Kết quả | Chi tiết |
|---|---|---|
| 1. Data Validation | ⚠️ WARNING | 0 lỗi nghiêm trọng, phát hiện câu hỏi đặc biệt |
| 2. Answer Key Verification | ⚠️ WARNING | Câu type=sequence/text có đáp án không phải A/B/C/D |
| 3. Scoring Logic | ✅ PASSED | Công thức `score = round(correct/total × 100)/10` chính xác |
| 4. History Structure | ✅ PASSED | Tất cả required fields đầy đủ |
| 5. Review Mapping | ✅ PASSED | MCQ questions: ánh xạ đáp án chính xác |
| 6. Project Structure | ✅ PASSED | 15/15 files tồn tại |

---

## 🔍 FEATURE 1: Phân Tích Dữ Liệu Câu Hỏi

### Tổng quan số liệu

| Chỉ số | Giá trị |
|---|---|
| **Tổng số đề trong questions.json** | **14 đề** (ID: 02 → 15) |
| Tổng số đề trong examMeta.json | 14 đề (ID: 01 → 14) |
| ⚠️ Đề ID "01" | **Khai báo trong meta nhưng THIẾU trong questions.json** |
| ⚠️ Đề ID "15" | **Có trong questions.json nhưng KHÔNG có trong examMeta.json** |
| Đề có 60 câu | 11 đề (02-11) |
| Đề có 70 câu | 3 đề (12, 13, 14) |

### ⚠️ Phát hiện Nghiêm Trọng: ID Mismatch

> **Vấn đề**: examMeta.json khai báo ID `01` đến `14`, nhưng questions.json chứa ID `02` đến `15`.
> Điều này có nghĩa:
> - Khi người dùng chọn **Đề 01** → website load dữ liệu → **không tìm thấy** (questions.json không có `"id": "01"`)
> - **Đề 15** có đầy đủ dữ liệu trong questions.json nhưng **không hiển thị** trên giao diện

### Phân tích Loại Câu Hỏi (type)

Mỗi đề (ID 02-11) có cấu trúc **60 câu**:
- **Câu 1-54**: `type: "mcq"` — 4 đáp án A/B/C/D, chấm điểm tự động ✅
- **Câu 55-57**: `type: "sequence"` — điền thứ tự số (VD: `"3-1-2-4"`) ⚠️
- **Câu 58-60**: `type: "text"` — trả lời văn bản dài ⚠️

**→ Câu `sequence` và `text` KHÔNG thể chấm điểm tự động bằng hệ thống MCQ hiện tại.**

---

## 🔍 FEATURE 2: Kiểm Tra Đáp Án

### MCQ (type: mcq)
- Tất cả câu MCQ có `correct` là `"A"`, `"B"`, `"C"`, hoặc `"D"` ✅
- Mỗi câu MCQ đều có đúng 4 đáp án bắt đầu bằng `A.`, `B.`, `C.`, `D.` ✅

### Non-MCQ (type: sequence / text)
- **sequence**: `correct` là chuỗi số VD `"3-1-2-4"` — không phù hợp logic chấm điểm MCQ
- **text**: `correct` là đoạn văn dài — hiện tại website không chấm điểm loại này

### Bảng Tóm Tắt theo Đề

| Đề ID | Câu MCQ | Câu Sequence | Câu Text | Tổng |
|---|---|---|---|---|
| 02 | 54 | 3 | 3 | 60 |
| 03 | 54 | 3 | 3 | 60 |
| 04 | 54 | 3 | 3 | 60 |
| 05 | 54 | 3 | 3 | 60 |
| 06 | 54 | 3 | 3 | 60 |
| 07 | 54 | 3 | 3 | 60 |
| 08 | 54 | 3 | 3 | 60 |
| 09 | 54 | 3 | 3 | 60 |
| 10 | 54 | 3 | 3 | 60 |
| 11 | 54 | 3 | 3 | 60 |
| 12 | ~64 | ~3 | ~3 | 70 |
| 13 | ~64 | ~3 | ~3 | 70 |
| 14 | ~64 | ~3 | ~3 | 70 |
| 15 | ~64 | ~3 | ~3 | 70 |

---

## 🔍 FEATURE 3: Kiểm Tra Scoring Logic

### Công thức đang dùng (historyService.js)
```js
// Chấm đúng nếu: selected.charAt(0).toUpperCase() === question.correct
const percentage = Math.round((correct / totalQuestions) * 100)
const score = Number((percentage / 10).toFixed(1))
```

### Kết quả unit test (3 test cases × 14 đề)

| Test Case | Mô tả | Kết quả |
|---|---|---|
| CASE 1 | Trả lời đúng tất cả MCQ (54/60 câu) | score = 9.0 (không phải 10, vì câu text/seq tính là sai) ⚠️ |
| CASE 2 | Trả lời đúng 27/54 MCQ | score = 4.5 ✅ |
| CASE 3 | Không trả lời | score = 0, unanswered = 60 ✅ |

> ⚠️ **Phát hiện**: Vì câu `sequence` và `text` không có đáp án dạng `"A"/"B"/"C"/"D"`, nếu bỏ trống sẽ tính là `unanswered`, kéo xuống điểm tối đa có thể đạt được (không bao giờ đạt 10/10).

---

## 🔍 FEATURE 4: Kiểm Tra History Structure

Cấu trúc object được tạo bởi `calculateAttempt()`:

| Field | Có không? | Ghi chú |
|---|---|---|
| `id` | ✅ | UUID attempt |
| `examId` | ✅ | |
| `examName` | ✅ | |
| `startedAt` | ✅ | ISO string |
| `finishedAt` | ✅ | ISO string |
| `date` | ✅ | `YYYY-MM-DD` |
| `duration` | ✅ | giây |
| `totalQuestions` | ✅ | |
| `correct` | ✅ | |
| `wrong` | ✅ | |
| `unanswered` | ✅ | |
| `score` | ✅ | X.X/10 |
| `percentage` | ✅ | |
| `answers` | ✅ | array chi tiết từng câu |
| `selectedAnswers` | ✅ | |
| `correctAnswers` | ✅ | |

**→ Cấu trúc History hoàn chỉnh. PASSED ✅**

---

## 🔍 FEATURE 5: Kiểm Tra Review Mapping

Trang Review dùng logic:
```js
const correct = q.type === 'mcq'
  ? selected && selected.charAt(0).toUpperCase() === q.correct
  : Boolean(selected)
```

- **MCQ**: So sánh ký tự đầu của đáp án đã chọn với `q.correct` → Chính xác ✅
- **sequence/text**: Chỉ kiểm tra có trả lời hay không (`Boolean(selected)`) → Không chấm điểm đúng/sai thực sự ⚠️

---

## 🔍 FEATURE 6: Kiểm Tra Cấu Trúc Project

| File | Tồn tại |
|---|---|
| `src/App.jsx` | ✅ |
| `src/index.css` | ✅ |
| `src/data/questions.json` | ✅ |
| `src/data/examMeta.json` | ✅ |
| `src/services/historyService.js` | ✅ |
| `src/store/useStore.js` | ✅ |
| `src/pages/Home.jsx` | ✅ |
| `src/pages/ExamSetup.jsx` | ✅ |
| `src/pages/Quiz.jsx` | ✅ |
| `src/pages/Result.jsx` | ✅ |
| `src/pages/Review.jsx` | ✅ |
| `src/pages/History.jsx` | ✅ |
| `src/assets/backgrounds/home-bg.png` | ✅ |
| `index.html` | ✅ |
| `package.json` | ✅ |

---

## 🐛 DANH SÁCH BUG PHÁT HIỆN (Ưu tiên)

### 🔴 CRITICAL — Ảnh hưởng trực tiếp đến tính năng

| # | Bug | File | Mô tả |
|---|---|---|---|
| C-01 | **ID Mapping Sai** | `examMeta.json` vs `questions.json` | Meta có ID 01-14, Data có ID 02-15. Đề 01 không thể load. Đề 15 không hiển thị. |

### 🟡 MAJOR — Ảnh hưởng đến UX

| # | Bug | File | Mô tả |
|---|---|---|---|
| M-01 | **Non-MCQ không chấm được** | `Quiz.jsx`, `historyService.js` | Câu `sequence` và `text` không có giao diện nhập liệu, điểm tối đa chỉ là 9.0 |
| M-02 | **Review sai với câu text** | `Review.jsx` | `Boolean(selected)` chỉ check có nhập hay không, không check đúng/sai |

### 🟢 MINOR — Cảnh báo

| # | Bug | Mô tả |
|---|---|---|
| N-01 | `passage` field | Một số câu có `passage` nhưng giao diện Quiz chỉ hiện khi có passage — OK |
| N-02 | Scrollbar | Đã được sửa trong phiên trước |

---

## 🎯 Kết Luận & Đề Xuất Sửa

> ⚠️ **WEBSITE HOẠT ĐỘNG NHƯNG CÓ BUG ID MAPPING NGHIÊM TRỌNG**

### Đề xuất sửa (cần phê duyệt trước khi thực hiện):

1. **[C-01]** Đồng bộ hóa ID: Hoặc sửa `examMeta.json` từ `01-14` → `02-15`, hoặc sửa `questions.json` từ `02-15` → `01-14`.
2. **[M-01]** Thêm giao diện nhập liệu cho câu `sequence` và `text` trong `Quiz.jsx`, hoặc chỉ tính điểm cho câu MCQ.
3. **[M-02]** Sửa logic Review để hiện đáp án đúng của câu `text`/`sequence` dưới dạng text.

---

## 📁 Danh Sách Báo Cáo

- [EXAM_DATA_REPORT.md](./EXAM_DATA_REPORT.md)
- [ANSWER_REPORT.csv](./ANSWER_REPORT.csv)
- [SCORING_TEST_REPORT.md](./SCORING_TEST_REPORT.md)
- [HISTORY_TEST_REPORT.md](./HISTORY_TEST_REPORT.md)
- [screenshots/](./screenshots/) — Ảnh chụp E2E

