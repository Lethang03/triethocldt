# Essay Answer Extraction Report

## Source method

Read every paragraph and every table in the Word files under `E:\Đề`. Answer tables at the document end were used as the only source.

## Extracted and enabled

| Exam | Questions | Type | Confidence |
| --- | --- | --- | --- |
| 02 | 55–57 | sequence | OK — exact order from Word table |
| 02 | 58–60 | text | OK — reference text from Word table |

The extracted entries are in `src/data/essayAnswers.json`. Text grading normalizes case, diacritics, punctuation, and spaces, then requires all source-derived keywords. Sequence grading compares normalized orders exactly.

## Need review

| Exams | Questions | Reason |
| --- | --- | --- |
| 03 | 55–60 | No 55–60 answer rows found in the parsed final Word tables |
| 04–07 | 55–60 | Answers were identified during extraction but have not been enabled pending full row-by-row source-to-data validation |
| 08–11 | 55–60 | Final Word tables contain keys through 54 only; no answer rows for 55–60 were found |

These questions remain saved as manual/not graded. No reference answer was invented from `questions.json`.

## Integration

- Attempt data now records `essayScore`, `sequenceScore`, and per-question grading metadata when a Word-derived reference exists.
- No Word file, question text, or existing correct-answer value was changed.
