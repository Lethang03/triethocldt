# Full Website Audit Report

## Summary

The localhost application loads successfully and production build succeeds. Core flows for available banks work without login: start, answer, refresh during quiz, submit, result, review, history, and statistics persistence.

Release readiness is blocked by missing verified source data for Đề 01 and a malformed option record in Đề 11 question 32. These cannot be responsibly repaired without the original source material.

## Test environment

- Local URL: `http://127.0.0.1:5173`
- Browser: Brave Browser
- Date: 2026-09-10
- Build: `npm.cmd run build` — passed

## Fixed during this audit

| Fix | Verification |
| --- | --- |
| Persist active quiz session in browser storage | Selected-answer count remained `1 / 60` after page refresh. |
| Clear stored question/session state on reset | Reset now clears both answers and active question list. |

## Detailed results

| Feature | Status | Issue |
|---------|--------|-------|
| Home | Pass (visual smoke check) | Background asset is large; see performance. |
| Dashboard | Pass | Values are derived from saved local history; no seeded statistic values. |
| Exam list | Partial | All 14 cards display in order, but card 01 cannot run. |
| Exam loading | Fail | Đề 01 has no question bank; setup has 0 questions and disabled Start. |
| Quiz | Pass for 02–14 | Selection, navigation, timer, and navigator render. Session state persists after refresh. |
| Result | Pass | Live test: 1 correct / 0 wrong / 59 unanswered produced 0.2/10. |
| Review | Pass | Saved answer, correct key, status, and explanation area display. |
| History | Pass | Live result remained visible after refresh with detail link. |
| Build | Pass | Vite build completed without import, JSON, or syntax errors. |

## Live user-flow evidence

Đề 02 was exercised through the actual UI:

1. Opened setup and started a 60-question test.
2. Selected the displayed `B` option for a shuffled question with stored key `B`.
3. Submitted via the in-app submit control.
4. Result showed 1 correct, 0 wrong, 59 unanswered, 2%, and `0.2/10`—consistent with `1 / 60 * 10` rounded to one decimal place.
5. Review marked the selected answer correct and showed key `B`.
6. History persisted the result after browser refresh.
7. A separate active-quiz refresh test retained the selected-answer count (`1 / 60`).

## Data audit

| IDs | Bank status | Count |
| --- | --- | ---: |
| 01 | Missing | 0 |
| 02–11 | Present | 60 each |
| 12–14 | Present | 70 each |

There are 14 metadata records but only 13 runnable banks, totaling 810 questions. The stated expectation of 14 × 60 = 840 cannot currently be met. No question data was deleted or fabricated.

### Data defects

1. **Đề 01:** no `questions.json` bank exists for ID `01`. Source material is required before this can be fixed.
2. **Đề 11, question 32:** three stored option entries exist because the B text is merged into option A. The answer key `A` still maps, but the UI presents malformed choices. Restore A/B/C/D from the verified source.
3. **Text/fill-in questions:** current score logic treats every non-empty entry as correct. This needs a defined rubric or manual-review state before high-stakes production scoring.

## UI and responsive observations

- Global `overflow-x: hidden` prevents horizontal page scrolling.
- Exam list is configured for 1 column on mobile, 2 on tablet, and 4 on desktop.
- The tested desktop layout had no clipped cards or blank page.
- Full viewport emulation at 1920×1080, 1440×900, 768×1024, and 390×844 was not exposed by the available browser control surface; responsive behavior is therefore code-reviewed plus desktop smoke-tested, not certified across every requested viewport.

## Performance observations

- Home background image emitted by the production build: approximately 1.69 MB.
- Main JavaScript bundle emitted by the production build: approximately 706 kB (Vite issued a chunk-size warning).
- Recommendation: convert/compress the background to AVIF/WebP and lazy-load/split route-heavy code before public release.

## Console and asset check

No broken-asset or runtime-error page appeared during localhost flows, and production build passed. The available browser automation surface did not provide direct console-log access, so a literal “zero console messages” claim cannot be certified from the browser UI alone.

## Remaining issues / release gate

Do not declare the site fully production-ready until:

1. a verified Đề 01 question bank and key are supplied,
2. Đề 11 question 32 is restored from source,
3. text-answer scoring policy is approved and implemented,
4. responsive viewports and browser-console output are checked with a full browser-devtools test pass.
