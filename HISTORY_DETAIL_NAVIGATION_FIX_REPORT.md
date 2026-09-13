# History Detail Navigation Fix Report

## Root cause

History and dashboard links previously opened `/review?attempt=<id>`. The `/review` route is protected by `ProtectedRoute`, which requires an active in-memory exam session. A history record is stored independently in local storage, so navigating from History—or refreshing—had no active session and was redirected to `/exams`.

## Route fix

Added an unprotected persisted-history route:

`/history/:id` → `HistoryDetail`

`HistoryDetail` uses the route parameter to call `getAttempt(id)`, then loads the saved attempt and matching question bank directly. It does not depend on `activeExam` state.

## Files changed

- `src/App.jsx`
- `src/pages/History.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/HistoryDetail.jsx`

## Test result

1. Opened localhost History with a real saved Đề 02 attempt.
2. Clicked **Xem chi tiết**.
3. Verified URL: `/history/ad4777ed-bb1f-489d-8ff1-a7bd6c125bd8`.
4. Verified detail page shows exam name, completion date, score, correct/wrong counts, duration, selected answer, correct answer, and question review.
5. Reloaded the detail URL; it remained on the history detail page and loaded the same persisted data.
6. Ran `npm.cmd run build`; build passed.
