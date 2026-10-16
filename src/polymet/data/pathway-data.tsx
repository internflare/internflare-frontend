/* ------------------------------------------------------------------ */
/* Competency pathway configuration                                    */
/* Thresholds are configurable per role and per opportunity.           */
/* ------------------------------------------------------------------ */

export type PathwayLevel = "internship" | "job";
export type StatedGoal = "internship" | "job" | "exploring";
export const statedGoalLabel: Record<StatedGoal, string> = { internship: "An internship", job: "A job", exploring: "Not sure yet" };
export type EvidenceKind = "self-reported" | "assessed" | "employer-confirmed" | "verified";

export interface Competency {
  id: string;
  label: string;
  description: string;
}

export interface CareerRole {
  id: string;
  title: string;
  family: string;
  competencies: Competency[];
  /** Default overall thresholds (0–100). Opportunities may override. */
  thresholds: Record<PathwayLevel, number>;
  /** Default minimum per competency at each level. */
  coreMins: Record<PathwayLevel, { competencyId: string; min: number }[]>;
}

export const careerRoles: CareerRole[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    family: "Engineering",
    competencies: [
      { id: "fe-react", label: "React & component design", description: "Builds composable, stateful UI components" },
      { id: "fe-ts", label: "TypeScript", description: "Types props, data and APIs safely" },
      { id: "fe-testing", label: "Automated testing", description: "Writes unit and integration tests for user flows" },
      { id: "fe-a11y", label: "Accessibility", description: "Meets WCAG basics for forms, focus and semantics" },
      { id: "fe-deploy", label: "Production delivery", description: "Has shipped and maintained work used by real people" },
      { id: "fe-comm", label: "Written communication", description: "Explains decisions clearly in PRs and case studies" },
    ],
    thresholds: { internship: 60, job: 72 },
    coreMins: {
      internship: [{ competencyId: "fe-react", min: 55 }],
      job: [{ competencyId: "fe-testing", min: 60 }, { competencyId: "fe-deploy", min: 60 }],
    },
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    family: "Data",
    competencies: [
      { id: "da-sql", label: "SQL querying", description: "Joins, aggregates and filters relational data" },
      { id: "da-sheets", label: "Spreadsheet analysis", description: "Pivot tables, lookups and clean data structures" },
      { id: "da-stats", label: "Statistics basics", description: "Averages, distributions and comparing groups" },
      { id: "da-viz", label: "Data visualisation", description: "Chooses honest, readable charts and dashboards" },
      { id: "da-comm", label: "Insight communication", description: "Summarises findings for non-technical readers" },
    ],
    thresholds: { internship: 58, job: 72 },
    coreMins: {
      internship: [{ competencyId: "da-sql", min: 55 }],
      job: [{ competencyId: "da-sql", min: 70 }, { competencyId: "da-stats", min: 60 }],
    },
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    family: "Engineering",
    competencies: [
      { id: "be-api", label: "API design", description: "Designs predictable, versioned HTTP APIs" },
      { id: "be-db", label: "Databases & SQL", description: "Models data, writes migrations and indexes" },
      { id: "be-testing", label: "Automated testing", description: "Covers services with unit and integration tests" },
      { id: "be-deploy", label: "Production operations", description: "Deploys, monitors and debugs live services" },
      { id: "be-comm", label: "Technical communication", description: "Documents designs and incidents clearly" },
    ],
    thresholds: { internship: 60, job: 74 },
    coreMins: {
      internship: [{ competencyId: "be-api", min: 55 }],
      job: [{ competencyId: "be-db", min: 65 }, { competencyId: "be-deploy", min: 60 }],
    },
  },
  {
    id: "product-designer",
    title: "Product Designer",
    family: "Design",
    competencies: [
      { id: "pd-research", label: "User research", description: "Plans and synthesises interviews and tests" },
      { id: "pd-interaction", label: "Interaction design", description: "Designs clear flows and states" },
      { id: "pd-visual", label: "Visual design", description: "Typography, layout and brand consistency" },
      { id: "pd-proto", label: "Prototyping", description: "Builds testable prototypes in Figma or code" },
      { id: "pd-comm", label: "Design communication", description: "Presents rationale and handles critique" },
    ],
    thresholds: { internship: 60, job: 72 },
    coreMins: { internship: [{ competencyId: "pd-interaction", min: 55 }], job: [{ competencyId: "pd-research", min: 60 }] },
  },
  {
    id: "growth-marketer",
    title: "Growth Marketer",
    family: "Marketing",
    competencies: [
      { id: "gm-content", label: "Content & copy", description: "Writes channel-appropriate content" },
      { id: "gm-analytics", label: "Marketing analytics", description: "Reads funnels and attribution reports" },
      { id: "gm-experiments", label: "Experimentation", description: "Designs and evaluates simple A/B tests" },
      { id: "gm-comm", label: "Stakeholder communication", description: "Reports results and next steps" },
    ],
    thresholds: { internship: 55, job: 70 },
    coreMins: { internship: [], job: [{ competencyId: "gm-analytics", min: 60 }] },
  },
  {
    id: "support-engineer",
    title: "Support Engineer",
    family: "Engineering",
    competencies: [
      { id: "se-troubleshoot", label: "Troubleshooting", description: "Reproduces and isolates customer issues" },
      { id: "se-apis", label: "APIs & logs", description: "Reads API responses and logs" },
      { id: "se-comm", label: "Customer communication", description: "Explains fixes with empathy and clarity" },
    ],
    thresholds: { internship: 55, job: 65 },
    coreMins: { internship: [], job: [{ competencyId: "se-comm", min: 65 }] },
  },
  {
    id: "virtual-assistant",
    title: "Virtual Assistant",
    family: "Operations",
    competencies: [
      { id: "va-calendar", label: "Calendar & inbox management", description: "Triages email and schedules across time zones" },
      { id: "va-tools", label: "Productivity tools", description: "Google Workspace, Notion, spreadsheets and automations" },
      { id: "va-comm", label: "Professional communication", description: "Writes clear, polite, on-brand messages" },
      { id: "va-judgement", label: "Prioritisation & discretion", description: "Handles urgency, confidentiality and escalation" },
    ],
    thresholds: { internship: 55, job: 68 },
    coreMins: { internship: [], job: [{ competencyId: "va-comm", min: 65 }] },
  },
  {
    id: "programme-assistant",
    title: "Programme Assistant",
    family: "Operations",
    competencies: [
      { id: "pa-facilitation", label: "Facilitation", description: "Runs sessions for small groups" },
      { id: "pa-digital", label: "Digital tools", description: "Uses Google Workspace confidently" },
      { id: "pa-comm", label: "Communication", description: "Writes clear updates and reports" },
    ],
    thresholds: { internship: 50, job: 65 },
    coreMins: { internship: [], job: [] },
  },
];

export const getRole = (id: string) => careerRoles.find((r) => r.id === id);

/* ---------------- Opportunity requirements (employer-configured) ---------------- */

export interface OpportunityRequirement {
  roleId: string;
  level: PathwayLevel;
  threshold: number;
  competencyMins: { competencyId: string; min: number }[];
  employment: "Internship" | "Full-time" | "Part-time" | "Contract" | "Freelance" | "Graduate · Full-time";
  /** Shown to candidates so thresholds are transparent. */
  configuredBy: string;
}

export const opportunityRequirements: Record<string, OpportunityRequirement> = {
  "frontend-engineering-intern": { roleId: "frontend-developer", level: "internship", threshold: 60, competencyMins: [{ competencyId: "fe-react", min: 55 }, { competencyId: "fe-a11y", min: 50 }], employment: "Internship", configuredBy: "Paystack Labs hiring team" },
  "product-design-intern": { roleId: "product-designer", level: "internship", threshold: 60, competencyMins: [{ competencyId: "pd-interaction", min: 55 }], employment: "Internship", configuredBy: "Brightwave Studio" },
  "growth-marketing-intern": { roleId: "growth-marketer", level: "internship", threshold: 55, competencyMins: [], employment: "Internship", configuredBy: "Lumen Commerce" },
  "community-volunteer": { roleId: "programme-assistant", level: "internship", threshold: 50, competencyMins: [], employment: "Internship", configuredBy: "OpenBridge Foundation" },
  "ux-writer-closed": { roleId: "product-designer", level: "internship", threshold: 55, competencyMins: [], employment: "Internship", configuredBy: "Brightwave Studio" },
  "data-analyst-intern": { roleId: "data-analyst", level: "internship", threshold: 58, competencyMins: [{ competencyId: "da-sql", min: 55 }], employment: "Internship", configuredBy: "AgroVest" },
  "data-analyst-graduate": { roleId: "data-analyst", level: "job", threshold: 68, competencyMins: [{ competencyId: "da-sql", min: 65 }], employment: "Graduate · Full-time", configuredBy: "AgroVest" },
  "support-engineer-ext": { roleId: "support-engineer", level: "job", threshold: 65, competencyMins: [], employment: "Part-time", configuredBy: "Internflare default for external listings" },
  "backend-engineer-junior": { roleId: "backend-engineer", level: "job", threshold: 70, competencyMins: [{ competencyId: "be-db", min: 60 }], employment: "Full-time", configuredBy: "Paystack Labs hiring team" },
  "backend-engineer-mid": { roleId: "backend-engineer", level: "job", threshold: 78, competencyMins: [{ competencyId: "be-testing", min: 70 }], employment: "Full-time", configuredBy: "Nimbus Health" },
  "freelance-brand-ext": { roleId: "product-designer", level: "job", threshold: 70, competencyMins: [{ competencyId: "pd-visual", min: 70 }], employment: "Freelance", configuredBy: "Internflare default for external listings" },
  "frontend-developer-junior": { roleId: "frontend-developer", level: "job", threshold: 72, competencyMins: [{ competencyId: "fe-testing", min: 60 }, { competencyId: "fe-deploy", min: 60 }], employment: "Full-time", configuredBy: "Lumen Commerce" },
  "react-contractor-remote": { roleId: "frontend-developer", level: "job", threshold: 78, competencyMins: [{ competencyId: "fe-testing", min: 70 }], employment: "Contract", configuredBy: "Brightwave Studio" },
  "design-grad": { roleId: "product-designer", level: "job", threshold: 72, competencyMins: [{ competencyId: "pd-research", min: 65 }], employment: "Graduate · Full-time", configuredBy: "Paystack Labs hiring team" },
};

/* ---------------- Learning modules (recommended pathway) ---------------- */

export interface LearningResource {
  title: string;
  source: string;
  url: string;
  kind: "Article" | "Video" | "Course" | "Docs" | "Tutorial";
}

export interface PathwayModule {
  id: string;
  roleId: string;
  title: string;
  kind: "Module" | "Practical project";
  duration: string;
  /** Points added to each competency once completed AND evidence is accepted at reassessment. */
  boosts: Record<string, number>;
  resources: LearningResource[];
  assignment: string;
  evidenceRequired: boolean;
}

export const pathwayModules: PathwayModule[] = [
  { id: "fe-m1", roleId: "frontend-developer", title: "Accessible forms and interactions", kind: "Module", duration: "2 weeks", boosts: { "fe-a11y": 8 }, resources: [{ title: "Forms tutorial", source: "W3C WAI", url: "https://www.w3.org/WAI/tutorials/forms/", kind: "Docs" }], assignment: "Audit and fix a sign-up form; submit before/after notes.", evidenceRequired: true },
  { id: "fe-m2", roleId: "frontend-developer", title: "Testing React applications", kind: "Module", duration: "2 weeks", boosts: { "fe-testing": 22 }, resources: [{ title: "Testing Library — Introduction", source: "testing-library.com", url: "https://testing-library.com/docs/", kind: "Docs" }, { title: "Vitest guide", source: "vitest.dev", url: "https://vitest.dev/guide/", kind: "Docs" }], assignment: "Add tests covering 3 user flows in one of your portfolio projects.", evidenceRequired: true },
  { id: "fe-m3", roleId: "frontend-developer", title: "Ship a public tool", kind: "Practical project", duration: "2 weeks", boosts: { "fe-deploy": 20, "fe-comm": 4 }, resources: [{ title: "Deploying a Vite app", source: "vitejs.dev", url: "https://vitejs.dev/guide/static-deploy.html", kind: "Docs" }], assignment: "Deploy a small tool, collect usage from at least 10 people and write a short case study.", evidenceRequired: true },
  { id: "fe-m4", roleId: "frontend-developer", title: "Data fetching & caching", kind: "Module", duration: "2 weeks", boosts: { "fe-react": 5, "fe-ts": 4 }, resources: [{ title: "TanStack Query overview", source: "tanstack.com", url: "https://tanstack.com/query/latest/docs/framework/react/overview", kind: "Docs" }], assignment: "Refactor a project to use a caching data layer and document trade-offs.", evidenceRequired: false },

  { id: "da-m1", roleId: "data-analyst", title: "SQL fundamentals", kind: "Module", duration: "3 weeks", boosts: { "da-sql": 30 }, resources: [{ title: "SQLBolt interactive lessons", source: "sqlbolt.com", url: "https://sqlbolt.com/", kind: "Tutorial" }, { title: "Intro to SQL", source: "Kaggle Learn", url: "https://www.kaggle.com/learn/intro-to-sql", kind: "Course" }], assignment: "Answer 10 business questions against the sample cooperative dataset and share your queries.", evidenceRequired: true },
  { id: "da-m2", roleId: "data-analyst", title: "Statistics for analysts", kind: "Module", duration: "2 weeks", boosts: { "da-stats": 22 }, resources: [{ title: "Statistics and probability", source: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability", kind: "Course" }], assignment: "Compare two farmer groups and explain whether the difference is meaningful.", evidenceRequired: true },
  { id: "da-m3", roleId: "data-analyst", title: "Build a weekly insights dashboard", kind: "Practical project", duration: "2 weeks", boosts: { "da-viz": 20, "da-comm": 10 }, resources: [{ title: "Data visualization", source: "Kaggle Learn", url: "https://www.kaggle.com/learn/data-visualization", kind: "Course" }], assignment: "Publish a dashboard and a one-page summary for a non-technical reader.", evidenceRequired: true },

  { id: "be-m1", roleId: "backend-engineer", title: "Service observability", kind: "Module", duration: "2 weeks", boosts: { "be-deploy": 8 }, resources: [{ title: "OpenTelemetry concepts", source: "opentelemetry.io", url: "https://opentelemetry.io/docs/concepts/", kind: "Docs" }], assignment: "Instrument one service with traces and a dashboard.", evidenceRequired: false },
  { id: "pd-m1", roleId: "product-designer", title: "Usability testing basics", kind: "Module", duration: "2 weeks", boosts: { "pd-research": 18 }, resources: [{ title: "Usability testing 101", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/usability-testing-101/", kind: "Article" }], assignment: "Run 3 moderated tests and share a synthesis.", evidenceRequired: true },
  { id: "gm-m1", roleId: "growth-marketer", title: "Analytics for marketers", kind: "Module", duration: "2 weeks", boosts: { "gm-analytics": 20 }, resources: [{ title: "Google Analytics Academy", source: "Google Skillshop", url: "https://skillshop.withgoogle.com/", kind: "Course" }], assignment: "Diagnose a funnel drop-off from a sample report.", evidenceRequired: true },
];

/* ---------------- Assessments ---------------- */

export const scoringRules = [
  { part: "AI interview & code questions", weight: 85, detail: "One AI-generated question per competency at your chosen level. Each answer is graded against a published rubric (points covered vs missed)." },
  { part: "Level ceiling", weight: 0, detail: "Raw scores are scaled by level: Intern max 70, Junior 88, Mid 96, Senior 100 — harder levels can prove more." },
  { part: "Practical evidence", weight: 15, detail: "A working link to relevant work adds up to 10 points per competency; a description adds 4. Capped at the level ceiling." },
];


/* ---------------- Explore Learning catalogue (open to everyone) ---------------- */

export interface CatalogueItem {
  id: string;
  title: string;
  provider: string;
  url: string;
  kind: "Course" | "Video" | "Docs" | "Tutorial" | "Practical project";
  topic: "Frontend" | "Backend" | "Data" | "Design" | "Marketing" | "Career skills";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  free: boolean;
  roleId?: string;
}

export const catalogueTopics = ["Frontend", "Backend", "Data", "Design", "Marketing", "Career skills"] as const;

export const catalogue: CatalogueItem[] = [
  { id: "c1", title: "Learn web development", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn", kind: "Docs", topic: "Frontend", level: "Beginner", duration: "Self-paced", free: true, roleId: "frontend-developer" },
  { id: "c2", title: "React — Quick start", provider: "react.dev", url: "https://react.dev/learn", kind: "Docs", topic: "Frontend", level: "Beginner", duration: "4 hrs", free: true, roleId: "frontend-developer" },
  { id: "c3", title: "Responsive Web Design certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", kind: "Course", topic: "Frontend", level: "Beginner", duration: "300 hrs", free: true, roleId: "frontend-developer" },
  { id: "c4", title: "Testing Library — Introduction", provider: "testing-library.com", url: "https://testing-library.com/docs/", kind: "Docs", topic: "Frontend", level: "Intermediate", duration: "2 hrs", free: true, roleId: "frontend-developer" },
  { id: "c5", title: "Web accessibility tutorials", provider: "W3C WAI", url: "https://www.w3.org/WAI/tutorials/", kind: "Tutorial", topic: "Frontend", level: "Intermediate", duration: "6 hrs", free: true, roleId: "frontend-developer" },
  { id: "c6", title: "SQLBolt interactive lessons", provider: "sqlbolt.com", url: "https://sqlbolt.com/", kind: "Tutorial", topic: "Data", level: "Beginner", duration: "5 hrs", free: true, roleId: "data-analyst" },
  { id: "c7", title: "Intro to SQL", provider: "Kaggle Learn", url: "https://www.kaggle.com/learn/intro-to-sql", kind: "Course", topic: "Data", level: "Beginner", duration: "3 hrs", free: true, roleId: "data-analyst" },
  { id: "c8", title: "Statistics and probability", provider: "Khan Academy", url: "https://www.khanacademy.org/math/statistics-probability", kind: "Course", topic: "Data", level: "Beginner", duration: "Self-paced", free: true, roleId: "data-analyst" },
  { id: "c9", title: "Node.js — Introduction", provider: "nodejs.org", url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs", kind: "Docs", topic: "Backend", level: "Beginner", duration: "3 hrs", free: true, roleId: "backend-engineer" },
  { id: "c10", title: "PostgreSQL tutorial", provider: "postgresql.org", url: "https://www.postgresql.org/docs/current/tutorial.html", kind: "Docs", topic: "Backend", level: "Intermediate", duration: "6 hrs", free: true, roleId: "backend-engineer" },
  { id: "c11", title: "Figma Design for beginners", provider: "Figma Learn", url: "https://help.figma.com/hc/en-us/sections/30880632542743-Figma-Design-for-beginners", kind: "Video", topic: "Design", level: "Beginner", duration: "2 hrs", free: true, roleId: "product-designer" },
  { id: "c12", title: "Usability testing 101", provider: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/usability-testing-101/", kind: "Docs", topic: "Design", level: "Beginner", duration: "20 min", free: true, roleId: "product-designer" },
  { id: "c13", title: "Google Analytics Academy", provider: "Google Skillshop", url: "https://skillshop.withgoogle.com/", kind: "Course", topic: "Marketing", level: "Beginner", duration: "6 hrs", free: true, roleId: "growth-marketer" },
  { id: "c14", title: "Writing a strong case study", provider: "Internflare Guides", url: "https://www.nngroup.com/articles/ux-portfolio-case-study/", kind: "Docs", topic: "Career skills", level: "Beginner", duration: "15 min", free: true },
  { id: "p1", title: "Accessible sign-up form audit", provider: "Internflare practical", url: "https://www.w3.org/WAI/tutorials/forms/", kind: "Practical project", topic: "Frontend", level: "Beginner", duration: "1 week", free: true, roleId: "frontend-developer" },
  { id: "p2", title: "Cooperative payments SQL challenge", provider: "Internflare practical", url: "https://sqlbolt.com/", kind: "Practical project", topic: "Data", level: "Beginner", duration: "1 week", free: true, roleId: "data-analyst" },
  { id: "p3", title: "Build a REST API with tests", provider: "Internflare practical", url: "https://nodejs.org/en/learn", kind: "Practical project", topic: "Backend", level: "Intermediate", duration: "2 weeks", free: true, roleId: "backend-engineer" },
  { id: "p4", title: "Redesign an onboarding flow", provider: "Internflare practical", url: "https://www.nngroup.com/articles/usability-testing-101/", kind: "Practical project", topic: "Design", level: "Intermediate", duration: "2 weeks", free: true, roleId: "product-designer" },
];

/* ---------------- Demo candidates (prototype personas) ---------------- */

export interface CompetencyResult {
  score: number;
  evidence: EvidenceKind;
}


/* ---------------- Expertise levels (AI assessment difficulty) ---------------- */

export type ExpertiseLevel = "intern" | "junior" | "mid" | "senior";

export const expertiseLevels: { id: ExpertiseLevel; label: string; years: string; focus: string; ceiling: number }[] = [
  { id: "intern", label: "Intern", years: "0 years · student or career-switcher", focus: "Fundamentals, reading code, following conventions", ceiling: 70 },
  { id: "junior", label: "Junior", years: "0–2 years", focus: "Shipping production features with review, debugging, testing basics", ceiling: 88 },
  { id: "mid", label: "Mid-level", years: "2–5 years", focus: "Owning features end-to-end, performance, trade-offs, mentoring", ceiling: 96 },
  { id: "senior", label: "Senior", years: "5+ years", focus: "System design, reliability, cross-team decisions", ceiling: 100 },
];

export const getLevel = (id: ExpertiseLevel) => expertiseLevels.find((l) => l.id === id)!;

export interface AiQuestionResult {
  questionId: string;
  competencyId: string;
  kind: string;
  title: string;
  raw: number;
  covered: string[];
  missed: string[];
  summary: string;
}

export interface AiAssessmentReport {
  level: ExpertiseLevel;
  rawAverage: number;
  demonstratedLevel: ExpertiseLevel | "below-intern";
  summary: string;
  results: AiQuestionResult[];
  durationMins: number;
}
export interface RoleAssessment {
  roleId: string;
  scores: Record<string, CompetencyResult>;
  assessedOn: string;
  attempts: number;
  history: { date: string; overall: number; kind: "Assessment" | "Reassessment" }[];
  /** Expertise level the AI assessment was generated at. */
  level?: ExpertiseLevel;
  report?: AiAssessmentReport;
}

export interface LearningProgress {
  completed: string[];
  evidence: Record<string, { url: string; note: string }>;
  /** Modules whose boosts were already counted at a reassessment. */
  appliedBoosts?: string[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  headline: string;
  scenario: string;
  targetRoleId: string | null;
  statedGoal: StatedGoal;
  priorPathway?: string;
  assessments: Record<string, RoleAssessment>;
  learning: Record<string, LearningProgress>;
  applied: string[];
}

const s = (score: number, evidence: EvidenceKind = "assessed"): CompetencyResult => ({ score, evidence });

export const demoCandidates: CandidateProfile[] = [
  {
    id: "amara",
    name: "Amara Okafor",
    firstName: "Amara",
    avatar: "https://github.com/denizbuyuktas.png",
    headline: "Frontend Developer · Accessibility-focused",
    scenario: "Internship-ready, building toward job-ready",
    targetRoleId: "frontend-developer",
    statedGoal: "job",
    assessments: {
      "frontend-developer": {
        roleId: "frontend-developer",
        scores: { "fe-react": s(82, "verified"), "fe-ts": s(76), "fe-testing": s(48), "fe-a11y": s(85, "employer-confirmed"), "fe-deploy": s(55, "self-reported"), "fe-comm": s(74) },
        assessedOn: "08 May 2025",
        attempts: 3,
        level: "junior",
        history: [
          { date: "20 Jan 2025", overall: 51, kind: "Assessment" },
          { date: "12 Mar 2025", overall: 62, kind: "Reassessment" },
          { date: "08 May 2025", overall: 70, kind: "Reassessment" },
        ],
      },
    },
    learning: { "frontend-developer": { completed: ["fe-m1"], evidence: { "fe-m1": { url: "https://github.com/amara/form-audit", note: "Before/after audit" } }, appliedBoosts: ["fe-m1"] } },
    applied: [],
  },
  {
    id: "tolu",
    name: "Tolu Adebayo",
    firstName: "Tolu",
    avatar: "https://github.com/denizcdemirci.png",
    headline: "Aspiring Data Analyst · Economics graduate",
    scenario: "Not yet internship- or job-ready",
    targetRoleId: "data-analyst",
    statedGoal: "job",
    assessments: {
      "data-analyst": {
        roleId: "data-analyst",
        scores: { "da-sql": s(38), "da-sheets": s(62, "self-reported"), "da-stats": s(40), "da-viz": s(45), "da-comm": s(60) },
        assessedOn: "10 May 2025",
        attempts: 1,
        level: "intern",
        history: [{ date: "10 May 2025", overall: 49, kind: "Assessment" }],
      },
    },
    learning: { "data-analyst": { completed: [], evidence: {} } },
    applied: [],
  },
  {
    id: "kwame",
    name: "Kwame Mensah",
    firstName: "Kwame",
    avatar: "https://github.com/yusufhilmi.png",
    headline: "Backend Engineer · Node.js & PostgreSQL",
    scenario: "Job-ready — evidence above previous pathway",
    targetRoleId: "backend-engineer",
    statedGoal: "internship",
    priorPathway: "Completed a backend internship at Paystack Labs (Jan–Apr 2025)",
    assessments: {
      "backend-engineer": {
        roleId: "backend-engineer",
        scores: { "be-api": s(86, "employer-confirmed"), "be-db": s(82, "verified"), "be-testing": s(78), "be-deploy": s(80, "employer-confirmed"), "be-comm": s(76) },
        assessedOn: "06 May 2025",
        attempts: 2,
        level: "junior",
        history: [
          { date: "05 Jan 2025", overall: 63, kind: "Assessment" },
          { date: "06 May 2025", overall: 80, kind: "Reassessment" },
        ],
      },
    },
    learning: {},
    applied: [],
  },
  {
    id: "new",
    name: "New account",
    firstName: "there",
    avatar: "",
    headline: "Just registered",
    scenario: "No assessments yet",
    targetRoleId: null,
    statedGoal: "job",
    assessments: {},
    learning: {},
    applied: [],
  },
];

/* ---------------- Employer view: candidate competency results ---------------- */

export const employerCandidateCompetencies: Record<string, RoleAssessment & { interviewResult?: string; testTaskResult?: string }> = {
  c1: { roleId: "frontend-developer", scores: { "fe-react": s(82, "verified"), "fe-ts": s(76), "fe-testing": s(48), "fe-a11y": s(85, "employer-confirmed"), "fe-deploy": s(55, "self-reported"), "fe-comm": s(74) }, assessedOn: "08 May 2025", attempts: 3, history: [], interviewResult: "Interview scheduled 22 May" },
  c2: { roleId: "frontend-developer", scores: { "fe-react": s(74), "fe-ts": s(62, "self-reported"), "fe-testing": s(58), "fe-a11y": s(52), "fe-deploy": s(66, "employer-confirmed"), "fe-comm": s(68) }, assessedOn: "04 May 2025", attempts: 1, history: [] },
  c3: { roleId: "frontend-developer", scores: { "fe-react": s(66), "fe-ts": s(48, "self-reported"), "fe-testing": s(40), "fe-a11y": s(58), "fe-deploy": s(70, "self-reported"), "fe-comm": s(62) }, assessedOn: "12 May 2025", attempts: 2, history: [] },
  c4: { roleId: "backend-engineer", scores: { "be-api": s(80, "employer-confirmed"), "be-db": s(74, "verified"), "be-testing": s(66), "be-deploy": s(72, "employer-confirmed"), "be-comm": s(70) }, assessedOn: "09 May 2025", attempts: 1, history: [], testTaskResult: "Paid test task in progress" },
  c6: { roleId: "frontend-developer", scores: { "fe-react": s(60), "fe-ts": s(50), "fe-testing": s(30), "fe-a11y": s(45), "fe-deploy": s(40, "self-reported"), "fe-comm": s(55) }, assessedOn: "03 May 2025", attempts: 1, history: [] },
};
