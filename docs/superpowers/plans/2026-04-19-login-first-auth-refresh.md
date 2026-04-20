# Login First Auth Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved login-first Warm Editorial auth design to `/login` and `/signup`.

**Architecture:** Keep existing auth page behavior and validation logic. Update `AuthLayout` to provide a shared split shell, retheme the auth-only `Input` and `Button` controls, then update login/signup form markup and links to match the approved flow.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4.

---

### Task 1: Auth Spec and Plan

**Files:**
- Create: `docs/superpowers/specs/2026-04-19-login-first-auth-refresh-design.md`
- Create: `docs/superpowers/plans/2026-04-19-login-first-auth-refresh.md`

- [ ] Save the approved login-first auth design spec and implementation plan.

### Task 2: Shared Auth Shell and Controls

**Files:**
- Modify: `components/auth/AuthLayout.tsx`
- Modify: `components/ui/Input.tsx`
- Modify: `components/ui/Button.tsx`

- [ ] Replace the old blue/purple auth shell with the Warm Editorial split shell.
- [ ] Retheme `Input` and `Button` using warm neutral borders, `#edede9` input backgrounds, and `#6f6258` primary actions.
- [ ] Keep the children slot and `title`/`subtitle` API so login/signup behavior stays unchanged.

### Task 3: Login and Signup Pages

**Files:**
- Modify: `app/login/page.tsx`
- Modify: `app/signup/page.tsx`

- [ ] Restyle login form rows, remember checkbox, forgot link, divider, social buttons, and signup link.
- [ ] Restyle signup fields and ensure `/signup` uses the same layout with name, email, and password fields.
- [ ] Preserve validation, submit handlers, routes, and auth API calls.

### Task 4: Verification and GitHub Update

**Files:**
- All modified files

- [ ] Run `npm run lint`; expected exit status `0`.
- [ ] Run `npm run build`; expected exit status `0`.
- [ ] Commit with `style: apply warm editorial auth refresh`.
- [ ] Push `deepesh-frontend` to GitHub.
