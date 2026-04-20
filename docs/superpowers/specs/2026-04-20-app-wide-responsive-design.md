# App-Wide Responsive Design

## Goal

Make TrueFeed usable and visually stable across desktop, tablet, and mobile widths without changing the approved Warm Editorial visual system.

## Approved Behavior

- Desktop keeps the current social layout: left sidebar, centered main content, and right panel where available.
- Tablet keeps content centered, hides the right rail, and avoids any column overlap.
- Mobile uses a bottom navigation bar for Feed, People, and Profile instead of the desktop sidebar.
- Cards, search bars, profile headers, stories, feed inputs, and auth pages compress without text overflow.
- Main authenticated pages reserve bottom padding on mobile so content is not covered by the bottom navigation.
- Existing colors remain based on `#edede9`, `#d6ccc2`, and `#f5ebe0`.
- Existing data and auth behavior are unchanged.

## Target Surfaces

- Shared navigation shell
- Dashboard feed
- People search
- Public profile page
- Own profile page
- Auth layout
- Story strip
- Feed composer and post action rows

## Verification

- `npm run lint`
- `npm run build`
- Local route checks for `/dashboard`, `/people`, `/profile`, `/login`, and `/signup`
- Manual layout review at mobile, tablet, and desktop viewport sizes where browser tooling is available
