# Warm Editorial Minimalist Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Warm Editorial minimalist palette and spacing refinements to TrueFeed's production frontend without changing data flow or page structure.

**Architecture:** Keep component boundaries as-is and make scoped Tailwind class updates in the dashboard, story, post, profile, modal, and right-panel components. Use the existing Framer Motion transitions where present, and add only class-level transition refinements where needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, lucide-react.

---

### Task 1: Shared Design Documentation

**Files:**
- Modify: `.gitignore`
- Create: `docs/superpowers/specs/2026-04-19-warm-editorial-minimalist-refresh-design.md`
- Create: `docs/superpowers/plans/2026-04-19-warm-editorial-minimalist-refresh.md`

- [ ] **Step 1: Ignore local mockup sessions**

Add this entry to `.gitignore`:

```gitignore
/.superpowers/
```

- [ ] **Step 2: Save approved design spec**

Save the approved Warm Editorial requirements in `docs/superpowers/specs/2026-04-19-warm-editorial-minimalist-refresh-design.md`, including palette, layout, component, and verification requirements.

- [ ] **Step 3: Save implementation plan**

Save this implementation plan in `docs/superpowers/plans/2026-04-19-warm-editorial-minimalist-refresh.md`.

### Task 2: Dashboard Shell and Sidebar

**Files:**
- Modify: `components/layout/DashboardLayout.tsx`
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Update dashboard background and spacing**

In `DashboardLayout.tsx`, replace the colorful dashboard background with neutral `#edede9`, `#f5ebe0`, and `#d6ccc2` surfaces. Keep the main content structure, but add responsive spacing so the right panel does not overlap the feed.

- [ ] **Step 2: Restyle dashboard actions**

Replace blue/indigo create buttons, avatar borders, live badge, and accent strips with warm charcoal/taupe classes.

- [ ] **Step 3: Update sidebar**

In `Sidebar.tsx`, replace gradient brand and active states with `#d6ccc2` and warm charcoal accents. Keep the nav item layout and routing unchanged.

### Task 3: Stories and Posts

**Files:**
- Modify: `components/stories/StoryBar.tsx`
- Modify: `components/stories/StoryCreateModal.tsx`
- Modify: `components/stories/StoryViewer.tsx`
- Modify: `components/posts/Feed.tsx`
- Modify: `components/posts/PostCard.tsx`
- Modify: `components/posts/CreatePostModal.tsx`

- [ ] **Step 1: Restyle story cards**

Keep the horizontal story strip, but use neutral add-story and story hover styles. Keep existing story loading and viewer behavior unchanged.

- [ ] **Step 2: Restyle post composer and feed states**

Use warm cards, neutral inputs, taupe hover states, and charcoal primary actions in `Feed.tsx`.

- [ ] **Step 3: Restyle post cards**

Update post card background, border, media framing, AI badges, comment input, comments, and action row. Preserve like/comment behavior.

- [ ] **Step 4: Restyle post and story modals**

Apply the same palette to modal backdrops, surfaces, textareas, file actions, preview remove controls, and submit buttons.

### Task 4: Profile and Right Panel

**Files:**
- Modify: `components/profile/ProfileContent.tsx`
- Modify: `components/right-panel/Requests.tsx`
- Modify: `components/right-panel/Contacts.tsx`

- [ ] **Step 1: Restyle profile page**

Keep the profile page grid and tab behavior. Replace vivid gradients with a warm neutral cover, lighter active tabs, warm cards, and matching edit buttons.

- [ ] **Step 2: Restyle right-panel content**

Apply neutral headings, badges, inputs, friend request buttons, and contact status states while preserving API behavior.

### Task 5: Verification and GitHub Update

**Files:**
- All modified files

- [ ] **Step 1: Run lint**

Run:

```powershell
npm run lint
```

Expected: command exits with status `0`.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: command exits with status `0`.

- [ ] **Step 3: Review Git diff**

Run:

```powershell
git -c safe.directory=E:/TrueFeed/truefeed-frontend status --short
git -c safe.directory=E:/TrueFeed/truefeed-frontend diff --stat
```

Expected: only scoped frontend styling/docs changes are present.

- [ ] **Step 4: Commit and push**

Run:

```powershell
git -c safe.directory=E:/TrueFeed/truefeed-frontend add .
git -c safe.directory=E:/TrueFeed/truefeed-frontend commit -m "style: apply warm editorial minimalist refresh"
git -c safe.directory=E:/TrueFeed/truefeed-frontend push origin deepesh-frontend
```

Expected: commit succeeds and branch is pushed to GitHub.
