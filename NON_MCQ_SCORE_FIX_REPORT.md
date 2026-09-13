# Non-MCQ Score Fix Report

## Root cause

Sequence answers were matched against a reference order but only accumulated `sequenceScore`. They did not increase `correct`, `wrong`, or `unanswered`, and were excluded from the score denominator. Text and sequence questions were also both presented as manual in History Detail.

## Fix applied

- Sequence questions now have `correct`, `wrong`, or `unanswered` status and increment the same counts as MCQ.
- The automatic-score denominator is `mcqTotal + sequenceTotal`.
- Text questions remain `pending` and are stored separately for manual grading.
- Saved answer records now include `type`, `userAnswer`, `correctAnswer`, `status`, and grading metadata for sequence entries.
- History Detail displays sequence answer, correct sequence, and actual status. Text remains `Chưa chấm`.

## Files changed

- `src/services/historyService.js`
- `src/pages/HistoryDetail.jsx`

## Validation

`npm.cmd run build` completed successfully. A direct Node unit invocation could not import Vite's JSON module without Node's JSON import attribute; this is a Node test-runner limitation, while Vite compiled the production app successfully.

Expected calculation behavior: for Đề 02 Q55, `3-1-2-4` is correct, increments `correct`, and participates in the auto-graded score. A different non-empty order increments `wrong`; blank increments `unanswered`.
