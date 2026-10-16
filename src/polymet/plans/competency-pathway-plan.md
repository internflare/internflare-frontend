---
description: Competency-based Learn → Internships → Jobs pathway with eligibility gating
status: COMPLETED
created_at: "2026-10-13T04:02:01.438Z"
---
# Competency Pathway

## User Request
Restructure talent experience around 3 levels (Learn, Internships, Jobs) with role-specific assessments, configurable thresholds, eligibility-gated applications, reassessment, readiness overview, contextual cross-links, employer competency review; 10 acceptance journeys connected.

## Related Files
- src/polymet/data/pathway-data.tsx (create) roles, competencies, thresholds per opportunity, modules, questions, catalogue, personas
- src/polymet/lib/pathway-engine.ts (create) scoring + eligibility + recommendations
- src/polymet/components/pathway/pathway-provider.tsx (create) context store (nest-safe) + persona switch
- src/polymet/components/pathway/* (create) eligibility panel, level cards, next actions, competency table, opp card, persona switcher
- pages: opportunity-board-page (Internships/Jobs), learn-explore-page, learning-path-page, assessments-page, assessment-take-page, workspace-page
- edit: opportunity-detail-panel, opportunity-card, apply-dialog, sidebar nav, site-header/footer, dashboard, onboarding, employer candidate detail, prototype

## TODO List
- [x] Data + engine + provider
- [x] Pathway components
- [x] Internships & Jobs boards; gate detail panel/apply
- [x] Assessments hub + take/result flow
- [x] Learn explore + My learning path (evidence + reassessment)
- [x] Dashboard readiness overview; onboarding → career goal → assessment
- [x] Nav: talent + public header/footer/home links, workspace page, redirects; removed old opportunities/readiness pages
- [x] Employer competency review (candidate detail + compare row)
- [x] Prototype routes

## Important Notes
- Personas: amara (FE internship-ready, not job), tolu (data: neither → learn → reassess), kwame (backend job-ready, Scenario F), new (no assessments)
- Thresholds configurable per opportunity; eligibility per role, never permanent
