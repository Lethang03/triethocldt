# 📋 EXAM QA TOOL — Hướng Dẫn Sử Dụng

## Giới thiệu
**Exam QA Tool** là bộ công cụ tự động kiểm tra toàn diện cho nền tảng **Ôn Thi Pro** trước khi phát hành.

---

## Cài Đặt

```bash
cd "E:\Ôn thi\exam-qa-tool"
npm install
```

---

## Chạy Kiểm Tra

### ✅ Chạy toàn bộ (không cần dev server)
```bash
node run-test.js
```
Bao gồm: Data Validation + Answer Verification + Scoring Test + History Logic + Review Mapping + Structure Check

### 🌐 Chạy E2E (cần dev server đang chạy)
```bash
# Terminal 1: Khởi động dev server
cd "E:\Ôn thi"
npm run dev

# Terminal 2: Chạy E2E test
cd "E:\Ôn thi\exam-qa-tool"
node src/04-e2e-playwright.js
```

---

## Cấu Trúc Thư Mục

```
exam-qa-tool/
├── config.json                    ← Cấu hình tool
├── package.json
├── run-test.js                    ← 🚀 CHẠY TẤT CẢ TẠI ĐÂY
├── README.md
├── src/
│   └── 04-e2e-playwright.js       ← E2E test (cần dev server)
└── reports/                       ← Tự động tạo khi chạy
    ├── FULL_QA_REPORT.md          ← Báo cáo tổng hợp
    ├── EXAM_DATA_REPORT.md        ← Chi tiết dữ liệu câu hỏi
    ├── ANSWER_REPORT.csv          ← Đáp án (mở bằng Excel)
    ├── SCORING_TEST_REPORT.md     ← Kiểm tra chấm điểm
    ├── HISTORY_TEST_REPORT.md     ← Kiểm tra lịch sử
    ├── E2E_TEST_REPORT.md         ← Kết quả E2E (sau khi chạy)
    └── screenshots/               ← Ảnh chụp lỗi E2E
```

---

## Các Module Kiểm Tra

| # | Module | Mô tả | Dev Server? |
|---|---|---|---|
| 1 | Data Validation | Kiểm tra cấu trúc, số câu, nội dung câu hỏi | Không |
| 2 | Answer Key Verification | Kiểm tra đáp án A/B/C/D hợp lệ | Không |
| 3 | Scoring Logic | Kiểm tra công thức chấm điểm 3 case | Không |
| 4 | E2E Playwright | Test luồng thực tế qua trình duyệt | **Cần** |
| 5 | History Structure | Kiểm tra cấu trúc object lịch sử | Không |
| 6 | Review Mapping | Kiểm tra ánh xạ đáp án trong trang Review | Không |
| 7 | Project Structure | Kiểm tra sự tồn tại các file quan trọng | Không |

---

## Hiểu Kết Quả

- ✅ **PASSED** — Kiểm tra thành công
- ❌ **FAILED** — Phát hiện lỗi cần khắc phục
- ⚠️ **WARNING** — Cảnh báo (không ảnh hưởng nghiêm trọng)

---

## Quy Tắc Quan Trọng

> ❌ Tool này **CHỈ PHÁT HIỆN VÀ BÁO CÁO**. Không tự động sửa dữ liệu.
> Mọi việc sửa chữa phải được xem xét và phê duyệt thủ công.

