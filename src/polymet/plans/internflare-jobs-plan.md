---
description: "First generation of internflareJobs: public marketing site, auth, talent onboarding and talent workspace."
status: COMPLETED
created_at: "2026-10-13T02:43:16.986Z"
---
# internflareJobs — First generation

## User Request
Build internflareJobs frontend (talent marketplace) per PRD sections 1–8: public site, auth, talent onboarding, talent dashboard & workspace, readiness/learning, AI career tools. Brand palette: #fd7128 / #591e00 / #997fff / #1d1d1d / white.

## Related Files
- src/index.css, tailwind.config.js (theme)
- src/polymet/data/opportunities-data.tsx, talent-data.tsx, pricing-data.tsx
- src/polymet/components/* (shared UI)
- src/polymet/layouts/marketing-layout.tsx, auth-layout.tsx, talent-layout.tsx
- src/polymet/pages/* (public + talent pages)
- src/polymet/prototypes/internflare-jobs.tsx

## TODO List
- [x] 404 + permission-denied pages (system-pages.tsx), catch-all route
- [x] Dark mode: AppThemeProvider + ThemeToggle in all headers, Appearance in settings
- [x] Responsive sweep: wrapping tabs, mobile calendar dots, onboarding invite row
- [x] Theme tokens + fonts
- [x] Mock data
- [x] Shared components (badges, cards, detail panel, dialogs, header/footer, sidebar, topbar)
- [x] Layouts (marketing, auth, talent)
- [x] Public pages: home, opportunities, detail, company, portfolio, pricing
- [x] Auth pages (auth-pages.tsx exports SignIn/SignUp/Forgot/Reset/VerifyEmail)
- [x] Talent: onboarding, dashboard, applications, saved, notifications, interviews, offers (+SquadCot handoff)
- [x] Readiness, learning, career tools (hub + /app/tools/:toolId), profile, portfolio builder, settings (BillingPanel shared)
- [x] Client acquisition (leads-pages.tsx + leads-workspace-pages.tsx, routed)
- [x] Mentorship marketplace (mentors-pages.tsx, routed)
- [x] Employer: layout, onboarding, dashboard, listings, editor, candidates, hiring, billing, locked talent search (all routed)
- [x] Workspace handoff states (offers-page: pending → provisioned)
- [x] Cross-cutting: 404 catch-all route + generic permission-denied page
- [x] Final link verification pass (all major routes now wired)

## Important Notes
- Sections 9-15 added by user: leads (manual outreach only, metrics 'user-recorded'), mentorship, employer recruitment, SquadCot handoff. Admin frontend is separate (not built).
- page-states.tsx: StateBlock, CardListSkeleton, PageHeader
- OpportunitiesPage has `embedded` prop for /app/opportunities
- Routes planned: /app/leads, /app/mentors, /employer/* ; sign-in links to /app and /employer, sign-up -> /onboarding or /employer/onboarding provider + leaving-Internflare dialog
- AI match only when data exists; evidence labels self-reported/employer-confirmed/verified
- Pricing: only documented entitlements; others "pending configuration"
