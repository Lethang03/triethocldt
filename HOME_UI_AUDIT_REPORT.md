# Home UI Audit Report

## Root cause: duplicate scrollbar

`src/pages/Home.jsx` applied Tailwind's `overflow-x-hidden` to the Home wrapper. In CSS, setting one overflow axis to `hidden` coerces the other axis to `auto`; therefore this wrapper became a second vertical scroll container when its content exceeded its height.

The same pattern was also present on the root elements in `src/index.css`.

## Solution applied

- Replaced horizontal `hidden` overflow with `clip` on the root and Home page. `clip` blocks accidental horizontal paint overflow without creating an additional scroll container.
- Kept ordinary document scrolling as the one vertical scroll path.
- Added bottom space for the fixed compact navigation at viewport widths below `lg`, so content is never covered by it.

## Files changed

- `src/index.css`
- `src/pages/Home.jsx`
- `src/components/HeroSection.jsx`
- `src/components/Navbar.jsx`
- `src/components/StatsCard.jsx`

## UI improvements

- Navbar uses its full navigation at `lg` and above. Tablet and mobile now use the compact fixed navigation instead of squeezing desktop navigation into an unsafe width.
- Home gutters, hero typography and vertical spacing scale down on small screens.
- The mobile hero starts at a practical minimum height rather than a fixed viewport-height layout.
- The statistics grid is one column on compact mobile, two columns on small/tablet widths, and four columns on desktop.
- Statistics cards have a consistent minimum height, subtle border/glass hover treatment, icon transition, and a light four-pixel lift.
- Existing links, exam routes, question data and statistics logic were not changed.

## Responsive and browser checks

The local page was inspected at the available desktop browser viewport (1394 x 889): the hero content is readable, navigation is aligned, the background remains covered, and document width equals client width (1386 px), so there is no horizontal page scroll.

DOM scroll diagnostics after the fix found no nested element with `overflow-y: auto` or `scroll`; the only scrollable document is the browser page. The breakpoint definitions cover the requested layouts:

| Width | Layout |
| --- | --- |
| 1920 / 1440 | Four statistic cards; full navbar |
| 1024 / 768 | Two statistic cards; compact navigation |
| 390 | One statistic card; stacked hero actions; compact navigation |

## Performance

The background uses the existing single image asset and a slow 25-second transform animation. Card effects are transform/color transitions only; no new heavy animation or runtime data work was added.

## Validation

`npm.cmd run build` was run after these changes and completed successfully.
