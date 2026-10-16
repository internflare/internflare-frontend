export type LeadStage =
  | "Identified"
  | "Contacted"
  | "Connected"
  | "In Conversation"
  | "Pitch Sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Not Interested";

export const leadStages: LeadStage[] = ["Identified", "Contacted", "Connected", "In Conversation", "Pitch Sent", "Negotiation", "Won", "Lost", "Not Interested"];
export const activeLeadStages: LeadStage[] = ["Identified", "Contacted", "Connected", "In Conversation", "Pitch Sent", "Negotiation", "Won"];

export interface Prospect {
  id: string;
  name: string;
  business: string;
  url: string;
  service: string;
  stage: LeadStage;
  channel: "LinkedIn" | "Email" | "WhatsApp" | "In person" | "Instagram";
  lastAction: string;
  lastActionDate: string;
  nextAction: string;
  followUp: string; // ISO date
  value: number;
  outcome?: string;
  awaitingReply: boolean;
  meetingBooked: boolean;
  notes: { id: string; date: string; text: string; kind: "note" | "response" }[];
}

export const prospects: Prospect[] = [
  {
    id: "pr1", name: "Funke Adeyemi", business: "Sunrise Pharmacy", url: "https://sunrisepharmacy.example", service: "Booking website", stage: "Pitch Sent", channel: "Email",
    lastAction: "Sent proposal PDF", lastActionDate: "2025-05-12", nextAction: "Follow up on proposal", followUp: "2025-05-15", value: 350000, awaitingReply: true, meetingBooked: true,
    notes: [
      { id: "n1", date: "12 May", text: "Sent proposal with 2 pricing options.", kind: "note" },
      { id: "n2", date: "09 May", text: "“We lose bookings on WhatsApp — a simple form would help.”", kind: "response" },
    ],
  },
  {
    id: "pr2", name: "Ade Bello", business: "Ade's Bakery", url: "https://instagram.com/adesbakery", service: "Landing page refresh", stage: "Contacted", channel: "Instagram",
    lastAction: "Sent intro DM", lastActionDate: "2025-05-10", nextAction: "Send follow-up with examples", followUp: "2025-05-13", value: 180000, awaitingReply: true, meetingBooked: false,
    notes: [{ id: "n3", date: "10 May", text: "DM'd about menu page — no reply yet.", kind: "note" }],
  },
  {
    id: "pr3", name: "Kunle Martins", business: "Mobi Gym", url: "https://mobigym.example", service: "Member portal", stage: "In Conversation", channel: "LinkedIn",
    lastAction: "Discovery call", lastActionDate: "2025-05-14", nextAction: "Draft pitch", followUp: "2025-05-19", value: 500000, awaitingReply: false, meetingBooked: true,
    notes: [{ id: "n4", date: "14 May", text: "Wants class booking + payments. Budget flexible.", kind: "response" }],
  },
  {
    id: "pr4", name: "Ngozi Eze", business: "Eze Legal", url: "https://ezelegal.example", service: "Website redesign", stage: "Identified", channel: "LinkedIn",
    lastAction: "Added prospect", lastActionDate: "2025-05-14", nextAction: "Send connection note manually", followUp: "2025-05-16", value: 400000, awaitingReply: false, meetingBooked: false, notes: [],
  },
  {
    id: "pr5", name: "Tolu Ajayi", business: "GreenCart", url: "https://greencart.example", service: "Shopify setup", stage: "Won", channel: "Email",
    lastAction: "Signed agreement", lastActionDate: "2025-05-06", nextAction: "Start engagement", followUp: "2025-05-20", value: 450000, outcome: "Won — ₦450k project", awaitingReply: false, meetingBooked: true,
    notes: [{ id: "n5", date: "06 May", text: "Agreed 50% upfront, 50% on launch.", kind: "note" }],
  },
  {
    id: "pr6", name: "Chika Obi", business: "Obi Interiors", url: "https://obiinteriors.example", service: "Portfolio site", stage: "Negotiation", channel: "WhatsApp",
    lastAction: "Sent revised quote", lastActionDate: "2025-05-11", nextAction: "Confirm scope", followUp: "2025-05-15", value: 280000, awaitingReply: true, meetingBooked: true, notes: [],
  },
  {
    id: "pr7", name: "Femi Lawal", business: "Lawal Logistics", url: "https://lawallogistics.example", service: "Tracking dashboard", stage: "Not Interested", channel: "LinkedIn",
    lastAction: "Declined", lastActionDate: "2025-05-02", nextAction: "—", followUp: "", value: 0, outcome: "Built in-house", awaitingReply: false, meetingBooked: false, notes: [],
  },
  {
    id: "pr8", name: "Bisi Cole", business: "Cole Events", url: "https://coleevents.example", service: "Event landing page", stage: "Connected", channel: "LinkedIn",
    lastAction: "Accepted connection", lastActionDate: "2025-05-13", nextAction: "Share relevant case study", followUp: "2025-05-17", value: 150000, awaitingReply: false, meetingBooked: false, notes: [],
  },
];

export interface DailyAction {
  id: string;
  title: string;
  prospectId?: string;
  kind: "outreach" | "follow-up" | "research" | "pitch";
  status: "pending" | "done" | "postponed" | "incomplete";
}

export const dailyActions: DailyAction[] = [
  { id: "d1", title: "Follow up with Sunrise Pharmacy on proposal", prospectId: "pr1", kind: "follow-up", status: "pending" },
  { id: "d2", title: "Confirm scope with Obi Interiors", prospectId: "pr6", kind: "follow-up", status: "pending" },
  { id: "d3", title: "Send connection note to Eze Legal (manually on LinkedIn)", prospectId: "pr4", kind: "outreach", status: "pending" },
  { id: "d4", title: "Research 3 clinics in Yaba needing booking sites", kind: "research", status: "done" },
  { id: "d5", title: "Draft pitch for Mobi Gym member portal", prospectId: "pr3", kind: "pitch", status: "pending" },
];

export const acquisitionSettings = {
  service: "Websites & booking systems for small businesses",
  idealClient: "Clinics, gyms and service businesses in Lagos with 5–50 staff",
  priceRange: "₦150k – ₦600k per project",
  channels: ["LinkedIn", "Email", "Instagram", "WhatsApp"],
  dailyTarget: 5,
};

export const weeklyActivity = [
  { week: "14 Apr", outreach: 12, replies: 3, meetings: 1, won: 0 },
  { week: "21 Apr", outreach: 15, replies: 4, meetings: 2, won: 0 },
  { week: "28 Apr", outreach: 10, replies: 4, meetings: 1, won: 1 },
  { week: "05 May", outreach: 18, replies: 6, meetings: 3, won: 1 },
  { week: "12 May", outreach: 14, replies: 5, meetings: 2, won: 0 },
];

export const TODAY = "2025-05-15";
export const formatShortDate = (iso: string) =>
  iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—";
