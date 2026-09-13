# MCQ Answer Audit Report

## Scope and method

Audited all MCQ entries in question banks `02` through `15`. Each record was checked for non-empty question content, exactly four options, ordered A/B/C/D labels, a stored `correct` value in A/B/C/D, and a matching labeled option. Duplicate option text was also detected.

No independent source answer key exists in this repository. The existing `exam-qa-tool/reports/ANSWER_REPORT.csv` is generated from `questions.json` itself, so it cannot independently verify whether an answer letter is academically correct. Therefore, this audit verifies data integrity only; it makes no claimed content-level correction or guessed expected answer.

## Summary

| Metric | Count |
| --- | ---: |
| Total MCQ checked | 820 |
| Passed structural/key checks | 818 |
| Failed | 2 |
| Warnings | 1 |
| Missing/invalid MCQ correct letters | 0 |
| Correct letters without matching labeled option | 0 |

The warning is the existing metadata count mismatch for bank `12` (metadata 60 vs actual 70), retained unchanged by request.

## Per-exam results

| Question bank | MCQ checked | Passed | Failed |
| --- | ---: | ---: | ---: |
| 02–10 | 54 each | 54 each | 0 |
| 11 | 54 | 53 | 1 |
| 12 | 70 | 70 | 0 |
| 13 | 70 | 70 | 0 |
| 14 | 70 | 69 | 1 |
| 15 | 70 | 70 | 0 |

## Failures requiring review

### Đề 11 — Câu 32

- Question: “Một người lấy kết quả của một trường hợp cá biệt rồi khẳng định đó là quy luật đúng trong mọi hoàn cảnh. Sai lầm chủ yếu là:”
- Current answer: `A`
- Expected answer: Need manual source-key verification
- Status: **FAILED — option count**
- Detail: The first array element combines `A.` and `B.` text; the array has three elements rather than four distinct options.

### Đề 14 — Câu 27

- Question: “Quan hệ giữa chất với kết cấu của sự vật là:”
- Current answer: `A`
- Expected answer: Need manual source-key verification
- Status: **FAILED — duplicate option text**
- Detail: Options `B` and `D` are both “Chất hoàn toàn độc lập với kết cấu của sự vật.”

## Answer-key comparison status

No separate authoritative answer-key file was found under the project. As a result:

- Wrong-letter comparison: **not determinable without a source key**
- Shifted-key comparison: **not determinable without a source key**
- Content validity: **not guessed**

No answers were changed.
