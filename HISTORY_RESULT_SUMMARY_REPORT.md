# History Result Summary Report

## Files changed

- `src/services/historyService.js`
- `src/pages/HistoryDetail.jsx`

## Calculation logic

At submission, `calculateAttempt()` evaluates every saved response:

- **Correct:** selected MCQ option letter matches its stored key; text response exactly matches the stored model answer.
- **Wrong:** a selected answer exists but does not match.
- **Unanswered:** selected answer is empty.

The saved history record now includes `correctCount`, `wrongCount`, `unansweredCount`, `wrongQuestionNumbers`, `unansweredQuestionNumbers`, `selectedAnswers`, `correctAnswers`, and the existing per-question `answers` detail. Question-ID lists are stored in ascending numeric order.

For existing browser history created before this update, History Detail derives the lists from its saved per-question results, preserving compatibility.

## UI result

History Detail now shows a dark premium **Kết quả làm bài** card containing total questions, correct, wrong, and unanswered cards plus color-coded wrong/unanswered question lists. Empty lists display **Không có**.

## Test result

Opened a real saved 60-question Đề 02 result in localhost History Detail. The summary displayed 1 correct, 0 wrong, 59 unanswered, **Câu sai: Không có**, and all 59 actual unanswered question IDs. These values matched the saved result and per-question review.

`npm.cmd run build` completed successfully after the implementation.
