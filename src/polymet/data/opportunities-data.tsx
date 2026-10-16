export type WorkArrangement = "remote" | "hybrid" | "onsite";
export type OpportunityType = "internship" | "job" | "graduate" | "freelance";
export type VerificationStatus = "verified" | "pending" | "unverified";
export type LogoTone = "orange" | "purple" | "brown" | "charcoal" | "sand" | "green";

export interface Company {
  id: string;
  name: string;
  initials: string;
  tone: LogoTone;
  industry: string;
  website: string;
  location: string;
  size: string;
  founded: string;
  verification: VerificationStatus;
  verifiedFacts: string[];
  selfReported: string[];
  about: string;
  culture: { title: string; description: string }[];
}

export interface Compensation {
  min: number;
  max: number;
  currency: "NGN" | "USD" | "GHS" | "KES";
  frequency: "month" | "hour" | "year" | "project";
  paid: boolean;
}

export interface MatchFactor {
  label: string;
  score: number;
  note: string;
}

export interface Opportunity {
  id: string;
  title: string;
  companyId: string;
  type: OpportunityType;
  level: "Entry" | "Junior" | "Mid" | "Graduate";
  arrangement: WorkArrangement;
  location: string;
  country: string;
  industry: string;
  compensation: Compensation | null;
  source: "internflare" | "external";
  provider?: string;
  externalUrl?: string;
  skills: string[];
  postedAgo: string;
  postedDate: string;
  deadline: string;
  duration?: string;
  status: "open" | "closed" | "expired";
  match?: { score: number; summary: string; factors: MatchFactor[] };
  readiness?: { required: number; yours: number; missing: string[] };
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: { title: string; description: string }[];
  instructions: string;
}

export const companies: Company[] = [
  {
    id: "paystack-labs",
    name: "Kora Ledger",
    initials: "KL",
    tone: "charcoal",
    industry: "Fintech",
    website: "koraledger.example",
    location: "Lagos, Nigeria",
    size: "201–500 employees",
    founded: "2017",
    verification: "verified",
    verifiedFacts: ["CAC registration confirmed", "Business domain verified", "Registered address confirmed"],
    selfReported: ["Employee headcount", "Culture and benefits descriptions"],
    about:
      "Kora Ledger builds payment and reconciliation infrastructure for businesses across West Africa. Our engineering teams work on high-availability systems that move value between banks, merchants and customers.",
    culture: [
      { title: "Written-first collaboration", description: "Decisions are documented in short RFCs so remote teammates can contribute equally." },
      { title: "Structured mentorship", description: "Every intern is paired with a senior engineer for weekly 1:1s." },
      { title: "Learning budget", description: "Annual stipend for courses, books and conferences." },
    ],
  },
  {
    id: "brightwave",
    name: "Brightwave Studio",
    initials: "BW",
    tone: "purple",
    industry: "Design & Media",
    website: "brightwave.example",
    location: "Accra, Ghana",
    size: "51–200 employees",
    founded: "2019",
    verification: "verified",
    verifiedFacts: ["Business registration confirmed", "Business domain verified"],
    selfReported: ["Client list", "Culture descriptions"],
    about: "Brightwave is a product design studio working with African startups on brand, product and growth design.",
    culture: [
      { title: "Critique culture", description: "Weekly design critiques open to every level." },
      { title: "Remote-friendly", description: "Distributed team across 6 countries." },
    ],
  },
  {
    id: "agrovest",
    name: "AgroVest",
    initials: "AV",
    tone: "green",
    industry: "Agritech",
    website: "agrovest.example",
    location: "Abuja, Nigeria",
    size: "11–50 employees",
    founded: "2020",
    verification: "pending",
    verifiedFacts: ["Business domain verified"],
    selfReported: ["Business registration", "Headcount", "Funding stage"],
    about: "AgroVest connects smallholder farmers with financing and offtake partners using mobile-first tools.",
    culture: [{ title: "Field exposure", description: "Teams spend time with farmer cooperatives each quarter." }],
  },
  {
    id: "nimbus-health",
    name: "Nimbus Health",
    initials: "NH",
    tone: "orange",
    industry: "Healthtech",
    website: "nimbushealth.example",
    location: "Nairobi, Kenya",
    size: "51–200 employees",
    founded: "2018",
    verification: "verified",
    verifiedFacts: ["Business registration confirmed", "Business domain verified", "Regulatory licence on file"],
    selfReported: ["Culture descriptions"],
    about: "Nimbus Health makes digital clinic management software used by over a thousand clinics in East Africa.",
    culture: [{ title: "Patient-first", description: "Product teams shadow clinic staff before shipping features." }],
  },
  {
    id: "lumen-commerce",
    name: "Lumen Commerce",
    initials: "LC",
    tone: "brown",
    industry: "E-commerce",
    website: "lumencommerce.example",
    location: "Lagos, Nigeria",
    size: "501–1,000 employees",
    founded: "2015",
    verification: "verified",
    verifiedFacts: ["CAC registration confirmed", "Business domain verified"],
    selfReported: ["Culture descriptions", "Benefits"],
    about: "Lumen Commerce operates a multi-category marketplace and logistics network in Nigeria.",
    culture: [{ title: "Ownership", description: "Small squads own metrics end-to-end." }],
  },
  {
    id: "openbridge",
    name: "OpenBridge Foundation",
    initials: "OB",
    tone: "sand",
    industry: "Non-profit",
    website: "openbridge.example",
    location: "Remote",
    size: "11–50 employees",
    founded: "2016",
    verification: "unverified",
    verifiedFacts: [],
    selfReported: ["Registration", "Headcount", "Location"],
    about: "OpenBridge runs digital literacy programmes for young people across Africa.",
    culture: [{ title: "Mission-driven", description: "Every role connects directly to programme outcomes." }],
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "frontend-engineering-intern",
    title: "Frontend Engineering Intern",
    companyId: "paystack-labs",
    type: "internship",
    level: "Entry",
    arrangement: "hybrid",
    location: "Lagos (Hybrid · 3 days onsite)",
    country: "Nigeria",
    industry: "Fintech",
    compensation: { min: 250000, max: 350000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["React", "TypeScript", "Accessibility", "Git"],
    postedAgo: "2 hours ago",
    postedDate: "12 May 2025",
    deadline: "30 Jun 2025",
    duration: "6 months",
    status: "open",
    match: {
      score: 92,
      summary: "Your React projects and accessibility work closely match this role's core requirements.",
      factors: [
        { label: "React & TypeScript", score: 95, note: "3 portfolio projects use React + TS" },
        { label: "Accessibility practice", score: 88, note: "Employer-confirmed audit work at Brightwave" },
        { label: "Production experience", score: 76, note: "One shipped project; add a second for stronger fit" },
      ],
    },
    readiness: { required: 60, yours: 78, missing: [] },
    summary: "Build merchant dashboard features used by thousands of businesses, paired with a senior mentor.",
    description:
      "Join the Merchant Experience team and help build the dashboards businesses use to reconcile payments. You will ship real features to production, write tests and participate in design reviews.",
    responsibilities: [
      "Build accessible React components for the merchant dashboard",
      "Write unit and integration tests for new features",
      "Pair with designers to refine interaction details",
      "Present your work in fortnightly demos",
    ],
    requirements: [
      "Demonstrated React projects (personal, academic or professional)",
      "Working knowledge of TypeScript and Git",
      "Able to commit 4 days a week for 6 months",
    ],
    benefits: [
      { title: "Monthly stipend", description: "Paid monthly in NGN" },
      { title: "1:1 mentorship", description: "Weekly sessions with a senior engineer" },
      { title: "Device provided", description: "Laptop for the internship duration" },
      { title: "Conversion pathway", description: "Eligible for a full-time review at month 5" },
    ],
    instructions: "Apply with your Internflare profile. Shortlisted applicants receive a short take-home task.",
  },
  {
    id: "product-design-intern",
    title: "Product Design Intern",
    companyId: "brightwave",
    type: "internship",
    level: "Entry",
    arrangement: "remote",
    location: "Remote (Africa time zones)",
    country: "Ghana",
    industry: "Design & Media",
    compensation: { min: 300, max: 450, currency: "USD", frequency: "month", paid: true },
    source: "internflare",
    skills: ["Figma", "UX Research", "Prototyping"],
    postedAgo: "5 hours ago",
    postedDate: "12 May 2025",
    deadline: "15 Jun 2025",
    duration: "4 months",
    status: "open",
    match: {
      score: 81,
      summary: "Strong prototyping evidence; research experience is self-reported only.",
      factors: [
        { label: "Figma & prototyping", score: 90, note: "Portfolio includes 2 interactive prototypes" },
        { label: "UX research", score: 68, note: "Self-reported — add a research case study" },
        { label: "Communication", score: 84, note: "Written case studies on portfolio" },
      ],
    },
    summary: "Work on brand and product design projects for early-stage African startups.",
    description: "Support senior designers across discovery, wireframing and high-fidelity UI for client projects.",
    responsibilities: ["Create wireframes and prototypes", "Run usability sessions", "Maintain design system components"],
    requirements: ["Portfolio with at least two case studies", "Comfortable with Figma"],
    benefits: [
      { title: "USD stipend", description: "Paid monthly" },
      { title: "Remote setup", description: "Internet allowance" },
    ],
    instructions: "Include a link to your portfolio in your application.",
  },
  {
    id: "data-analyst-graduate",
    title: "Graduate Data Analyst",
    companyId: "agrovest",
    type: "graduate",
    level: "Graduate",
    arrangement: "onsite",
    location: "Abuja",
    country: "Nigeria",
    industry: "Agritech",
    compensation: { min: 400000, max: 550000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["SQL", "Python", "Power BI"],
    postedAgo: "Yesterday",
    postedDate: "11 May 2025",
    deadline: "10 Jun 2025",
    status: "open",
    readiness: { required: 65, yours: 54, missing: ["SQL joins & window functions", "One dashboard project with real data"] },
    summary: "Turn farm and loan data into insights for the credit and operations teams.",
    description: "Analyse repayment, yield and logistics data and build dashboards that guide lending decisions.",
    responsibilities: ["Clean and model datasets", "Build Power BI dashboards", "Present weekly insights"],
    requirements: ["Degree in a quantitative field", "SQL proficiency", "Basic Python"],
    benefits: [{ title: "HMO", description: "Health insurance from day one" }],
    instructions: "Applicants complete an SQL readiness check before submission.",
  },
  {
    id: "support-engineer-ext",
    title: "Customer Support Engineer",
    companyId: "nimbus-health",
    type: "job",
    level: "Junior",
    arrangement: "remote",
    location: "Remote (Kenya, Nigeria, Ghana)",
    country: "Kenya",
    industry: "Healthtech",
    compensation: { min: 900, max: 1200, currency: "USD", frequency: "month", paid: true },
    source: "external",
    provider: "Greenhouse",
    externalUrl: "https://boards.greenhouse.example/nimbus/support-engineer",
    skills: ["SQL", "APIs", "Customer Communication"],
    postedAgo: "1 day ago",
    postedDate: "11 May 2025",
    deadline: "Rolling",
    status: "open",
    summary: "Resolve technical issues for clinic customers and improve support tooling.",
    description: "Approved external listing. Applications are handled on the employer's own careers site.",
    responsibilities: ["Triage and resolve tickets", "Write help-centre articles", "Escalate bugs with clear reproductions"],
    requirements: ["1+ year in support or technical role", "Basic SQL"],
    benefits: [{ title: "Remote-first", description: "Work from anywhere in listed countries" }],
    instructions: "Apply on the employer's careers site.",
  },
  {
    id: "growth-marketing-intern",
    title: "Growth Marketing Intern",
    companyId: "lumen-commerce",
    type: "internship",
    level: "Entry",
    arrangement: "onsite",
    location: "Lagos (Ikeja)",
    country: "Nigeria",
    industry: "E-commerce",
    compensation: { min: 150000, max: 200000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["Content", "Analytics", "Paid Social"],
    postedAgo: "2 days ago",
    postedDate: "10 May 2025",
    deadline: "05 Jun 2025",
    duration: "3 months",
    status: "open",
    match: {
      score: 74,
      summary: "Content experience matches well; analytics experience is limited.",
      factors: [
        { label: "Content creation", score: 86, note: "Client work with 3 SMEs" },
        { label: "Analytics", score: 58, note: "No dashboard evidence yet" },
        { label: "Campaign execution", score: 72, note: "One paid social campaign" },
      ],
    },
    summary: "Support campaign planning and reporting for the marketplace growth team.",
    description: "Plan, launch and report on acquisition campaigns across social, email and partnerships.",
    responsibilities: ["Draft campaign content", "Track campaign metrics", "Support partnership outreach"],
    requirements: ["Strong written English", "Interest in performance marketing"],
    benefits: [{ title: "Transport allowance", description: "Monthly" }],
    instructions: "Apply with your profile and one writing sample.",
  },
  {
    id: "community-volunteer",
    title: "Digital Literacy Programme Assistant",
    companyId: "openbridge",
    type: "internship",
    level: "Entry",
    arrangement: "remote",
    location: "Remote",
    country: "Pan-Africa",
    industry: "Non-profit",
    compensation: { min: 0, max: 0, currency: "NGN", frequency: "month", paid: false },
    source: "internflare",
    skills: ["Facilitation", "Google Workspace"],
    postedAgo: "3 days ago",
    postedDate: "09 May 2025",
    deadline: "20 Jun 2025",
    duration: "3 months",
    status: "open",
    summary: "Unpaid, part-time internship supporting virtual literacy sessions.",
    description: "Support facilitators delivering virtual digital literacy sessions for secondary school students.",
    responsibilities: ["Co-host virtual sessions", "Track attendance", "Collect feedback"],
    requirements: ["Available 10 hours a week"],
    benefits: [{ title: "Certificate of participation", description: "Issued by the organisation" }],
    instructions: "Apply with your profile.",
  },
  {
    id: "backend-engineer-junior",
    title: "Junior Backend Engineer",
    companyId: "paystack-labs",
    type: "job",
    level: "Junior",
    arrangement: "hybrid",
    location: "Lagos (Hybrid)",
    country: "Nigeria",
    industry: "Fintech",
    compensation: { min: 650000, max: 900000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["Node.js", "PostgreSQL", "APIs"],
    postedAgo: "4 days ago",
    postedDate: "08 May 2025",
    deadline: "12 Jun 2025",
    status: "open",
    readiness: { required: 70, yours: 61, missing: ["One production API project", "Database indexing basics"] },
    summary: "Build reliable services for settlement and reconciliation.",
    description: "Work on the services that settle merchant payments every day.",
    responsibilities: ["Design and build APIs", "Write migrations", "Monitor services"],
    requirements: ["1 year of backend experience or equivalent projects", "SQL"],
    benefits: [{ title: "Pension & HMO", description: "Standard package" }],
    instructions: "Shortlisted candidates complete a written AI interview and a technical interview.",
  },
  {
    id: "ux-writer-closed",
    title: "UX Writing Intern",
    companyId: "brightwave",
    type: "internship",
    level: "Entry",
    arrangement: "remote",
    location: "Remote",
    country: "Ghana",
    industry: "Design & Media",
    compensation: { min: 250, max: 300, currency: "USD", frequency: "month", paid: true },
    source: "internflare",
    skills: ["Copywriting", "UX"],
    postedAgo: "3 weeks ago",
    postedDate: "20 Apr 2025",
    deadline: "05 May 2025",
    status: "closed",
    summary: "Write interface copy for client products.",
    description: "Craft clear, concise product copy.",
    responsibilities: ["Write microcopy", "Maintain content guidelines"],
    requirements: ["Writing samples"],
    benefits: [],
    instructions: "This listing is closed.",
  },
  {
    id: "freelance-brand-ext",
    title: "Freelance Brand Designer",
    companyId: "agrovest",
    type: "freelance",
    level: "Mid",
    arrangement: "remote",
    location: "Remote",
    country: "Nigeria",
    industry: "Agritech",
    compensation: { min: 600000, max: 900000, currency: "NGN", frequency: "project", paid: true },
    source: "external",
    provider: "Workable",
    externalUrl: "https://apply.workable.example/agrovest/brand-designer",
    skills: ["Brand Identity", "Illustrator"],
    postedAgo: "5 days ago",
    postedDate: "07 May 2025",
    deadline: "01 Jun 2025",
    status: "open",
    summary: "Refresh AgroVest's farmer-facing brand system.",
    description: "Approved external listing on the employer's applicant tracking system.",
    responsibilities: ["Deliver brand guidelines", "Design marketing templates"],
    requirements: ["Brand portfolio"],
    benefits: [],
    instructions: "Apply on Workable.",
  },
  {
    id: "frontend-developer-junior",
    title: "Junior Frontend Developer",
    companyId: "lumen-commerce",
    type: "job",
    level: "Junior",
    arrangement: "hybrid",
    location: "Nairobi (Hybrid · 2 days onsite)",
    country: "Kenya",
    industry: "E-commerce",
    compensation: { min: 180000, max: 240000, currency: "KES", frequency: "month", paid: true },
    source: "internflare",
    skills: ["React", "TypeScript", "Testing", "Accessibility"],
    postedAgo: "1 day ago",
    postedDate: "11 May 2025",
    deadline: "20 Jun 2025",
    status: "open",
    summary: "Own storefront features end-to-end in a small product squad.",
    description: "Ship customer-facing storefront features, write tests and deploy to production with the squad's support.",
    responsibilities: ["Build and test storefront features", "Review pull requests", "Monitor production releases"],
    requirements: ["Tested React projects", "At least one production deployment", "TypeScript"],
    benefits: [{ title: "Learning budget", description: "KES 60,000 per year" }],
    instructions: "Shortlisted candidates complete a paid test task and a technical interview.",
  },
  {
    id: "react-contractor-remote",
    title: "React Developer (6-month contract)",
    companyId: "brightwave",
    type: "job",
    level: "Mid",
    arrangement: "remote",
    location: "Remote · Africa time zones",
    country: "Ghana",
    industry: "Design & Media",
    compensation: { min: 1800, max: 2400, currency: "USD", frequency: "month", paid: true },
    source: "internflare",
    skills: ["React", "Testing", "Performance"],
    postedAgo: "3 days ago",
    postedDate: "09 May 2025",
    deadline: "15 Jun 2025",
    status: "open",
    summary: "Build client web apps on a fixed-term contract with a possible extension.",
    description: "Deliver production React apps for Brightwave clients alongside a senior designer.",
    responsibilities: ["Build client apps", "Write tests", "Estimate and report on delivery"],
    requirements: ["2+ shipped React apps", "Testing and deployment experience"],
    benefits: [{ title: "Flexible hours", description: "Core overlap 11:00–15:00 GMT" }],
    instructions: "Apply with your Internflare profile.",
  },
  {
    id: "data-analyst-intern",
    title: "Data Analyst Intern",
    companyId: "agrovest",
    type: "internship",
    level: "Entry",
    arrangement: "remote",
    location: "Remote · Nigeria",
    country: "Nigeria",
    industry: "Agritech",
    compensation: { min: 150000, max: 200000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["SQL", "Spreadsheets", "Data visualisation"],
    postedAgo: "6 hours ago",
    postedDate: "12 May 2025",
    deadline: "28 Jun 2025",
    duration: "4 months",
    status: "open",
    summary: "Turn farmer cooperative data into weekly insights for the field team.",
    description: "Clean, query and visualise cooperative yield and payment data with a senior analyst.",
    responsibilities: ["Write SQL queries", "Maintain weekly dashboards", "Present findings to the field team"],
    requirements: ["Basic SQL", "Spreadsheet analysis", "Clear written summaries"],
    benefits: [{ title: "Mentored", description: "Weekly review with a senior analyst" }],
    instructions: "Apply with your Internflare profile.",
  },
  {
    id: "backend-engineer-mid",
    title: "Backend Engineer",
    companyId: "nimbus-health",
    type: "job",
    level: "Mid",
    arrangement: "remote",
    location: "Remote",
    country: "Nigeria",
    industry: "Healthtech",
    compensation: { min: 1100000, max: 1500000, currency: "NGN", frequency: "month", paid: true },
    source: "internflare",
    skills: ["Node.js", "PostgreSQL", "APIs", "Testing"],
    postedAgo: "2 days ago",
    postedDate: "10 May 2025",
    deadline: "25 Jun 2025",
    status: "open",
    summary: "Build appointment and records services used by clinics.",
    description: "Design reliable APIs for clinic scheduling and patient records with strong testing discipline.",
    responsibilities: ["Design APIs", "Own database migrations", "Participate in on-call rotation"],
    requirements: ["Production API experience", "SQL and indexing", "Automated testing"],
    benefits: [{ title: "HMO", description: "Comprehensive health cover" }],
    instructions: "Apply with your Internflare profile.",
  },
];

export const getCompany = (id: string) => companies.find((c) => c.id === id) ?? companies[0];
export const getOpportunity = (id: string) => opportunities.find((o) => o.id === id);

const currencySymbol: Record<Compensation["currency"], string> = { NGN: "₦", USD: "$", GHS: "GH₵", KES: "KSh" };
const frequencyLabel: Record<Compensation["frequency"], string> = { month: "/mo", hour: "/hr", year: "/yr", project: "/project" };

export function formatCompensation(c: Compensation | null) {
  if (!c) return "Not disclosed";
  if (!c.paid) return "Unpaid";
  const s = currencySymbol[c.currency];
  const fmt = (n: number) => (n >= 1000 ? `${s}${(n / 1000).toLocaleString()}k` : `${s}${n}`);
  return `${fmt(c.min)}–${fmt(c.max)}${frequencyLabel[c.frequency]}`;
}

export const arrangementLabel: Record<WorkArrangement, string> = { remote: "Remote", hybrid: "Hybrid", onsite: "Onsite" };
export const typeLabel: Record<OpportunityType, string> = { internship: "Internship", job: "Job", graduate: "Graduate role", freelance: "Freelance" };
