export interface PlanFeature {
  label: string;
  status: "included" | "configurable";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
}

export const talentPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Start applying and build your profile.",
    features: [
      { label: "Up to 3 internship applications", status: "included" },
      { label: "1 job application", status: "included" },
      { label: "2 job tracking slots", status: "included" },
      { label: "Public talent portfolio", status: "included" },
    ],
  },
  {
    id: "career",
    name: "Career",
    price: 5000,
    description: "For active job seekers applying regularly.",
    highlighted: true,
    features: [
      { label: "Everything in Free", status: "included" },
      { label: "Higher application limits", status: "configurable" },
      { label: "Additional tracking slots", status: "configurable" },
      { label: "AI career tool usage allowance", status: "configurable" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 15000,
    description: "For candidates investing in readiness and learning.",
    features: [
      { label: "Everything in Career", status: "included" },
      { label: "Expanded AI tool allowance", status: "configurable" },
      { label: "Learning pathway access", status: "configurable" },
      { label: "Client acquisition tracking", status: "configurable" },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 30000,
    description: "For professionals who want the full toolkit.",
    features: [
      { label: "Everything in Pro", status: "included" },
      { label: "Mentorship session allowance", status: "configurable" },
      { label: "Priority support", status: "configurable" },
    ],
  },
];

export const employerPlans: Plan[] = [
  {
    id: "emp-free",
    name: "Free",
    price: 0,
    description: "Try hiring on Internflare.",
    features: [
      { label: "2 listings", status: "included" },
      { label: "20 applicant views", status: "included" },
      { label: "5 interview requests", status: "included" },
      { label: "5 tracking slots", status: "included" },
      { label: "Basic workspace for one intern", status: "included" },
      { label: "Communicate with / add one employee", status: "included" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 10000,
    description: "For small teams hiring a few roles.",
    highlighted: true,
    features: [
      { label: "Everything in Free", status: "included" },
      { label: "More listings and applicant views", status: "configurable" },
      { label: "Additional interview requests", status: "configurable" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 30000,
    description: "For growing teams with ongoing hiring.",
    features: [
      { label: "Everything in Starter", status: "included" },
      { label: "Talent discovery & search", status: "configurable" },
      { label: "Hiring team seats", status: "configurable" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 100000,
    description: "For organisations running structured programmes.",
    features: [
      { label: "Everything in Growth", status: "included" },
      { label: "Expanded SquadCot workspace", status: "configurable" },
      { label: "Advanced reporting", status: "configurable" },
    ],
  },
];

export const formatNaira = (n: number) => (n === 0 ? "₦0" : `₦${n.toLocaleString()}`);

export const faqs = [
  { q: "Is internflare free for talent?", a: "Yes. The Free plan lets you build a profile and portfolio and apply to a limited number of opportunities. Paid plans raise limits and unlock more tools." },
  { q: "How does the AI match score work?", a: "When an opportunity has structured requirements, we compare them with the skills, experience and evidence in your profile. You always see the factors behind a score. It's guidance — employers make hiring decisions." },
  { q: "What does 'verified' mean on a profile or company?", a: "Verified items were checked against documents or a trusted source. Employer-confirmed items were confirmed by the employer involved. Self-reported items are provided by the user and not yet checked." },
  { q: "What happens when I apply to an external listing?", a: "External listings come from approved providers. You'll leave Internflare to apply on the employer's site. We can track the click, but the application itself is managed by that provider." },
  { q: "What is SquadCot?", a: "SquadCot by internflare is the workspace you join after accepting an engagement — for tasks, reports, supervision and evidence of your work." },
];
