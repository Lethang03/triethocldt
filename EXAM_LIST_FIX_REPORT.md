# Exam List Fix Report

## Root cause

`extract.js` previously read only the initial `banks` object in the source HTML. The banks for exams 10–15 are appended afterward with `banks["id"] = ...` assignments, so the generated `questions.json` incorrectly stopped at exam 09. The list component maps its input without a slice or pagination limit; its input was incomplete.

The supplied source has no question bank for exam 01. `examMeta.json` now supplies the requested complete 01–14 catalog. Exam 01 remains visible and its setup screen prevents an empty quiz from starting until its question bank is available.

## Files changed

- `extract.js`
- `src/data/questions.json` (regenerated)
- `src/data/examMeta.json`
- `src/pages/ExamList.jsx`
- `src/components/ExamCard.jsx`
- `src/pages/ExamSetup.jsx`

## Solution applied

- Fixed extraction of appended question banks; questions 10–14 are now in `questions.json`.
- Added ordered metadata for every requested exam ID, 01 through 14.
- Rendered the list from the ordered catalog and matched available question banks by ID.
- Updated the grid to one column on mobile, two on tablet, and four from the large desktop breakpoint upward.
- Refined cards with stable status/action text, two-digit number badges, glass treatment, blue glow, hover motion, and wrapping metadata.
- Preserved quiz behavior for all populated question banks and guarded the only empty bank.
