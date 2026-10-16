export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  expertise: string[];
  roles: string[];
  formats: ("Video" | "Chat" | "Portfolio review")[];
  price: number; // NGN per session, 0 = free
  duration: number;
  rating: number;
  sessions: number;
  availability: "This week" | "Next week" | "Waitlist";
  bio: string;
  slots: { id: string; day: string; time: string }[];
  cancellation: string;
  readinessGaps: string[];
}

export const mentorDirectory: Mentor[] = [
  {
    id: "chidi-eze", name: "Chidi Eze", title: "Staff Engineer", company: "Fintech (Lagos)", avatar: "https://github.com/yusufhilmi.png",
    expertise: ["Frontend", "Testing", "Career transitions"], roles: ["Frontend Developer", "Software Engineer"], formats: ["Video", "Portfolio review"],
    price: 10000, duration: 45, rating: 4.9, sessions: 86, availability: "This week",
    bio: "10 years building web products for payments companies. I help early-career engineers turn projects into convincing evidence and prepare for technical interviews.",
    slots: [{ id: "s1", day: "Sat 24 May", time: "11:00 WAT" }, { id: "s2", day: "Sat 24 May", time: "14:00 WAT" }, { id: "s3", day: "Tue 27 May", time: "18:30 WAT" }],
    cancellation: "Free cancellation up to 24 hours before. Later cancellations are charged 50%.",
    readinessGaps: ["Testing practice", "Production deployment"],
  },
  {
    id: "ngozi-bello", name: "Ngozi Bello", title: "Engineering Manager", company: "Healthtech (Nairobi)", avatar: "https://github.com/denizcdemirci.png",
    expertise: ["Interview prep", "Testing", "Leadership"], roles: ["Software Engineer", "Frontend Developer"], formats: ["Video", "Chat"],
    price: 0, duration: 30, rating: 4.8, sessions: 41, availability: "Next week",
    bio: "I run free monthly office hours for early-career engineers focused on interview preparation and growing into your first role.",
    slots: [{ id: "s4", day: "Wed 28 May", time: "17:00 EAT" }, { id: "s5", day: "Thu 29 May", time: "17:00 EAT" }],
    cancellation: "Free sessions — please cancel at least 12 hours before so others can book.",
    readinessGaps: ["State management at scale"],
  },
  {
    id: "kwame-asante", name: "Kwame Asante", title: "Design Lead", company: "Brightwave Studio", avatar: "https://github.com/denizbuyuktas.png",
    expertise: ["Product design", "Portfolio", "UX research"], roles: ["Product Designer"], formats: ["Portfolio review", "Video"],
    price: 15000, duration: 60, rating: 5.0, sessions: 63, availability: "This week",
    bio: "I review design portfolios and help designers frame case studies around outcomes rather than screens.",
    slots: [{ id: "s6", day: "Fri 23 May", time: "15:00 GMT" }],
    cancellation: "Free cancellation up to 48 hours before.",
    readinessGaps: [],
  },
  {
    id: "amaka-nwosu", name: "Amaka Nwosu", title: "Growth Marketing Manager", company: "E-commerce (Lagos)", avatar: "https://github.com/polymet-ai.png",
    expertise: ["Digital marketing", "Analytics", "Freelancing"], roles: ["Digital Marketer"], formats: ["Video", "Chat"],
    price: 8000, duration: 45, rating: 4.7, sessions: 29, availability: "Waitlist",
    bio: "I help marketers build analytics skills and freelancers price and pitch their services.",
    slots: [],
    cancellation: "Free cancellation up to 24 hours before.",
    readinessGaps: [],
  },
];

export interface MentorSession {
  id: string;
  mentorId: string;
  date: string;
  time: string;
  format: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  goal: string;
  notes?: string;
  payment: "free" | "pending" | "paid" | "refunded";
  amount: number;
}

export const mentorSessions: MentorSession[] = [
  { id: "ms1", mentorId: "chidi-eze", date: "Sat 24 May 2025", time: "11:00 WAT", format: "Video", status: "confirmed", goal: "Review my testing approach for Module 2", payment: "paid", amount: 10000 },
  { id: "ms2", mentorId: "ngozi-bello", date: "Wed 28 May 2025", time: "17:00 EAT", format: "Video", status: "requested", goal: "Mock interview for Kora Ledger technical round", payment: "free", amount: 0 },
  { id: "ms3", mentorId: "chidi-eze", date: "Sat 26 Apr 2025", time: "11:00 WAT", format: "Portfolio review", status: "completed", goal: "Make portfolio projects show outcomes", notes: "Add metrics to clinic app case study. Record a 2-min demo video. Move accessibility audit to top.", payment: "paid", amount: 10000 },
];

export const formatNgn = (n: number) => (n === 0 ? "Free" : `₦${n.toLocaleString()}`);
