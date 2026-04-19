# Warm Editorial Minimalist Refresh Design

## Goal

Refresh TrueFeed's frontend with the approved Warm Editorial minimalist direction while preserving the current dashboard, story strip, post feed, right panel, and profile layouts.

## Approved Visual Direction

Use the palette requested by the user:

- `#edede9` for the app canvas and low-emphasis controls.
- `#d6ccc2` for warm active states, hover surfaces, and secondary component backgrounds.
- `#f5ebe0` for cards, panels, modals, and editorial surfaces.

The visual tone should be warm, calm, and social-media polished without bright blue/purple gradients. Primary dark accents should be lighter than black, using warm charcoal/taupe tones so active tabs and buttons do not feel harsh.

## Layout Requirements

Keep the existing layout structure:

- Sidebar remains on the left.
- Main dashboard keeps top bar, story section, composer, and post feed.
- Right panel remains separate and must not overlap the feed.
- Profile page keeps the current two-column grid, profile header, tabs, posts, and about panel.

Spacing must be even between major layout regions and repeated components. The right rail should have explicit spacing from the feed and should wrap or hide gracefully on narrower screens rather than colliding with main content.

## Component Requirements

Dashboard:

- Replace colorful gradients with layered neutral Warm Editorial backgrounds.
- Use warm cards with subtle borders and softer shadows.
- Use Framer Motion transitions already present in the codebase for entrance and hover polish.

Stories:

- Keep horizontal story cards.
- Make the add-story tile neutral and editorial.
- Add softer hover lift and cleaner arrow controls.

Posts:

- Keep post creation and post card behavior unchanged.
- Restyle cards, composer, AI badges, action row, comment input, and empty/loading states.
- Replace blue actions with warm charcoal/taupe actions.

Profile:

- Keep profile layout and tabs.
- Replace the vivid cover gradient with a warm editorial neutral cover.
- Lighten active tabs and button accents.
- Keep profile cards readable and evenly spaced.

Modals and right panel:

- Apply matching neutral surfaces to create-post and create-story modals.
- Restyle right-panel requests and contacts so they match the dashboard palette.

## Verification

This repository currently has `lint` and `build` scripts, but no test runner script. Production verification will use:

- `npm run lint`
- `npm run build`

Manual visual review was performed through the browser mockup companion before implementation.
