# Statistics System Report

## Mock data found

The previous dashboard displayed hardcoded totals (`5` exams, `8.6` average, `75%` progress, and a `5`-day streak), static chart bars, and three fake recent-exam cards. Result calculations existed only in React memory and were lost on refresh. No history, API, database, or browser storage was used.

## Files changed

- `src/services/historyService.js`
- `src/store/useStore.js`
- `src/pages/Result.jsx`
- `src/pages/Review.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/History.jsx`
- `src/components/Navbar.jsx`
- `src/App.jsx`

## New data flow

1. Starting an exam creates an attempt ID.
2. Submitting opens Result, which calculates correct, wrong, unanswered, score, percentage, duration, and selected/correct answer detail from the actual attempt.
3. Result saves that attempt to browser local storage, idempotently by attempt ID.
4. Dashboard and History read the saved records; their cards, weekly counts, recent attempts, average score, unique completed exams, and streak are all calculated on demand.
5. Review can display either the current attempt or any saved attempt from History.

## Storage

`localStorage.exam_history` contains an array of attempts with `id`, exam metadata, timestamps, duration, totals, score, percentage, and per-question `{ questionId, selected, correct, result }` records. There is no login or backend dependency.

## Testing result

- Build run: `npm.cmd run build`.
- Existing quiz submission flow now persists a full result before display.
- Dashboard, history, and review read the same persisted data after navigation or refresh.
