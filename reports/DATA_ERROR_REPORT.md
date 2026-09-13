# BÁO CÁO FRAMEWORK — DATA ERROR REPORT (Phân tích sơ bộ)
> **Ngày tạo**: 10/09/2026 23:59
> **Lưu ý**: Đây là báo cáo sơ bộ từ phân tích cấu trúc.
> Báo cáo đầy đủ sẽ được tạo **sau khi chạy** `exam-qa-tool/RUN_DOCX_VERIFY.bat`

---

## 📊 Tổng Quan (Phân Tích Cấu Trúc)

| Chỉ số | Giá trị |
|---|---|
| File Word nguồn | 11 files trong `E:\Đề\` |
| Đề trong questions.json | 14 đề (ID: 02-15) |
| Đề trong examMeta.json | 14 đề (ID: 01-14) |

---

## ❌ Lỗi Nghiêm Trọng Đã Xác Nhận (Không cần chạy script)

### [CRITICAL-01] ID Mapping Mismatch
**Mức độ**: 🔴 CRITICAL  
**Phát hiện bởi**: Phân tích cấu trúc file

```
examMeta.json khai báo:   ID 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14
questions.json chứa:          02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15
```

**Hậu quả**:
- **Đề 01**: Được hiển thị trên giao diện (link `/setup/01`) nhưng **không có dữ liệu** trong questions.json → Trang Quiz sẽ render 0 câu hỏi hoặc crash
- **Đề 15**: Có đầy đủ 70 câu trong questions.json nhưng **không bao giờ hiển thị** trên giao diện người dùng

**Tác động**: Người dùng click vào "Bắt đầu ôn tập" (link `/setup/01`) sẽ gặp lỗi nghiêm trọng.

---

### [CRITICAL-02] File Word "TỔNG HỢP" có tên không chuẩn
**Mức độ**: 🔴 CRITICAL (ảnh hưởng đến script)

```
Tên thực tế trên disk:     TÔNG HỢP TRẮC NGHIỆM.docx   ← thiếu dấu ngã trên Ổ
Tên thông thường kỳ vọng:  TỔNG HỢP TRẮC NGHIỆM.docx
```

Script Python đã được cấu hình để xử lý đúng tên file này.

---

## ⚠️ Vấn Đề Cấu Trúc Dữ Liệu (Đã Xác Nhận)

### [WARN-01] Câu hỏi Non-MCQ không thể chấm điểm tự động
**Mức độ**: 🟡 MAJOR

Mỗi đề từ 02 đến 11 (60 câu) có cấu trúc:
- Câu 1-54: `type: "mcq"` — 4 đáp án A/B/C/D ✅ Chấm tự động được
- Câu 55-57: `type: "sequence"` — Đáp án dạng `"3-1-2-4"` ⚠️ Không chấm được với UI hiện tại
- Câu 58-60: `type: "text"` — Đáp án là đoạn văn dài ⚠️ Không chấm được với UI hiện tại

**Hậu quả tính điểm**:
- Điểm tối đa người dùng có thể đạt = 9.0/10 (không bao giờ 10/10)
- 6 câu cuối luôn tính là `unanswered`

### [WARN-02] Đề 02 — Nút "Bắt đầu ôn tập" trỏ sai
**Mức độ**: 🟡 MAJOR

Trong `HeroSection.jsx`, nút "Bắt đầu ôn tập" trỏ đến `/setup/01`:
```jsx
<Link to="/setup/01" ...>Bắt đầu ôn tập</Link>
```
Nhưng `questions.json` không có đề ID `"01"`. Nút này sẽ dẫn đến trang rỗng.

---

## 📋 Danh Sách Files Word Trong E:\Đề

| File | Kích thước | Đề website tương ứng | Trạng thái |
|---|---|---|---|
| `ĐỀ ÔN LUYỆN SỐ 02.docx` | 35KB | Đề ID `02` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 03.docx` | 40KB | Đề ID `03` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 04.docx` | 38KB | Đề ID `04` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 05.docx` | 37KB | Đề ID `05` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 06.docx` | 39KB | Đề ID `06` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 07.docx` | 38KB | Đề ID `07` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 08.docx` | 43KB | Đề ID `08` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 09.docx` | 40KB | Đề ID `09` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 10.docx` | 41KB | Đề ID `10` | ✅ File tồn tại |
| `ĐỀ ÔN LUYỆN SỐ 11.docx` | 41KB | Đề ID `11` | ✅ File tồn tại |
| `TÔNG HỢP TRẮC NGHIỆM.docx` | 79KB | Đề ID `12`,`13`,`14`,`15` | ⚠️ Tên file thiếu dấu |
| _(không có)_ | - | Đề ID `01` | ❌ Không có file Word |

---

## 🚀 Hướng Dẫn Chạy Script Kiểm Tra Đầy Đủ

Script Python sẽ đọc từng file Word, so sánh từng câu hỏi và tạo báo cáo chi tiết:

### Cách 1: Double-click (đơn giản nhất)
```
E:\Ôn thi\exam-qa-tool\RUN_DOCX_VERIFY.bat
```

### Cách 2: Terminal
```bash
cd "E:\Ôn thi\exam-qa-tool"
pip install python-docx openpyxl
python src/verify_docx.py
```

### Output sẽ được tạo tại:
- `E:\Ôn thi\reports\ANSWER_VERIFICATION_REPORT.xlsx` — Mở bằng Excel
- `E:\Ôn thi\reports\ANSWER_VERIFICATION_REPORT.csv` — Backup CSV
- `E:\Ôn thi\reports\DATA_ERROR_REPORT.md` — Báo cáo Markdown đầy đủ

---

## 🎯 Đề Xuất Sửa Lỗi (Chờ Phê Duyệt)

> ❌ Tool chỉ báo cáo. KHÔNG tự động sửa.

| Lỗi | Đề xuất sửa | Ưu tiên |
|---|---|---|
| CRITICAL-01: ID mismatch | Sửa ID trong `questions.json` từ `02-15` → `01-14` | 🔴 Cao nhất |
| WARN-01: Non-MCQ | Chỉ tính điểm cho câu MCQ (loại câu text/seq khỏi totalQuestions) | 🟡 Cao |
| WARN-02: Hero button | Sửa `/setup/01` → `/setup/02` hoặc tùy đề muốn mở đầu | 🟡 Cao |
