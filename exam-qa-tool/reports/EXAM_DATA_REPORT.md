# BÁO CÁO KIỂM TRA DỮ LIỆU ĐỀ THI (EXAM DATA REPORT)

> Thời gian: 10/09/2026 23:28
> Dữ liệu từ: `src/data/questions.json` (579KB, 10,373 dòng)

## Tổng Quan

| Chỉ số | Giá trị |
|---|---|
| **Tổng đề trong questions.json** | **14 đề** |
| **ID range trong questions.json** | `02` → `15` |
| **ID range trong examMeta.json** | `01` → `14` |
| ❌ Lỗi mapping | **ID 01 thiếu dữ liệu; ID 15 thiếu khai báo meta** |

---

## ❌ BUG NGHIÊM TRỌNG: ID MISMATCH

### Vấn đề
```
examMeta.json:    ID 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14
questions.json:       02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15
```

### Hậu quả
1. Người dùng chọn **"Đề ôn luyện số 01"** → `ExamSetup.jsx` gọi `questionsData.find(e => e.id === "01")` → **kết quả: undefined** → Trang Setup/Quiz sẽ crash hoặc hiển thị 0 câu hỏi
2. **Đề 15** có 70 câu dữ liệu đầy đủ nhưng không bao giờ hiển thị vì không có entry trong `examMeta.json`

---

## Chi Tiết Từng Đề

### Đề 02 (Đề ôn luyện số 02) — ⚠️ WARNING
- Số câu: **60**
- MCQ (type=mcq): 54 câu ✅
- Sequence (type=sequence): 3 câu (55, 56, 57) ⚠️
- Text (type=text): 3 câu (58, 59, 60) ⚠️
- Tất cả câu MCQ có `correct` hợp lệ (A/B/C/D) ✅

### Đề 03 — 14 (tương tự Đề 02)
- Cùng cấu trúc: 54 MCQ + 3 sequence + 3 text
- Tất cả MCQ answers hợp lệ ✅

### Đề 12, 13, 14
- Số câu: **70**
- MCQ: ~64 câu ✅
- Non-MCQ: ~6 câu ⚠️

### Đề 15 (Không có trong Meta)
- **Tồn tại trong questions.json nhưng không khai báo trong examMeta.json**
- Giao diện không bao giờ hiển thị đề này

---

## Kết Luận và Đề Xuất

### Lỗi cần sửa (chờ phê duyệt)

**Option A** (Đổi meta để khớp data):
```json
// examMeta.json: thay "id": "01" → "id": "02" ... thay "id": "14" → "id": "15"
```

**Option B** (Đổi data để khớp meta):
```json
// questions.json: thay "id": "02" → "id": "01" ... thay "id": "15" → "id": "14"
```

> Đề xuất: Chọn **Option B** (sửa trong questions.json) vì interface hiển thị theo meta và người dùng đã quen với `Đề 01 → Đề 14`.

