# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Localization (Farsi)**: Fully translated the assessment-taking page (`/take/page.tsx`) and result details page (`/results/[id]/page.tsx`). Added the respective translations for dictionary keys including dynamic terms like Archetypes into `fa.json`.
- **Compass 2D Chart**: Added a new, visually appealing 2D scatter/compass chart to `ResultsChart.tsx`. When an assessment has exactly 2 dimensions (e.g., standard Political Compass), this new interactive and animated compass UI renders instead of the default Radar chart (which would incorrectly render as a single flat line).
- **Custom Fonts**: Replaced site fonts with IRANSansX for the Persian application version, integrated fully via CSS and layout configuration.

### Fixed
- Fixed an issue where English strings were still visibly hardcoded in the interactive React components on the assessment pages. Handled fetching translations on both RSC and Client Component levels.
- Fixed the visual mapping of 2D assessments, properly orienting the Economic and Authority axes over a colored quadratic plane.
