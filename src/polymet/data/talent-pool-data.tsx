import type { CompetencyResult, EvidenceKind, RoleAssessment, StatedGoal } from "@/polymet/data/pathway-data";

export type PoolEmployment = "Full-time" | "Part-time" | "Contract" | "Freelance";
export type PoolArrangement = "Remote" | "Hybrid" | "Onsite";

export interface PoolTalent {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  location: string;
  arrangements: PoolArrangement[];
  employment: PoolEmployment[];
  availability: string;
  expectation: string;
  statedGoal: StatedGoal;
  identityVerified: boolean;
  assessment: RoleAssessment;
  evidence: { title: string; kind: EvidenceKind; outcome: string }[];
  /** How this person reached the pool — e.g. via an internship pathway. */
  route: "direct" | "internship" | "learning";
  joinedPool: string;
}

const s = (score: number, evidence: EvidenceKind = "assessed"): CompetencyResult => ({ score, evidence });
const av = ["https://github.com/yusufhilmi.png", "https://github.com/denizbuyuktas.png", "https://github.com/denizcdemirci.png"];

/**
 * Every assessed talent record. Pool membership is NOT stored here — it is
 * computed by the pathway engine against each role's job-readiness threshold.
 */
export const assessedTalent: PoolTalent[] = [
  {
    id: "t-kwame", name: "Kwame Asante", avatar: av[0], headline: "Backend engineer · Go & Postgres", location: "Accra", arrangements: ["Remote", "Hybrid"], employment: ["Full-time", "Contract"], availability: "Available now", expectation: "₦800k/mo", statedGoal: "internship", identityVerified: true, route: "direct", joinedPool: "10 May 2025",
    assessment: { roleId: "backend-engineer", scores: { "be-api": s(84, "employer-confirmed"), "be-db": s(82, "verified"), "be-testing": s(76), "be-deploy": s(78, "employer-confirmed"), "be-comm": s(80) }, assessedOn: "10 May 2025", attempts: 1, history: [] },
    evidence: [{ title: "Ledger reconciliation service", kind: "verified", outcome: "Processes 40k records/day" }, { title: "On-call rotation, agency", kind: "employer-confirmed", outcome: "6 months, 2 incidents led" }],
  },
  {
    id: "t-emeka", name: "Emeka Obi", avatar: av[1], headline: "Backend developer · Node & Postgres", location: "Lagos", arrangements: ["Hybrid", "Onsite"], employment: ["Full-time"], availability: "2 weeks' notice", expectation: "₦750k/mo", statedGoal: "job", identityVerified: true, route: "direct", joinedPool: "09 May 2025",
    assessment: { roleId: "backend-engineer", scores: { "be-api": s(80, "employer-confirmed"), "be-db": s(74, "verified"), "be-testing": s(66), "be-deploy": s(72, "employer-confirmed"), "be-comm": s(78) }, assessedOn: "09 May 2025", attempts: 1, history: [] },
    evidence: [{ title: "Payments webhook service", kind: "employer-confirmed", outcome: "Handled 10k events/day" }],
  },
  {
    id: "t-ngozi", name: "Ngozi Eze", avatar: av[2], headline: "Frontend developer · React, testing-first", location: "Lagos", arrangements: ["Remote", "Hybrid"], employment: ["Full-time", "Contract"], availability: "Available now", expectation: "₦600k/mo", statedGoal: "job", identityVerified: true, route: "internship", joinedPool: "06 May 2025",
    assessment: { roleId: "frontend-developer", scores: { "fe-react": s(86, "verified"), "fe-ts": s(80), "fe-testing": s(74), "fe-a11y": s(78, "employer-confirmed"), "fe-deploy": s(72, "employer-confirmed"), "fe-comm": s(76) }, assessedOn: "06 May 2025", attempts: 2, history: [] },
    evidence: [{ title: "Internship: merchant dashboard", kind: "employer-confirmed", outcome: "Shipped 4 features to production" }, { title: "Design-system test suite", kind: "verified", outcome: "92% coverage on 30 components" }],
  },
  {
    id: "t-ifeoma", name: "Ifeoma Nwosu", avatar: av[0], headline: "Frontend engineer · Accessibility specialist", location: "Enugu", arrangements: ["Remote"], employment: ["Contract", "Freelance", "Full-time"], availability: "From 1 June", expectation: "$1,400/mo", statedGoal: "job", identityVerified: true, route: "direct", joinedPool: "02 May 2025",
    assessment: { roleId: "frontend-developer", scores: { "fe-react": s(80), "fe-ts": s(72), "fe-testing": s(66), "fe-a11y": s(92, "verified"), "fe-deploy": s(70, "employer-confirmed"), "fe-comm": s(82) }, assessedOn: "02 May 2025", attempts: 1, history: [] },
    evidence: [{ title: "Public-sector form audit", kind: "verified", outcome: "WCAG 2.1 AA achieved" }],
  },
  {
    id: "t-fatima", name: "Fatima Bello", avatar: av[1], headline: "Data analyst · SQL & dashboards", location: "Abuja", arrangements: ["Hybrid", "Remote"], employment: ["Full-time", "Part-time"], availability: "Available now", expectation: "₦500k/mo", statedGoal: "job", identityVerified: true, route: "learning", joinedPool: "11 May 2025",
    assessment: { roleId: "data-analyst", scores: { "da-sql": s(82, "verified"), "da-sheets": s(78), "da-stats": s(70), "da-viz": s(76, "employer-confirmed"), "da-comm": s(74) }, assessedOn: "11 May 2025", attempts: 3, history: [] },
    evidence: [{ title: "Cooperative payments analysis", kind: "verified", outcome: "Found ₦4.2m in duplicate payouts" }, { title: "Weekly insights dashboard", kind: "employer-confirmed", outcome: "Used by 3 regional managers" }],
  },
  {
    id: "t-kofi", name: "Kofi Mensah", avatar: av[2], headline: "Product designer · Research-led", location: "Accra", arrangements: ["Remote", "Hybrid"], employment: ["Full-time", "Freelance"], availability: "Available now", expectation: "₦550k/mo", statedGoal: "job", identityVerified: false, route: "direct", joinedPool: "07 May 2025",
    assessment: { roleId: "product-designer", scores: { "pd-research": s(78), "pd-interaction": s(76), "pd-visual": s(72, "self-reported"), "pd-proto": s(74), "pd-comm": s(70) }, assessedOn: "07 May 2025", attempts: 1, history: [] },
    evidence: [{ title: "Clinic onboarding redesign", kind: "employer-confirmed", outcome: "Completion up 18%" }],
  },
  {
    id: "t-aisha", name: "Aisha Lawal", avatar: av[0], headline: "Support engineer · APIs & payments", location: "Lagos", arrangements: ["Onsite", "Hybrid"], employment: ["Full-time", "Part-time"], availability: "Available now", expectation: "₦350k/mo", statedGoal: "internship", identityVerified: true, route: "direct", joinedPool: "12 May 2025",
    assessment: { roleId: "support-engineer", scores: { "se-troubleshoot": s(74), "se-apis": s(70, "employer-confirmed"), "se-comm": s(80, "verified") }, assessedOn: "12 May 2025", attempts: 1, history: [] },
    evidence: [{ title: "Merchant support (contract)", kind: "employer-confirmed", outcome: "CSAT 4.8 across 600 tickets" }],
  },
  {
    id: "t-chidi", name: "Chidi Okeke", avatar: av[1], headline: "Growth marketer · Lifecycle & analytics", location: "Port Harcourt", arrangements: ["Remote"], employment: ["Contract", "Freelance"], availability: "Part-time from now", expectation: "$900/mo", statedGoal: "job", identityVerified: true, route: "internship", joinedPool: "04 May 2025",
    assessment: { roleId: "growth-marketer", scores: { "gm-content": s(76), "gm-analytics": s(72, "employer-confirmed"), "gm-experiments": s(68), "gm-comm": s(74) }, assessedOn: "04 May 2025", attempts: 2, history: [] },
    evidence: [{ title: "Internship: referral campaign", kind: "employer-confirmed", outcome: "+22% sign-ups in 6 weeks" }],
  },
  // Assessed but not job-ready — routed to internships or learning; never listed in the pool.
  {
    id: "t-amara", name: "Amara Okafor", avatar: av[2], headline: "Frontend developer", location: "Lagos", arrangements: ["Hybrid"], employment: ["Full-time"], availability: "Available now", expectation: "₦300k/mo", statedGoal: "job", identityVerified: true, route: "direct", joinedPool: "—",
    assessment: { roleId: "frontend-developer", scores: { "fe-react": s(82), "fe-ts": s(76), "fe-testing": s(48), "fe-a11y": s(85), "fe-deploy": s(55), "fe-comm": s(74) }, assessedOn: "08 May 2025", attempts: 3, history: [] },
    evidence: [],
  },
  {
    id: "t-david", name: "David Mensah", avatar: av[0], headline: "CS student", location: "Accra", arrangements: ["Remote"], employment: ["Full-time"], availability: "Available now", expectation: "₦250k/mo", statedGoal: "job", identityVerified: true, route: "direct", joinedPool: "—",
    assessment: { roleId: "frontend-developer", scores: { "fe-react": s(74), "fe-ts": s(62), "fe-testing": s(58), "fe-a11y": s(52), "fe-deploy": s(66), "fe-comm": s(68) }, assessedOn: "04 May 2025", attempts: 1, history: [] },
    evidence: [],
  },
  {
    id: "t-tolu", name: "Tolu Adeyemi", avatar: av[1], headline: "Aspiring data analyst", location: "Ibadan", arrangements: ["Remote"], employment: ["Full-time"], availability: "Available now", expectation: "₦200k/mo", statedGoal: "job", identityVerified: false, route: "direct", joinedPool: "—",
    assessment: { roleId: "data-analyst", scores: { "da-sql": s(35), "da-sheets": s(68), "da-stats": s(40), "da-viz": s(50), "da-comm": s(52) }, assessedOn: "06 May 2025", attempts: 1, history: [] },
    evidence: [],
  },
  {
    id: "t-grace", name: "Grace Wanjiru", avatar: av[2], headline: "Junior designer", location: "Nairobi", arrangements: ["Hybrid"], employment: ["Full-time"], availability: "Available now", expectation: "₦380k/mo", statedGoal: "job", identityVerified: true, route: "direct", joinedPool: "—",
    assessment: { roleId: "product-designer", scores: { "pd-research": s(55), "pd-interaction": s(66), "pd-visual": s(72), "pd-proto": s(64), "pd-comm": s(60) }, assessedOn: "11 May 2025", attempts: 1, history: [] },
    evidence: [],
  },
];
