# App-Wide Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TrueFeed responsive across desktop, iPad/tablet, and mobile while preserving the Warm Editorial design.

**Architecture:** Add a shared mobile bottom navigation and update existing layout containers to use desktop sidebar only at large breakpoints. Keep page-level changes scoped to spacing, grid behavior, and wrapping so existing auth/API behavior remains untouched.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS utility classes, Framer Motion, lucide-react.

---

### Task 1: Shared Mobile Navigation

**Files:**
- Create: `components/layout/MobileNav.tsx`
- Modify: `components/layout/DashboardLayout.tsx`
- Modify: `app/people/page.tsx`
- Modify: `app/profile/[id]/page.tsx`
- Modify: `components/profile/ProfileContent.tsx`

- [x] Create a bottom nav that links to `/dashboard`, `/people`, and `/profile`.
- [x] Show the bottom nav below `lg`.
- [x] Add mobile bottom padding to authenticated layouts.

### Task 2: Layout Containers

**Files:**
- Modify: `components/layout/Sidebar.tsx`
- Modify: `components/layout/DashboardLayout.tsx`
- Modify: `app/people/page.tsx`
- Modify: `app/profile/[id]/page.tsx`
- Modify: `components/profile/ProfileContent.tsx`

- [x] Keep the sidebar desktop-only and prevent it from consuming mobile width.
- [x] Use responsive container padding and gap rules.
- [x] Keep the right panel hidden below `xl`.

### Task 3: Mobile Component Sizing

**Files:**
- Modify: `components/stories/StoryBar.tsx`
- Modify: `components/posts/Feed.tsx`
- Modify: `components/posts/PostCard.tsx`
- Modify: `components/auth/AuthLayout.tsx`

- [x] Make story cards narrower and horizontally scrollable on mobile.
- [x] Stack feed composer controls on narrow screens.
- [x] Wrap post action/comment rows safely.
- [x] Reduce auth shell minimum heights and padding on mobile.

### Task 4: Verification and Release

**Files:**
- Verify only.

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Check local route responses for `/dashboard`, `/people`, `/profile`, `/login`, and `/signup`.
- [x] Commit and push to `origin/deepesh-frontend`.
