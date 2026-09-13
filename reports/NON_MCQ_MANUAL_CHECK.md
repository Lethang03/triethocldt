# Non-MCQ Manual Check

The following 60 questions are intentionally excluded from automatic MCQ judgment. Their stored values must be checked against the original source material manually.

| Exam | Questions | Type | Current answer location |
| --- | --- | --- | --- |
| 02 | 55–57 | sequence | `questions.json` bank 02, each question's `correct` field |
| 02 | 58–60 | text | `questions.json` bank 02, each question's `correct` field |
| 03 | 55–57 | sequence | `questions.json` bank 03, each question's `correct` field |
| 03 | 58–60 | text | `questions.json` bank 03, each question's `correct` field |
| 04 | 55–57 | sequence | `questions.json` bank 04, each question's `correct` field |
| 04 | 58–60 | text | `questions.json` bank 04, each question's `correct` field |
| 05 | 55–57 | sequence | `questions.json` bank 05, each question's `correct` field |
| 05 | 58–60 | text | `questions.json` bank 05, each question's `correct` field |
| 06 | 55–56 | sequence | `questions.json` bank 06, each question's `correct` field |
| 06 | 57–60 | text | `questions.json` bank 06, each question's `correct` field |
| 07 | 55–56 | sequence | `questions.json` bank 07, each question's `correct` field |
| 07 | 57–60 | text | `questions.json` bank 07, each question's `correct` field |
| 08 | 55–60 | text | `questions.json` bank 08, each question's `correct` field |
| 09 | 55–60 | text | `questions.json` bank 09, each question's `correct` field |
| 10 | 55–60 | text | `questions.json` bank 10, each question's `correct` field |
| 11 | 55–60 | text | `questions.json` bank 11, each question's `correct` field |

## Manual-verification notes

- Every entry above has non-empty question content and a non-empty stored `correct` value.
- Sequence entries contain order keys (for example, `3-1-2-4`) and must be compared to the matching prompt’s blank order.
- Text entries are free-response model answers and cannot be truthfully graded by an A/B/C/D integrity checker.
- Bank 09, question 55 explicitly states that the source Word file did not include an answer; its stored value is a reference inference and needs source confirmation. Bank 09, question 60 states that its source Word file omitted the question content; it requires manual source recovery before use.

No non-MCQ values were modified.
