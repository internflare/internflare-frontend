import type { ApplicationStage, EvidenceLevel } from "@/polymet/data/talent-data";

export const employerOrg = {
  name: "Kora Ledger",
  initials: "KL",
  admin: "Tolu Adebayo",
  role: "Talent Partner",
  avatar: "https://github.com/yusufhilmi.png",
  verification: "verified" as const,
  plan: "Starter",
  renewal: "14 Jun 2025",
};

export const planUsage = [
  { label: "Active listings", used: 4, limit: 5, note: "Starter limit (configurable)" },
  { label: "Applicant views", used: 62, limit: 100, note: "Resets 14 Jun" },
  { label: "Interview requests", used: 9, limit: 15, note: "Resets 14 Jun" },
  { label: "Tracking slots", used: 7, limit: 10, note: "" },
];

export type ListingStatus = "draft" | "published" | "paused" | "closed";

export interface EmployerListing {
  id: string;
  title: string;
  type: "Internship" | "Job" | "Graduate role";
  arrangement: "Remote" | "Hybrid" | "Onsite";
  location: string;
  status: ListingStatus;
  applicants: number;
  newApplicants: number;
  views: number;
  shortlisted: number;
  posted: string;
  deadline: string;
  compensation: string;
}

export const employerListings: EmployerListing[] = [
  { id: "frontend-engineering-intern", title: "Frontend Engineering Intern", type: "Internship", arrangement: "Hybrid", location: "Lagos", status: "published", applicants: 48, newApplicants: 6, views: 1240, shortlisted: 7, posted: "12 May 2025", deadline: "30 Jun 2025", compensation: "₦250k–350k/mo · Paid" },
  { id: "backend-engineer-junior", title: "Junior Backend Engineer", type: "Job", arrangement: "Hybrid", location: "Lagos", status: "published", applicants: 31, newApplicants: 3, views: 860, shortlisted: 4, posted: "08 May 2025", deadline: "12 Jun 2025", compensation: "₦650k–900k/mo" },
  { id: "data-intern", title: "Data Operations Intern", type: "Internship", arrangement: "Onsite", location: "Lagos", status: "paused", applicants: 19, newApplicants: 0, views: 410, shortlisted: 2, posted: "28 Apr 2025", deadline: "05 Jun 2025", compensation: "₦180k/mo · Paid" },
  { id: "qa-intern", title: "QA Engineering Intern", type: "Internship", arrangement: "Remote", location: "Nigeria", status: "draft", applicants: 0, newApplicants: 0, views: 0, shortlisted: 0, posted: "—", deadline: "—", compensation: "Unpaid · to confirm" },
  { id: "support-associate", title: "Merchant Support Associate", type: "Job", arrangement: "Onsite", location: "Abuja", status: "closed", applicants: 72, newApplicants: 0, views: 2100, shortlisted: 9, posted: "02 Mar 2025", deadline: "10 Apr 2025", compensation: "₦300k/mo" },
  { id: "design-grad", title: "Graduate Product Designer", type: "Graduate role", arrangement: "Hybrid", location: "Lagos", status: "published", applicants: 22, newApplicants: 4, views: 690, shortlisted: 3, posted: "10 May 2025", deadline: "20 Jun 2025", compensation: "₦400k/mo" },
];

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  listingId: string;
  stage: ApplicationStage;
  applied: string;
  location: string;
  education: string;
  experience: string;
  expectation: string;
  skills: string[];
  match?: { score: number; factors: { label: string; score: number; note: string }[] };
  identityVerified: boolean;
  evidence: { title: string; level: EvidenceLevel; outcome: string }[];
  readiness?: number;
  notes: string[];
}

const avatars = ["https://github.com/denizbuyuktas.png", "https://github.com/yusufhilmi.png", "https://github.com/denizcdemirci.png"];

export const candidates: Candidate[] = [
  {
    id: "c1", name: "Amara Okafor", avatar: avatars[0], headline: "Frontend Developer · Accessibility-focused", listingId: "frontend-engineering-intern", stage: "Interview", applied: "02 May", location: "Lagos", education: "B.Sc. Computer Science, UNILAG", experience: "1 freelance engagement + 3 projects", expectation: "₦300k/mo",
    skills: ["React", "TypeScript", "Accessibility"], identityVerified: true, readiness: 78,
    match: { score: 92, factors: [{ label: "React & TypeScript", score: 95, note: "3 projects, one verified" }, { label: "Accessibility", score: 88, note: "Employer-confirmed audit" }, { label: "Production experience", score: 76, note: "One shipped project" }] },
    evidence: [{ title: "Clinic booking web app", level: "verified", outcome: "Used by 2 clinics" }, { title: "Accessibility audit", level: "employer-confirmed", outcome: "38 issues resolved" }],
    notes: ["Strong portfolio walkthrough in screening."],
  },
  {
    id: "c2", name: "David Mensah", avatar: avatars[1], headline: "CS student · React & Node", listingId: "frontend-engineering-intern", stage: "Shortlisted", applied: "04 May", location: "Accra (open to relocate)", education: "B.Sc. Computer Engineering, KNUST (2025)", experience: "2 hackathon projects", expectation: "₦250k/mo",
    skills: ["React", "Node.js", "Tailwind"], identityVerified: true, readiness: 70,
    match: { score: 84, factors: [{ label: "React & TypeScript", score: 86, note: "React yes, TS self-reported" }, { label: "Accessibility", score: 62, note: "No evidence yet" }, { label: "Production experience", score: 80, note: "Hackathon app with 200 users" }] },
    evidence: [{ title: "Campus events app", level: "self-reported", outcome: "200 student users" }],
    notes: [],
  },
  {
    id: "c3", name: "Zainab Yusuf", avatar: avatars[2], headline: "Self-taught frontend developer", listingId: "frontend-engineering-intern", stage: "New", applied: "13 May", location: "Kano", education: "HND, Kano State Polytechnic", experience: "Bootcamp + 4 projects", expectation: "₦220k/mo",
    skills: ["JavaScript", "React", "CSS"], identityVerified: false, readiness: 64,
    match: { score: 79, factors: [{ label: "React & TypeScript", score: 78, note: "React projects; no TS" }, { label: "Accessibility", score: 70, note: "Bootcamp module completed (not competence)" }, { label: "Production experience", score: 66, note: "Personal projects only" }] },
    evidence: [{ title: "Recipe finder", level: "self-reported", outcome: "Deployed demo" }],
    notes: [],
  },
  {
    id: "c4", name: "Emeka Obi", avatar: avatars[1], headline: "Backend developer · Node & Postgres", listingId: "backend-engineer-junior", stage: "Test Task", applied: "09 May", location: "Lagos", education: "B.Eng. Electrical, UNN", experience: "1 year at agency", expectation: "₦750k/mo",
    skills: ["Node.js", "PostgreSQL", "Docker"], identityVerified: true, readiness: 74,
    evidence: [{ title: "Payments webhook service", level: "employer-confirmed", outcome: "Handled 10k events/day" }],
    notes: ["Paid test task accepted 12 May."],
  },
  {
    id: "c5", name: "Grace Wanjiru", avatar: avatars[2], headline: "Junior designer", listingId: "design-grad", stage: "Reviewed", applied: "11 May", location: "Nairobi", education: "B.Des, University of Nairobi", experience: "Internship at studio", expectation: "₦380k/mo",
    skills: ["Figma", "Prototyping"], identityVerified: true,
    evidence: [{ title: "Clinic app redesign", level: "self-reported", outcome: "Usability score +20%" }],
    notes: [],
  },
  {
    id: "c6", name: "Samuel Ade", avatar: avatars[0], headline: "Frontend developer", listingId: "frontend-engineering-intern", stage: "Rejected", applied: "03 May", location: "Ibadan", education: "B.Sc. Physics, UI", experience: "Personal projects", expectation: "₦200k/mo",
    skills: ["HTML", "CSS", "jQuery"], identityVerified: false,
    evidence: [], notes: ["Not enough React evidence for this role."],
  },
];

export const employerInterviews = [
  { id: "ei1", candidate: "Amara Okafor", role: "Frontend Engineering Intern", date: "Thu 22 May", time: "10:00 WAT", format: "Video", interviewer: "Ifeoma N.", status: "Confirmed" },
  { id: "ei2", candidate: "David Mensah", role: "Frontend Engineering Intern", date: "Fri 23 May", time: "14:00 WAT", format: "Video", interviewer: "Ifeoma N.", status: "Awaiting candidate" },
  { id: "ei3", candidate: "Emeka Obi", role: "Junior Backend Engineer", date: "Mon 26 May", time: "—", format: "AI written", interviewer: "Reviewed by Tolu A.", status: "Sent" },
];

export const testTasks = [
  { id: "tt1", candidate: "Emeka Obi", role: "Junior Backend Engineer", title: "Build a settlement report endpoint", payment: "₦40,000", deadline: "20 May 2025", status: "In progress", paymentStatus: "Escrow pending provider confirmation" },
];

export const billingHistory = [
  { id: "inv-0042", date: "14 May 2025", plan: "Starter", amount: "₦10,000", status: "Paid", method: "Card •••• 4242" },
  { id: "inv-0031", date: "14 Apr 2025", plan: "Starter", amount: "₦10,000", status: "Paid", method: "Card •••• 4242" },
  { id: "inv-0027", date: "14 Mar 2025", plan: "Starter", amount: "₦10,000", status: "Failed", method: "Card •••• 4242" },
  { id: "inv-0028", date: "15 Mar 2025", plan: "Starter", amount: "₦10,000", status: "Paid", method: "Bank transfer" },
];

export const recentActivity = [
  { id: "ra1", text: "Zainab Yusuf applied to Frontend Engineering Intern", time: "2h ago" },
  { id: "ra2", text: "Amara Okafor confirmed interview for 22 May", time: "5h ago" },
  { id: "ra3", text: "Emeka Obi accepted the paid test task", time: "Yesterday" },
  { id: "ra4", text: "Graduate Product Designer listing published", time: "10 May" },
];
