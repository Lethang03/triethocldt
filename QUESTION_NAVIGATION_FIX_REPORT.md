# Báo Cáo Fix Lỗi Nút Chuyển Câu (Previous/Next)

## Nguyên Nhân Lỗi
- Nút "Câu trước" và "Câu tiếp theo" truyền một callback function vào `setCurrentIndex` (ví dụ: `setCurrentIndex(c => Math.max(0, c - 1))`).
- Store Zustand (`useStore.js`) được định nghĩa là `setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index })`.
- Vì Zustand gán trực tiếp giá trị truyền vào thay vì thực thi nó, `currentQuestionIndex` trở thành một function thay vì một số nguyên (integer).
- Khi render, mảng `questions[function()]` trả về `undefined`, dẫn đến crash ứng dụng (blank page).

## Chi Tiết Chỉnh Sửa
- Trong file `src/pages/Quiz.jsx`, đã cập nhật tất cả 4 nút (Desktop và Mobile):
  - **Câu trước:** Thay thế `setCurrentIndex(c => Math.max(0, c - 1))` bằng `setCurrentIndex(Math.max(0, currentIndex - 1))`
  - **Câu tiếp theo:** Thay thế `setCurrentIndex(c => Math.min(questions.length - 1, c + 1))` bằng `setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))`

## Kết Quả
- Navigation hoạt động an toàn, truyền trực tiếp số nguyên vào Zustand store.
- Lỗi blank page (React crash) đã được xử lý triệt để.
