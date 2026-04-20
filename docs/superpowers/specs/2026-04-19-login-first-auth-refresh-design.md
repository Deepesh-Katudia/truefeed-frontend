# Login First Auth Refresh Design

## Goal

Refresh the TrueFeed login and signup screens with the approved Warm Editorial palette while keeping authentication behavior unchanged.

## Approved Direction

Use the same palette as the dashboard refresh:

- `#edede9` for page background and input surfaces.
- `#d6ccc2` for warm brand surfaces and active accents.
- `#f5ebe0` for auth cards and form panels.
- Warm charcoal and taupe tones for primary actions and links.

The login page is the default auth experience. It shows only the login form on the right side. The signup link routes to `/signup`. The signup page uses the same layout and brand panel, but the right-side form area contains signup fields.

## Layout

- Keep a split auth shell: brand story panel on the left, form card on the right.
- Remove the old saturated blue/purple gradient panel.
- Keep the left panel rich but minimalist, using neutral gradients, a TrueFeed logo mark, headline copy, and a small social preview card.
- On tablet and mobile, stack the brand panel above the form without clipping or overlap.
- Forms should use consistent spacing, labels, inputs, social buttons, dividers, and link treatment.

## Behavior

- Login validation, submit behavior, remember checkbox, and forgot link remain unchanged.
- Signup validation and submit behavior remain unchanged.
- Login page links to `/signup`; signup page links to `/login`.
- No backend/API behavior changes.

## Verification

Run:

- `npm run lint`
- `npm run build`

Expected: both exit with status `0`.
