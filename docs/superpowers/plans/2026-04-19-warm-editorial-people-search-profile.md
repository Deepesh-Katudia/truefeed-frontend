# Warm Editorial People Search and Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle People/Search and public profiles while making search return real database profiles and support friend requests.

**Architecture:** Keep the current custom JWT backend. Extend the existing friends search model/controller to support directory mode, then consume the same API from `/people`, right-panel contacts, and `/profile/[id]`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS classes, Express 5, Supabase JS, Node test runner.

---

### Task 1: Backend Search Contract

**Files:**
- Modify: `E:/TrueFeed/truefeed-backend-main/src/models/userModel.test.js`
- Modify: `E:/TrueFeed/truefeed-backend-main/src/models/userModel.js`
- Modify: `E:/TrueFeed/truefeed-backend-main/src/controllers/friendsController.js`

- [ ] Add failing tests that prove empty search returns database users and query search includes description.
- [ ] Update `searchUsers()` to allow empty `q`, search name/email/description when provided, and keep safe limits.
- [ ] Update the friends controller so empty `q` no longer returns `400`.
- [ ] Run `npm test` and confirm all backend tests pass.

### Task 2: People/Search UI

**Files:**
- Modify: `E:/TrueFeed/truefeed-frontend/app/people/page.tsx`

- [ ] Replace the current white/blue page with Warm Editorial layout.
- [ ] Load directory results on mount with empty query.
- [ ] Debounce search input and show live results.
- [ ] Keep explicit search button for keyboard/mouse users.
- [ ] Add relationship-aware result buttons and immediate outgoing-pending update.
- [ ] Link profile cards to `/profile/[id]` without blocking the friend request button.

### Task 3: Public Profile UI and Friend Request

**Files:**
- Modify: `E:/TrueFeed/truefeed-frontend/app/profile/[id]/page.tsx`

- [ ] Restyle public profile into the same Warm Editorial system.
- [ ] Add an active `Add Friend` request button when the relationship is addable.
- [ ] Update relation state immediately after request succeeds.
- [ ] Keep protected routing to `/login` when unauthenticated.

### Task 4: Right-Panel Search Consistency

**Files:**
- Modify: `E:/TrueFeed/truefeed-frontend/components/right-panel/Contacts.tsx`

- [ ] Let empty contact search show directory-style suggestions using the backend search contract.
- [ ] Keep friend request state updates aligned with the People page.

### Task 5: Verification and Release

**Files:**
- Verify only; no additional files expected.

- [ ] Run backend `npm test`.
- [ ] Run frontend `npm run lint`.
- [ ] Run frontend `npm run build`.
- [ ] Verify backend health and protected search behavior through local HTTP calls.
- [ ] Commit and push backend changes.
- [ ] Commit and push frontend changes.
