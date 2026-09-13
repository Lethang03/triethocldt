# Text Question Support Report

- Added textarea input for every non-MCQ question, including `sequence` and `text` items in questions 55–60 of banks 02–11.
- Inputs use the existing persisted answer store, so they save while typing and survive refresh.
- Attempts now store answer type and text response. Text responses are marked `manual` or `unanswered-manual` and do not affect MCQ score.
- History Detail shows the submitted text, the reference answer, and `Chưa chấm thủ công`.
- MCQ scoring now uses the MCQ denominator only; text totals and answered text counts are stored separately.
