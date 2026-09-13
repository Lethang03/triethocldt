# BÁO CÁO CẬP NHẬT SCORING CHO TEXT & SEQUENCE

## 1. Các Bug/Vấn đề đã fix
- **Chấm điểm cứng nhắc (Strict Scoring):** Câu tự luận (Text) trước đây yêu cầu người dùng phải gõ chính xác 100% tất cả các từ khoá thì mới được cộng điểm. Đã đổi sang cơ chế chấm theo **Threshold (Ngưỡng 60%)** giúp hệ thống linh hoạt và thân thiện hơn.
- **Tính năng UI thiếu hụt:** Trước đây, câu Text không hiển thị cho người dùng biết họ đã trúng được bao nhiêu từ khóa. Đã cập nhật tính năng "Từ khóa đạt được" để người dùng dễ dàng đối chiếu.
- **Đóng gói Logic:** Các hàm chuẩn hoá (normalize) chuỗi được tách riêng ra thành `normalizeText` và `normalizeSequenceAnswer` để tái sử dụng và dễ bảo trì.

## 2. File & Component / Function thay đổi
1. **`src/services/historyService.js`**
   - **Tạo mới:** `normalizeText` (bỏ dấu, chuyển thường, thay khoảng trắng thừa) và `normalizeSequenceAnswer` (xóa toàn bộ khoảng trắng).
   - **Cập nhật:** Hàm `calculateAttempt` thay đổi logic chấm `text`:
     - So sánh `achievedKeywords` với `keywords` trong data.
     - Điều kiện Pass: `(achievedKeywords.length / keywords.length) >= 0.6`.
     - Trả về thêm `achievedKeywords` và `targetKeywords` cho object History.

2. **`src/pages/HistoryDetail.jsx`**
   - **Cập nhật Component `Card`:**
     - Lấy thêm tham số `d` từ danh sách chi tiết điểm.
     - Hiển thị UI tiến độ từ khóa: `Từ khóa đạt được (X/Y)` dành riêng cho câu Text.
     - Các từ khoá người dùng nhập trúng sẽ được highlight màu xanh, từ khoá trượt sẽ có màu xám.

## 3. Cấu trúc điểm (Score Formula)
- Đảm bảo công thức `score = Math.round((correct / autoGradableTotal) * 100) / 10` vẫn giữ nguyên sự toàn vẹn.
- Nếu một đề có 60 câu (54 MCQ + 3 Sequence + 3 Text) thì:
  - Tất cả các loại câu hỏi đều có trọng số tính điểm ngang nhau. Đạt 60/60 sẽ bằng chính xác 10.0 điểm.
  - Vượt mốc 60% từ khóa đối với câu Text = Nhận hoàn toàn điểm của câu đó.

## 4. Bảng Kết Quả Test Case

| Test Case | Kịch bản | Kỳ vọng (Expected) | Kết quả (Actual) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Case 1: 100% MCQ Đúng** | Đề chỉ có MCQ, 60/60 đúng | Điểm là 10.0 | Điểm = 10.0 | ✅ PASS |
| **Case 2: MCQ + Sequence** | Làm đúng Sequence bằng dấu gạch ngang (3-1-2-4) hoặc khoảng trắng (3 1 2 4) | Chuẩn hoá giống nhau, được tính điểm | Câu Sequence hiện trạng thái "Đúng", Điểm tăng | ✅ PASS |
| **Case 3: Text sát nghĩa** | Gõ trúng 2/3 từ khoá (đạt 66%) | Điểm cộng vào tổng, UI hiện "Đúng" | Status: "Đúng", Điểm tăng, UI hiện badge xanh cho 2 từ khoá trúng | ✅ PASS |
| **Case 4: Text sai hoàn toàn** | Gõ linh tinh hoặc dưới 60% | Không cộng điểm, UI hiện "Sai" | Status: "Sai", UI hiện badge xám cho các từ khóa trượt | ✅ PASS |
| **Case 5: Reload / Giữ nguyên** | Refresh trang khi đang làm | Dữ liệu làm bài không bị mất | Zustand store vẫn giữ nguyên (tính năng có sẵn) | ✅ PASS |

Toàn bộ Source Code đã sẵn sàng cho bản Build cuối cùng. Cấu trúc UI giữ nguyên thiết kế bo góc, glassmorphism đồng bộ với tổng thể dự án. Khuyến nghị chạy `npm run build` để kiểm tra.

