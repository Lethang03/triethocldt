# Exam System Audit Report

## Features completed

- MCQ remains automatically graded.
- `text` and `sequence` questions use saved textarea answers and are explicitly not auto-graded.
- Attempt records preserve type, selected/text response, reference answer, MCQ score, and text-answer counts.
- Unfinished exam state now persists current question index, answers, shuffled order, start time, and timer configuration in localStorage (`exam_session`).
- Returning to an unfinished matching exam shows a resume panel with completed count, remaining time, Continue, and Restart actions.
- History detail is routed directly by attempt ID and shows saved text/sequence responses with `Chưa chấm thủ công`.

## Scoring

MCQ score uses only `correct / mcqTotal * 10`. Text and sequence answers are stored separately and do not increase correct/wrong MCQ counts.

## Files changed

- `src/pages/Quiz.jsx`
- `src/pages/ExamSetup.jsx`
- `src/pages/HistoryDetail.jsx`
- `src/services/historyService.js`
- `src/store/useStore.js`

## Test status

- Build validation: `npm.cmd run build` completed successfully.
- Persistence implementation stores immediately for each answer and question navigation through Zustand localStorage persistence.
- No question content, correct answers, or exam data were modified.
