# Localhost Exam Test Report

## Environment

- URL: `http://127.0.0.1:5173`
- Browser: Brave Browser
- Date: 2026-09-10
- Production check: `npm.cmd run build` passed.

## Summary

| Check | Result |
| --- | --- |
| Exam cards/routes available | 14/14 |
| Exams with a runnable question bank | 13/14 |
| Questions in runnable banks | 810 |
| Full-bank answer-key scoring simulations | 13 passed |
| Live UI submission/review/history check | Passed for Đề 02 |
| Build | Passed |

The requested total of 840 questions cannot be verified: the catalog has 14 metadata records, but Đề 01 has no bank; the runnable data comprises ten 60-question exams (02–11) and three 70-question exams (12–14), for 810 questions.

## Live user-flow result

Đề 02 was opened through the localhost UI. A displayed shuffled question whose stored key was `B` was answered with its displayed `B` option, then submitted.

- Result screen: 1 correct, 0 wrong, 59 unanswered, 2%, `0.2/10`.
- Formula verification: `1 / 60 * 10 = 0.166…`, displayed as `0.2`.
- Review page marked the saved answer as correct and displayed key `B`.
- After browser refresh, History still contained the attempt with its exam name, timestamp, score, correct/wrong/unanswered counts, and a link to saved review.

## Per-exam test results

| Exam | Questions | UI availability | Answer-key simulation | Result |
| --- | ---: | --- | --- | --- |
| 01 | 0 | Setup opens; Start is disabled | Not possible | Fail: source bank missing |
| 02 | 60 | Live flow exercised | 60/60 = 10.0 | Pass |
| 03 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 04 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 05 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 06 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 07 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 08 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 09 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 10 | 60 | Route/card available | 60/60 = 10.0 | Pass |
| 11 | 60 | Route/card available | 60/60 = 10.0 | Pass with data defect |
| 12 | 70 | Route/card available | 70/70 = 10.0 | Pass |
| 13 | 70 | Route/card available | 70/70 = 10.0 | Pass |
| 14 | 70 | Route/card available | 70/70 = 10.0 | Pass |

## Detailed errors and limitations

### Đề 01 — missing question bank

- Location: `src/data/questions.json`
- Issue: no record with `id: "01"`; setup reports 0 questions and disables Start.
- Effect: this exam cannot be taken, submitted, reviewed, or scored.
- Recommended fix: supply a verified 60-question source bank and answer keys. Do not copy or infer questions from another exam.

### Đề 11, question 32 — malformed option array

- Current options contain three entries. The first entry merges `A` and `B`:
  `A. ... điều kiện cụ thể. B. Tuyệt đối hóa vai trò của thực tiễn.`
- Stored key: `A`.
- Effect: the key still resolves to an option, but the displayed multiple-choice question is malformed and has no separately selectable B answer.
- Recommended fix: restore four independently sourced A/B/C/D options; manual source verification required.

### Non-MCQ scoring behavior

- Location: Result scoring and `historyService` calculation.
- Issue: every non-empty response to text/fill-in questions is counted as correct; it is not compared with the stored model answer.
- Effect: text questions can inflate score even when the entered answer is wrong.
- Recommended fix: mark these questions as manual-review/unscored, or implement an approved comparison/rubric. Do not use approximate string matching without a grading policy.

## Answer-key validation

For all 810 runnable questions, every stored MCQ key resolved to an available displayed option and simulated key-selected submission produced a full score. No blank key or invalid answer letter was found in runnable banks. This validates key-to-option mapping, not independent academic correctness of source material.

## Console/assets

The localhost page loaded with all required assets visible and no runtime error page was observed. The available browser test surface did not expose browser console logs, so a claim of zero console messages cannot be made from UI evidence alone.

## Suggested next actions

1. Add the verified Đề 01 source bank.
2. Repair Đề 11 question 32 from the original material.
3. Decide and implement a grading policy for non-MCQ answers.
4. Re-run the full live UI suite after those changes.
