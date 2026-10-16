---
description: Simulated AI assessments by role and expertise level with interview, code review and code-writing questions
status: COMPLETED
created_at: "2026-10-13T22:32:35.874Z"
---
# AI Assessments by Role & Expertise Level

## User Request
Assessments should be AI-driven, matched to the chosen role and expertise level (e.g. Junior Frontend Developer → production-level junior FE interview questions + code snippet tests). Same for backend, data analysis, virtual assistant and other roles. AI is simulated (no backend).

## Related Files
- src/polymet/data/pathway-data.tsx (edit) - ExpertiseLevel, RoleAssessment.level/report, virtual-assistant role
- src/polymet/data/ai-bank-engineering.tsx (create) - frontend + backend banks
- src/polymet/data/ai-bank-business.tsx (create) - data, VA, design, growth, support, programme banks
- src/polymet/lib/ai-assessment.ts (create) - generate, grade, level scaling, report
- src/polymet/components/assessment/* (create) - code block, question renderers, AI report
- src/polymet/pages/assessment-take-page.tsx (rewrite) - setup → generating → questions → evidence → review → grading → result
- src/polymet/components/pathway/pathway-provider.tsx (edit) - recordAssessment meta

## TODO List
- [x] Data model + VA role
- [x] Question banks
- [x] AI engine (generate/grade)
- [x] Assessment components
- [x] Rewrite take page
- [x] Assessments page shows level; bundle check

## Important Notes
- Levels: Intern · Junior · Mid · Senior. Score ceilings: intern 70, junior 88, mid 96, senior 100 (raw% × ceiling) so evidence + level decides placement.
- Formats: mcq, scenario, code-review, code-write, practical (non-coding).
- Label clearly: "Prototype: AI generation & grading simulated"; feedback must be explainable (rubric points covered/missed).
