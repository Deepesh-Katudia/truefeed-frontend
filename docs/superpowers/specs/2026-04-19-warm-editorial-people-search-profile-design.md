# Warm Editorial People Search and Profile Refresh Design

## Goal

Make People/Search and public profile pages feel like the existing Warm Editorial TrueFeed redesign, while making people search use real Supabase database profiles and support friend requests from search results and user profiles.

## Approved Behavior

- `/people` uses the same palette as the dashboard/auth refresh: `#edede9`, `#d6ccc2`, `#f5ebe0`, warm ink text, soft borders, and restrained shadows.
- The search page loads real profiles from the backend database after authentication.
- Empty search shows available database profiles, excluding the logged-in user.
- Typed search filters by profile fields and updates results without requiring Enter.
- Each result exposes relationship state: friend, incoming pending, outgoing pending, or addable.
- Clicking `Add Friend` sends a backend friend request and updates the result state immediately.
- `/profile/[id]` uses the same visual system and provides an active `Add Friend` action when the viewed profile is addable.
- Existing JWT auth remains unchanged: frontend sends `Authorization: Bearer <token>` and backend reads `req.user.userId`.

## Backend Contract

- `GET /api/v1/friends/search?q=&limit=30` returns `{ results: Person[] }`.
- `q` may be empty. Empty `q` means directory mode.
- Query mode searches name, email, and description.
- Results exclude the current user and include:
  - `_id`
  - `name`
  - `email`
  - `picture`
  - `description`
  - `isFriend`
  - `incomingPending`
  - `outgoingPending`
- `POST /api/v1/friends/request` remains the request action.

## Verification

- Backend regression tests cover directory-mode search and query-mode search.
- Frontend lint/build must pass.
- Manual HTTP verification should confirm search and friend request endpoints still require JWT.
