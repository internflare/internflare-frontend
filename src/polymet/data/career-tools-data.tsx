import { currentTalent } from "@/polymet/data/talent-data";

export interface CareerTool {
  id: string;
  name: string;
  description: string;
  group: "Documents" | "Applications" | "Analysis" | "Practice";
  inputLabel: string;
  inputPlaceholder: string;
  contextOptions: string[];
  output: (input: string, context: string) => string;
}

const p = currentTalent;

export const careerTools: CareerTool[] = [
  {
    id: "cv-builder", name: "CV builder", group: "Documents",
    description: "Generate a structured CV from your verified profile data.",
    inputLabel: "Anything to emphasise?", inputPlaceholder: "e.g. accessibility work, availability from June",
    contextOptions: ["Frontend Developer", "Product Designer"],
    output: (_i, c) => `${p.name}\n${c} · ${p.location} · ${p.email}\n\nSUMMARY\nFrontend developer focused on accessible React interfaces. ${p.availability}.\n\nPROJECTS\n• Clinic booking web app (Jan–Mar 2025) — React, TypeScript, Supabase. Used by 2 clinics during pilot. [Verified]\n• Accessibility audit, Brightwave Studio (Nov 2024) — 38 issues resolved; Lighthouse a11y 71 → 98. [Employer-confirmed]\n\nEDUCATION\n${p.education}\n\nSKILLS\nReact (Advanced), TypeScript (Intermediate), Accessibility (Intermediate)`,
  },
  {
    id: "cv-review", name: "CV review & improvement", group: "Documents",
    description: "Get specific, role-targeted feedback on your CV.",
    inputLabel: "Paste your CV text or choose an uploaded CV", inputPlaceholder: "Paste CV content…",
    contextOptions: ["Amara_Okafor_Frontend.pdf", "Amara_Okafor_General.pdf"],
    output: () => `STRENGTHS\n• Projects include outcomes (e.g. "Used by 2 clinics").\n• Clear, role-targeted summary.\n\nIMPROVEMENTS\n1. Add testing tools to the clinic app entry if you used them — currently no testing evidence is listed.\n2. Move the employer-confirmed accessibility audit above personal projects.\n3. Replace "worked on" with the specific contribution you made.\n\nNOT SUGGESTED\nWe won't add skills or experience that aren't in your profile.`,
  },
  {
    id: "cover-letter", name: "Cover letter generator", group: "Applications",
    description: "Draft a cover letter tailored to a specific opportunity.",
    inputLabel: "Why this role interests you (your words)", inputPlaceholder: "e.g. I use Kora's dashboard at my aunt's shop…",
    contextOptions: ["Frontend Engineering Intern · Kora Ledger", "Product Design Intern · Brightwave Studio"],
    output: (i, c) => `Dear Hiring Team,\n\nI'm applying for the ${c.split(" · ")[0]} role at ${c.split(" · ")[1]}. ${i || "[Add your reason for applying]"}\n\nIn my clinic booking project I built an accessible booking flow in React and TypeScript that two clinics used during a pilot. During a freelance engagement with Brightwave Studio I resolved 38 accessibility issues across 14 dashboard screens — work Brightwave has confirmed.\n\nI'd welcome the chance to bring the same care to your merchant dashboard.\n\nKind regards,\n${p.name}`,
  },
  {
    id: "outreach", name: "Application & outreach messages", group: "Applications",
    description: "Short, personal messages to recruiters or prospects. You send them yourself.",
    inputLabel: "Who are you writing to and why?", inputPlaceholder: "e.g. Recruiter at Nimbus Health about support engineer role",
    contextOptions: ["Recruiter follow-up", "Referral request", "Freelance prospect"],
    output: (i, c) => `Hi [Name],\n\n${c === "Freelance prospect" ? "I help small businesses take bookings online without WhatsApp back-and-forth." : "I recently applied for a role on your team and wanted to share one relevant project."} ${i ? `(${i})` : ""}\n\nMy clinic booking app is used by 2 clinics — happy to share a 2-minute demo.\n\nThanks,\n${p.firstName}`,
  },
  {
    id: "proposal", name: "Proposal writer", group: "Applications",
    description: "Role-specific proposals for freelance clients.",
    inputLabel: "Client need (from your notes)", inputPlaceholder: "e.g. Gym wants class booking and payments",
    contextOptions: ["Developer", "Designer", "Digital Marketer"],
    output: (i) => `PROPOSAL\n\nUnderstanding: ${i || "[Describe the client's need]"}\n\nApproach\n1. Discovery call and requirements (week 1)\n2. Design and build (weeks 2–4)\n3. Launch and handover (week 5)\n\nRelevant work: Clinic booking web app — used by 2 clinics.\n\nInvestment: [Your price]\n\nNext step: a 20-minute call to confirm scope.`,
  },
  {
    id: "skill-gap", name: "Job description & skill-gap analysis", group: "Analysis",
    description: "Paste a job description to compare it with your profile.",
    inputLabel: "Job description", inputPlaceholder: "Paste the full job description…",
    contextOptions: ["Frontend Developer profile"],
    output: () => `MATCHED (with evidence)\n• React — 3 projects (1 verified)\n• Accessibility — employer-confirmed\n\nPARTIAL\n• TypeScript — self-reported Intermediate\n\nMISSING\n• Unit/integration testing — no evidence\n• CI/CD — not on profile\n\nSuggested next step: Module 2 · Testing React apps`,
  },
  {
    id: "match-explain", name: "Opportunity match explanation", group: "Analysis",
    description: "Understand why an opportunity scored the way it did.",
    inputLabel: "Question (optional)", inputPlaceholder: "e.g. What would raise my score most?",
    contextOptions: ["Frontend Engineering Intern · Kora Ledger", "Growth Marketing Intern · Lumen Commerce"],
    output: () => `Your 92% match comes from three factors:\n• React & TypeScript (95%) — three portfolio projects use both.\n• Accessibility (88%) — employer-confirmed audit work.\n• Production experience (76%) — one deployed project.\n\nBiggest lever: add a second deployed project with real users.`,
  },
  {
    id: "readiness-explain", name: "Readiness explanation", group: "Analysis",
    description: "Plain-language explanation of your readiness result.",
    inputLabel: "Question (optional)", inputPlaceholder: "e.g. Why am I not job-ready yet?",
    contextOptions: ["Frontend Developer"],
    output: () => `You're internship-ready (78 vs. typical 60). For job-level roles (typical 70) you're at 61. The gap is mainly testing practice and production deployment — both addressed in your learning plan modules 2 and 3. This reflects current evidence, not your potential.`,
  },
  {
    id: "interview-practice", name: "AI interview practice", group: "Practice",
    description: "Practise written or spoken answers and get feedback.",
    inputLabel: "Your answer", inputPlaceholder: "Q: Tell me about a time you improved a product's accessibility…",
    contextOptions: ["Written · Frontend", "Behavioural", "Oral (requires microphone)"],
    output: (i) => `FEEDBACK\n• Structure: ${i.length > 120 ? "Clear situation and action." : "Add the situation and result — your answer is quite short."}\n• Evidence: Mention a measurable result (e.g. Lighthouse 71 → 98).\n• Delivery: Keep answers to around 90 seconds.\n\nPractice feedback is private and never shared with employers.`,
  },
  {
    id: "project-recs", name: "Learning & project recommendations", group: "Practice",
    description: "Practical projects that produce evidence for your target role.",
    inputLabel: "Time available per week", inputPlaceholder: "e.g. 6 hours",
    contextOptions: ["Frontend Developer"],
    output: () => `1. Add tests to your clinic app (3 user flows) — closes "testing" gap.\n2. Ship a small public tool and collect 10 users — closes "production" gap.\n3. Write a case study with before/after metrics — strengthens portfolio.\n\nThese are suggestions; resource links appear only when supplied by the learning library.`,
  },
];

export const getTool = (id: string) => careerTools.find((t) => t.id === id);
