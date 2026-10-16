export type ApplicationStage =
  | "New"
  | "Reviewed"
  | "Shortlisted"
  | "Interview"
  | "Test Task"
  | "Offer"
  | "Hired"
  | "Rejected"
  | "Withdrawn";

export type EvidenceLevel = "self-reported" | "employer-confirmed" | "verified";

export const pipelineStages: ApplicationStage[] = ["New", "Reviewed", "Shortlisted", "Interview", "Test Task", "Offer", "Hired"];

export const currentTalent = {
  id: "amara-okafor",
  name: "Amara Okafor",
  firstName: "Amara",
  headline: "Frontend Developer · Accessibility-focused",
  education: "B.Sc. Computer Science, University of Lagos (2024)",
  location: "Lagos, Nigeria",
  avatar: "https://github.com/denizbuyuktas.png",
  email: "amara.okafor@example.com",
  plan: "Career" as const,
  availability: "Available from June 2025",
  profileCompleteness: 78,
  missingProfileItems: [
    { label: "Add a second reference", href: "/app/profile" },
    { label: "Upload a project video or demo", href: "/app/portfolio" },
    { label: "Confirm qualification documents", href: "/app/profile" },
  ],
  stats: { activeApplications: 6, interviews: 2, offers: 1, savedCount: 9, portfolioViews: 48 },
};

export interface Application {
  id: string;
  opportunityId: string;
  title: string;
  company: string;
  companyInitials: string;
  dateApplied: string;
  stage: ApplicationStage;
  nextAction: string;
  managedBy: "internflare" | "external";
  provider?: string;
  updated: string;
  history: { stage: ApplicationStage | "External click"; date: string; note?: string }[];
  message?: { from: string; body: string; date: string };
}

export const applications: Application[] = [
  {
    id: "app-1",
    opportunityId: "frontend-engineering-intern",
    title: "Frontend Engineering Intern",
    company: "Kora Ledger",
    companyInitials: "KL",
    dateApplied: "02 May 2025",
    stage: "Interview",
    nextAction: "Technical interview · 22 May, 10:00 WAT",
    managedBy: "internflare",
    updated: "Today",
    history: [
      { stage: "New", date: "02 May" },
      { stage: "Reviewed", date: "05 May" },
      { stage: "Shortlisted", date: "08 May", note: "Recruiter viewed portfolio" },
      { stage: "Interview", date: "12 May", note: "Invitation accepted" },
    ],
    message: { from: "Tolu A., Talent Partner", body: "Thanks for confirming. You'll pair with an engineer on a small UI exercise — no prep required beyond reviewing our public design system.", date: "12 May" },
  },
  {
    id: "app-2",
    opportunityId: "product-design-intern",
    title: "Product Design Intern",
    company: "Brightwave Studio",
    companyInitials: "BW",
    dateApplied: "28 Apr 2025",
    stage: "Offer",
    nextAction: "Review offer · expires 24 May",
    managedBy: "internflare",
    updated: "Yesterday",
    history: [
      { stage: "New", date: "28 Apr" },
      { stage: "Reviewed", date: "29 Apr" },
      { stage: "Shortlisted", date: "01 May" },
      { stage: "Interview", date: "06 May" },
      { stage: "Offer", date: "13 May" },
    ],
  },
  {
    id: "app-3",
    opportunityId: "growth-marketing-intern",
    title: "Growth Marketing Intern",
    company: "Lumen Commerce",
    companyInitials: "LC",
    dateApplied: "09 May 2025",
    stage: "Test Task",
    nextAction: "Submit campaign brief · due 18 May",
    managedBy: "internflare",
    updated: "2 days ago",
    history: [
      { stage: "New", date: "09 May" },
      { stage: "Shortlisted", date: "11 May" },
      { stage: "Test Task", date: "12 May" },
    ],
  },
  {
    id: "app-4",
    opportunityId: "backend-engineer-junior",
    title: "Junior Backend Engineer",
    company: "Kora Ledger",
    companyInitials: "KL",
    dateApplied: "10 May 2025",
    stage: "Reviewed",
    nextAction: "Awaiting employer decision",
    managedBy: "internflare",
    updated: "3 days ago",
    history: [
      { stage: "New", date: "10 May" },
      { stage: "Reviewed", date: "12 May" },
    ],
  },
  {
    id: "app-5",
    opportunityId: "data-analyst-graduate",
    title: "Graduate Data Analyst",
    company: "AgroVest",
    companyInitials: "AV",
    dateApplied: "11 May 2025",
    stage: "New",
    nextAction: "No action needed",
    managedBy: "internflare",
    updated: "4 days ago",
    history: [{ stage: "New", date: "11 May" }],
  },
  {
    id: "app-6",
    opportunityId: "ux-writer-closed",
    title: "UX Writing Intern",
    company: "Brightwave Studio",
    companyInitials: "BW",
    dateApplied: "22 Apr 2025",
    stage: "Rejected",
    nextAction: "See feedback",
    managedBy: "internflare",
    updated: "2 weeks ago",
    history: [
      { stage: "New", date: "22 Apr" },
      { stage: "Reviewed", date: "25 Apr" },
      { stage: "Rejected", date: "02 May", note: "Position filled" },
    ],
  },
  {
    id: "app-7",
    opportunityId: "support-engineer-ext",
    title: "Customer Support Engineer",
    company: "Nimbus Health",
    companyInitials: "NH",
    dateApplied: "13 May 2025",
    stage: "New",
    nextAction: "Tracked externally — check Greenhouse",
    managedBy: "external",
    provider: "Greenhouse",
    updated: "13 May",
    history: [{ stage: "External click", date: "13 May", note: "Opened employer site via Greenhouse" }],
  },
];

export interface Interview {
  id: string;
  role: string;
  company: string;
  companyInitials: string;
  date: string;
  time: string;
  timezone: string;
  format: "Video" | "Onsite" | "Phone" | "AI written" | "AI oral";
  stage: string;
  interviewer?: string;
  status: "pending" | "confirmed" | "completed" | "declined" | "reschedule-requested";
  location?: string;
  prep: string[];
  outcome?: string;
}

export const interviews: Interview[] = [
  {
    id: "int-1",
    role: "Frontend Engineering Intern",
    company: "Kora Ledger",
    companyInitials: "KL",
    date: "Thu, 22 May 2025",
    time: "10:00 – 11:00",
    timezone: "WAT (UTC+1)",
    format: "Video",
    stage: "Technical interview",
    interviewer: "Ifeoma N., Senior Engineer",
    status: "confirmed",
    prep: ["Review Kora's public design system", "Prepare one project walkthrough (5 min)", "Test camera and microphone"],
  },
  {
    id: "int-2",
    role: "Junior Backend Engineer",
    company: "Kora Ledger",
    companyInitials: "KL",
    date: "Mon, 26 May 2025",
    time: "Any time before 23:59",
    timezone: "WAT (UTC+1)",
    format: "AI written",
    stage: "Screening — written AI interview",
    status: "pending",
    prep: ["6 written questions, ~35 minutes", "You can pause between questions", "A human recruiter reviews all results"],
  },
  {
    id: "int-3",
    role: "Product Design Intern",
    company: "Brightwave Studio",
    companyInitials: "BW",
    date: "Tue, 06 May 2025",
    time: "14:00 – 14:45",
    timezone: "GMT (UTC+0)",
    format: "Video",
    stage: "Portfolio review",
    interviewer: "Kwame A., Design Lead",
    status: "completed",
    prep: [],
    outcome: "Advanced to offer",
  },
];

export const offer = {
  id: "offer-1",
  role: "Product Design Intern",
  company: "Brightwave Studio",
  companyInitials: "BW",
  status: "pending" as "pending" | "accepted" | "declined",
  compensation: "$400",
  currency: "USD",
  frequency: "Monthly",
  startDate: "Mon, 02 Jun 2025",
  duration: "4 months (to 30 Sep 2025)",
  arrangement: "Remote",
  expires: "24 May 2025",
  terms: [
    "Part-time: 30 hours per week, Monday–Friday",
    "Stipend paid on the last working day of each month",
    "Equipment: internet allowance of $40/month",
    "Either party may end the internship with 2 weeks' notice",
  ],
  onboarding: [
    { id: "ob1", label: "Accept offer", done: false },
    { id: "ob2", label: "Sign internship agreement", done: false },
    { id: "ob3", label: "Confirm payout details", done: false },
    { id: "ob4", label: "Complete identity confirmation", done: false },
    { id: "ob5", label: "Join SquadCot workspace", done: false },
  ],
};

export interface NotificationItem {
  id: string;
  category: "application" | "interview" | "test" | "offer" | "task" | "mentor" | "billing";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
}

export const notifications: NotificationItem[] = [
  { id: "n1", category: "offer", title: "You received an offer", body: "Brightwave Studio sent an offer for Product Design Intern. Review before 24 May.", time: "1h ago", read: false, href: "/app/offers" },
  { id: "n2", category: "interview", title: "Interview confirmed", body: "Technical interview with Kora Ledger on Thu 22 May, 10:00 WAT.", time: "3h ago", read: false, href: "/app/interviews" },
  { id: "n3", category: "test", title: "Test task invitation", body: "Lumen Commerce invited you to complete a campaign brief. Due 18 May.", time: "Yesterday", read: false, href: "/app/applications" },
  { id: "n4", category: "application", title: "Application reviewed", body: "Kora Ledger reviewed your application for Junior Backend Engineer.", time: "2 days ago", read: true, href: "/app/applications" },
  { id: "n5", category: "mentor", title: "Mentor session booked", body: "Session with Chidi E. confirmed for Sat 24 May, 11:00 WAT.", time: "3 days ago", read: true, href: "/app/learning" },
  { id: "n6", category: "task", title: "Learning milestone due", body: "Submit evidence for 'Accessible forms' module by 20 May.", time: "4 days ago", read: true, href: "/app/learning" },
  { id: "n7", category: "billing", title: "Career plan renewed", body: "₦5,000 charged for the Career plan. Next renewal 14 Jun 2025.", time: "1 week ago", read: true, href: "/app/settings" },
];

export const readiness = {
  targetRole: "Frontend Developer",
  internship: { score: 78, label: "Internship-ready", threshold: 60 },
  job: { score: 61, label: "Building toward job-ready", threshold: 70 },
  lastAssessed: "08 May 2025",
  dimensions: [
    { label: "Technical skills", score: 82, evidence: "verified" as EvidenceLevel, note: "Assessment: React fundamentals (verified)" },
    { label: "Practical experience", score: 64, evidence: "employer-confirmed" as EvidenceLevel, note: "One employer-confirmed project" },
    { label: "Portfolio quality", score: 74, evidence: "self-reported" as EvidenceLevel, note: "3 projects, 1 with outcomes" },
    { label: "CV & profile", score: 85, evidence: "self-reported" as EvidenceLevel, note: "Clear, role-targeted summary" },
    { label: "Communication", score: 70, evidence: "verified" as EvidenceLevel, note: "Written assessment completed" },
  ],
  strengths: [
    "React component architecture demonstrated across 3 projects",
    "Accessibility audit work confirmed by Brightwave Studio",
    "Clear written communication in case studies",
  ],
  gaps: [
    { title: "Testing practice", detail: "No projects show unit or integration tests. Job-level roles typically require this.", action: "Module 2 · Testing React apps" },
    { title: "Production deployment", detail: "Only one project is deployed with real users.", action: "Practical project · Ship a public tool" },
    { title: "State management at scale", detail: "Limited evidence of complex client state.", action: "Module 4 · Data fetching & caching" },
  ],
  history: [
    { date: "08 May 2025", role: "Frontend Developer", internship: 78, job: 61 },
    { date: "12 Mar 2025", role: "Frontend Developer", internship: 66, job: 49 },
    { date: "20 Jan 2025", role: "Frontend Developer", internship: 52, job: 38 },
  ],
};

export interface LearningModule {
  id: string;
  title: string;
  weeks: string;
  status: "completed" | "in-progress" | "not-started";
  progress: number;
  evidence: "submitted" | "approved" | "required" | "none";
  resources: { title: string; source: string; url?: string; kind: "Article" | "Video" | "Course" | "Docs" }[];
  assignment: string;
}

export const learningPlan: LearningModule[] = [
  {
    id: "m1",
    title: "Accessible forms and interactions",
    weeks: "Weeks 1–2",
    status: "completed",
    progress: 100,
    evidence: "approved",
    resources: [
      { title: "Forms tutorial", source: "W3C WAI", url: "https://www.w3.org/WAI/tutorials/forms/", kind: "Docs" },
    ],
    assignment: "Audit and fix a sign-up form; submit before/after notes.",
  },
  {
    id: "m2",
    title: "Testing React applications",
    weeks: "Weeks 3–4",
    status: "in-progress",
    progress: 45,
    evidence: "required",
    resources: [
      { title: "Testing Library — Introduction", source: "testing-library.com", url: "https://testing-library.com/docs/", kind: "Docs" },
      { title: "Curated resource pending", source: "Awaiting system source", kind: "Course" },
    ],
    assignment: "Add tests covering 3 user flows in one of your portfolio projects.",
  },
  {
    id: "m3",
    title: "Ship a public tool",
    weeks: "Weeks 5–6",
    status: "not-started",
    progress: 0,
    evidence: "none",
    resources: [],
    assignment: "Deploy a small tool and collect usage from at least 10 people.",
  },
  {
    id: "m4",
    title: "Data fetching & caching",
    weeks: "Weeks 7–8",
    status: "not-started",
    progress: 0,
    evidence: "none",
    resources: [
      { title: "TanStack Query overview", source: "tanstack.com", url: "https://tanstack.com/query/latest/docs/framework/react/overview", kind: "Docs" },
    ],
    assignment: "Refactor a project to use a caching data layer and document trade-offs.",
  },
];

export const mentors = [
  { id: "me1", name: "Chidi Eze", title: "Staff Engineer · Fintech", avatar: "https://github.com/yusufhilmi.png", focus: ["Frontend", "Career transitions"], next: "Sat 24 May, 11:00 WAT", booked: true },
  { id: "me2", name: "Ngozi Bello", title: "Engineering Manager", avatar: "https://github.com/denizcdemirci.png", focus: ["Interview prep", "Testing"], next: "Next slot: Wed 28 May", booked: false },
];

export interface PortfolioProject {
  id: string;
  title: string;
  role: "Developer" | "Designer" | "Digital Marketer" | "Writer" | "Project Manager";
  context: string;
  dates: string;
  contribution: string;
  outcomes: string[];
  tools: string[];
  evidence: EvidenceLevel;
  links: { label: string; url: string }[];
  image?: string;
  public: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "p1",
    title: "Clinic booking web app",
    role: "Developer",
    context: "Personal project",
    dates: "Jan – Mar 2025",
    contribution: "Designed and built a booking flow with React, TypeScript and Supabase. Led accessibility testing with 5 screen-reader users.",
    outcomes: ["Used by 2 clinics during pilot", "WCAG 2.1 AA audit passed"],
    tools: ["React", "TypeScript", "Supabase"],
    evidence: "verified",
    links: [{ label: "Live demo", url: "#" }, { label: "Source", url: "#" }],
    image: "https://v3b.fal.media/files/b/0aae2918/vLG9LZni8dPncJxccnJ6F_ItXppIaa.jpg",
    public: true,
  },
  {
    id: "p2",
    title: "Accessibility audit — client dashboard",
    role: "Developer",
    context: "Brightwave Studio (freelance)",
    dates: "Nov 2024",
    contribution: "Audited 14 dashboard screens and implemented fixes for keyboard navigation and contrast.",
    outcomes: ["38 issues resolved", "Lighthouse a11y 71 → 98"],
    tools: ["axe DevTools", "React"],
    evidence: "employer-confirmed",
    links: [{ label: "Case study", url: "#" }],
    public: true,
  },
  {
    id: "p3",
    title: "Student society rebrand",
    role: "Designer",
    context: "UNILAG Tech Society",
    dates: "Aug 2024",
    contribution: "Created a new identity and social templates for the society's events.",
    outcomes: ["Event sign-ups up 40% (self-reported)"],
    tools: ["Figma", "Illustrator"],
    evidence: "self-reported",
    links: [{ label: "Behance", url: "#" }],
    public: true,
  },
  {
    id: "p4",
    title: "Newsletter growth sprint",
    role: "Digital Marketer",
    context: "Personal newsletter",
    dates: "2024",
    contribution: "Grew a developer newsletter through referral loops and community posts.",
    outcomes: ["0 → 620 subscribers"],
    tools: ["Beehiiv", "Notion"],
    evidence: "self-reported",
    links: [],
    public: false,
  },
];

export const leads = [
  { id: "l1", name: "Sunrise Pharmacy", need: "Booking website", stage: "Proposal sent", followUp: "Today", value: "₦350k" },
  { id: "l2", name: "Ade's Bakery", need: "Landing page refresh", stage: "Contacted", followUp: "Fri 23 May", value: "₦180k" },
  { id: "l3", name: "Mobi Gym", need: "Member portal", stage: "Discovery call", followUp: "Mon 26 May", value: "₦500k" },
];

export const tasks = [
  { id: "t1", title: "Submit Lumen campaign brief", meta: "Test task · Lumen Commerce", due: "Due 18 May", urgent: true },
  { id: "t2", title: "Upload testing evidence for Module 2", meta: "Learning plan", due: "Due 20 May", urgent: false },
  { id: "t3", title: "Complete Kora written AI interview", meta: "Interview · Kora Ledger", due: "Due 26 May", urgent: false },
];
