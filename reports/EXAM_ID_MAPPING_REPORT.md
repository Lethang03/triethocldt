# Exam ID Mapping Report

## Change applied

`src/data/examMeta.json` was updated only. Its fourteen IDs now run from `02` through `15`, which exactly matches the fourteen banks in `src/data/questions.json`.

`questions.json` was not edited.

| Metadata ID | Matching question-bank ID | Questions loaded |
| --- | --- | ---: |
| 02–11 | 02–11 | 60 each |
| 12–15 | 12–15 | 70 each |

## Result

- Missing metadata banks: 0
- Metadata IDs with no question bank: 0
- Question banks with no metadata: 0
- Banks that would load as `0 câu hỏi` due to ID mismatch: 0

## Important compatibility note

Titles, badges, duration, and the existing `questionCount` fields were deliberately kept unchanged as requested. Consequently, the metadata records now retain their original display labels while their IDs target the corresponding source bank. Two existing metadata counts (`id` 12 reports 60; bank 12 has 70) remain unchanged and are reported as warnings rather than being altered.

## Scope

No question, answer, scoring, or exam-flow code was changed.

## Localhost check

With the development server running, the Exam List rendered fourteen setup links in this exact order: `/setup/02`, `/setup/03`, `/setup/04`, `/setup/05`, `/setup/06`, `/setup/07`, `/setup/08`, `/setup/09`, `/setup/10`, `/setup/11`, `/setup/12`, `/setup/13`, `/setup/14`, `/setup/15`. No exam card displayed `0 câu hỏi`.

`npm.cmd run build` also completed successfully after the mapping update.
