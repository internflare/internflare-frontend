import type { BankQuestion } from "@/polymet/data/ai-bank-types";

const ALL = ["intern", "junior", "mid", "senior"] as BankQuestion["levels"];
const EARLY = ["intern", "junior"] as BankQuestion["levels"];
const LATE = ["mid", "senior"] as BankQuestion["levels"];

export const businessBank: BankQuestion[] = [
  /* ---------------- Data analyst ---------------- */
  {
    id: "da-sql-jr", roleId: "data-analyst", competencyId: "da-sql", levels: EARLY, kind: "code-write", timeMins: 8,
    title: "Monthly active cooperatives",
    context: "The operations lead wants to know how many cooperatives made at least one payment each month of 2024.",
    prompt: "Write the SQL. Table: payments(id, cooperative_id, amount, paid_at).",
    starter: `-- payments(id, cooperative_id, amount, paid_at)

SELECT
`,
    checks: [
      { label: "Buckets payments by month", pattern: "date_trunc\\s*\\(\\s*'month'|strftime|to_char|extract\\s*\\(\\s*month|month\\s*\\(" },
      { label: "Counts distinct cooperatives", pattern: "count\\s*\\(\\s*distinct\\s+\\w*\\.?cooperative_id" },
      { label: "Filters to 2024", pattern: "2024" },
      { label: "Groups by month", pattern: "group\\s+by" },
      { label: "Orders chronologically", pattern: "order\\s+by" },
    ],
  },
  {
    id: "da-sql-mid", roleId: "data-analyst", competencyId: "da-sql", levels: LATE, kind: "code-review", timeMins: 7,
    title: "Review a revenue query",
    context: "Finance says this query over-reports revenue by about 18%.",
    prompt: "What's the most likely cause, and how would you rewrite it?",
    code: {
      lang: "sql",
      snippet: `SELECT c.region, SUM(o.amount) AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items i ON i.order_id = o.id
WHERE o.status = 'paid'
GROUP BY c.region;`,
    },
    options: [
      "GROUP BY should come before WHERE",
      "Joining order_items multiplies each order row, so order amounts are summed once per item",
      "SUM cannot be used with JOIN",
      "status should be compared with LIKE",
    ],
    answer: 1,
    rubric: [
      { point: "Identify the fan-out from the one-to-many join", keywords: ["fan-out", "fan out", "duplicat", "multipl", "one-to-many", "per item"] },
      { point: "Remove the unnecessary join or pre-aggregate in a CTE/subquery", keywords: ["remove the join", "cte", "subquery", "pre-aggregate", "with "] },
      { point: "Reconcile against a known total", keywords: ["reconcile", "check against", "validate", "compare"] },
    ],
  },
  {
    id: "da-sheets-jr", roleId: "data-analyst", competencyId: "da-sheets", levels: EARLY, kind: "mcq", timeMins: 2,
    title: "Joining two sheets",
    context: "Sheet A has farmer IDs and loan amounts; Sheet B has farmer IDs and regions.",
    prompt: "What's the most reliable way to bring region into Sheet A?",
    options: ["Copy and paste by eye", "XLOOKUP / INDEX-MATCH on farmer ID", "Sort both sheets and paste side by side", "Conditional formatting"],
    answer: 1,
  },
  {
    id: "da-sheets-mid", roleId: "data-analyst", competencyId: "da-sheets", levels: LATE, kind: "practical", timeMins: 7, minWords: 40,
    title: "Clean a messy export",
    context: "You've received this export from field agents.",
    material: { label: "loans_export.csv", rows: [["farmer_id", "region", "loan_ngn", "date"], ["F-001", "Kano ", "150,000", "03/04/2024"], ["f-001", "kano", "150000", "2024-04-03"], ["F-014", "Oyo", "", "2024-04-05"], ["F-022", "OYO", "N80k", "5 Apr 2024"]] },
    prompt: "List the problems you see and the steps you'd take to clean it before analysis.",
    rubric: [
      { point: "Duplicates (F-001 / f-001)", keywords: ["duplicate", "dedup", "f-001"] },
      { point: "Inconsistent text casing/whitespace", keywords: ["trim", "case", "whitespace", "lower", "upper", "standardis", "standardiz"] },
      { point: "Numbers stored as text (commas, N80k)", keywords: ["number", "numeric", "comma", "80k", "convert"] },
      { point: "Inconsistent date formats", keywords: ["date format", "dates", "iso", "parse"] },
      { point: "Missing values handled explicitly", keywords: ["missing", "blank", "null", "empty"] },
    ],
  },
  {
    id: "da-stats-jr", roleId: "data-analyst", competencyId: "da-stats", levels: EARLY, kind: "mcq", timeMins: 2,
    title: "Representative average",
    context: "Farm yields are skewed by a few very large commercial farms.",
    prompt: "Which measure best represents a typical farm?",
    options: ["Mean", "Median", "Maximum", "Sum"],
    answer: 1,
  },
  {
    id: "da-stats-mid", roleId: "data-analyst", competencyId: "da-stats", levels: LATE, kind: "scenario", timeMins: 7, minWords: 50,
    title: "Did the training work?",
    context: "Farmers who attended a training had 12% higher yields than those who didn't. The programme team wants to claim the training caused it.",
    prompt: "How do you respond, and how would you test the claim properly?",
    rubric: [
      { point: "Correlation isn't causation / selection bias", keywords: ["causation", "selection bias", "self-select", "confound"] },
      { point: "Compare like with like (control group, matching)", keywords: ["control group", "matching", "comparable", "randomi"] },
      { point: "Check significance / sample size", keywords: ["significan", "sample size", "confidence interval", "p-value"] },
      { point: "Baseline / before-and-after comparison", keywords: ["baseline", "before and after", "difference-in-differences", "previous season"] },
    ],
  },
  {
    id: "da-viz-jr", roleId: "data-analyst", competencyId: "da-viz", levels: EARLY, kind: "mcq", timeMins: 2,
    title: "Choose the chart",
    context: "You need to show monthly repayment rate over 12 months for one region.",
    prompt: "Which chart fits best?",
    options: ["Pie chart", "Line chart", "Word cloud", "3D bar chart"],
    answer: 1,
  },
  {
    id: "da-viz-mid", roleId: "data-analyst", competencyId: "da-viz", levels: LATE, kind: "scenario", timeMins: 6, minWords: 40,
    title: "Fix a misleading dashboard",
    context: "A dashboard shows repayment rate on a bar chart with the y-axis starting at 92%, uses 9 colours, and has no target line.",
    prompt: "What would you change and why?",
    rubric: [
      { point: "Start the bar axis at zero (or use a line/dot plot)", keywords: ["zero", "axis", "truncat"] },
      { point: "Reduce colours / highlight what matters", keywords: ["colour", "color", "highlight", "fewer"] },
      { point: "Add the target/benchmark", keywords: ["target", "benchmark", "goal line"] },
      { point: "Clear title stating the takeaway", keywords: ["title", "takeaway", "headline", "annotation"] },
    ],
  },
  {
    id: "da-comm-jr", roleId: "data-analyst", competencyId: "da-comm", levels: EARLY, kind: "practical", timeMins: 6, minWords: 40,
    title: "Summarise for a field manager",
    context: "Your analysis found Kano repayments dropped from 94% to 81% in March, mostly among farmers whose loans were disbursed late.",
    prompt: "Write a short message to the regional field manager (not technical).",
    rubric: [
      { point: "Lead with the key finding", keywords: ["dropped", "fell", "81%", "decline"] },
      { point: "Explain the likely reason", keywords: ["late", "disburs", "because", "reason"] },
      { point: "Recommend an action", keywords: ["recommend", "suggest", "should", "next step", "propose"] },
      { point: "Offer detail / follow-up", keywords: ["happy to", "call", "detail", "dashboard", "attached"] },
    ],
  },
  {
    id: "da-comm-mid", roleId: "data-analyst", competencyId: "da-comm", levels: LATE, kind: "scenario", timeMins: 6, minWords: 50,
    title: "Present an unwelcome finding",
    context: "Your analysis shows the CEO's favourite new product line loses money in 3 of 4 regions.",
    prompt: "How do you prepare and present this finding?",
    rubric: [
      { point: "Validate the numbers with stakeholders first", keywords: ["validate", "double-check", "finance", "pre-wire", "review with"] },
      { point: "Lead with the conclusion and impact", keywords: ["lead with", "conclusion", "impact", "bottom line"] },
      { point: "Show where it works (nuance)", keywords: ["one region", "works", "nuance", "profitable"] },
      { point: "Offer options/recommendations", keywords: ["option", "recommend", "next step"] },
    ],
  },

  /* ---------------- Virtual assistant ---------------- */
  {
    id: "va-cal-jr", roleId: "virtual-assistant", competencyId: "va-calendar", levels: EARLY, kind: "practical", timeMins: 6, minWords: 40,
    title: "Schedule across time zones",
    context: "Your client (Lagos, WAT) needs a 45-min call this week with a partner in London (BST) and an investor in New York (EDT). The investor is only free 9–11am New York time.",
    material: { label: "Client calendar — Thursday (WAT)", rows: [["Time (WAT)", "Event"], ["13:00–14:00", "Team stand-up"], ["14:00–15:00", "Free"], ["15:00–16:30", "Supplier visit"], ["16:30–18:00", "Free"]] },
    prompt: "Propose a slot and write the invite message, stating the time for each attendee.",
    rubric: [
      { point: "Picks a slot that fits everyone (14:00–15:00 WAT = 9–10am EDT)", keywords: ["14:00", "2pm", "2:00", "9am", "9:00", "9 am"] },
      { point: "States time in each zone", keywords: ["wat", "bst", "edt", "london", "new york"] },
      { point: "Includes agenda/purpose and link", keywords: ["agenda", "purpose", "link", "zoom", "meet"] },
      { point: "Asks for confirmation / alternative", keywords: ["confirm", "alternative", "let me know", "work for"] },
    ],
  },
  {
    id: "va-cal-mid", roleId: "virtual-assistant", competencyId: "va-calendar", levels: LATE, kind: "practical", timeMins: 7, minWords: 50,
    title: "Triage an executive inbox",
    context: "You manage a founder's inbox. It's Monday 8am.",
    material: { label: "Inbox (unread)", rows: [["From", "Subject"], ["Bank relationship manager", "URGENT: KYC documents needed by noon"], ["Newsletter", "10 growth hacks"], ["Investor", "Re: board deck — any update?"], ["Unknown sender", "Invoice overdue — click to pay"], ["Team lead", "Can we move 1:1 to Wednesday?"]] },
    prompt: "How do you handle each email, in priority order?",
    rubric: [
      { point: "KYC deadline first — gather docs/flag to founder", keywords: ["kyc", "noon", "first", "urgent"] },
      { point: "Treat the unknown invoice as possible phishing", keywords: ["phishing", "scam", "suspicious", "verify", "don't click", "do not click"] },
      { point: "Reply to investor with status or draft for founder", keywords: ["investor", "board deck", "draft", "status"] },
      { point: "Reschedule the 1:1 directly", keywords: ["reschedul", "move", "wednesday"] },
      { point: "Archive/filter the newsletter", keywords: ["archive", "filter", "unsubscribe", "label"] },
    ],
  },
  {
    id: "va-tools-jr", roleId: "virtual-assistant", competencyId: "va-tools", levels: EARLY, kind: "mcq", timeMins: 2,
    title: "Sharing safely",
    context: "A client asks you to share a Google Sheet of customer phone numbers with an external contractor.",
    prompt: "What's the best approach?",
    options: ["Set link to 'Anyone with the link can edit'", "Share with the contractor's email as Viewer (or Commenter) and confirm with the client", "Email the sheet as an attachment to everyone", "Post the link in the team WhatsApp group"],
    answer: 1,
  },
  {
    id: "va-tools-mid", roleId: "virtual-assistant", competencyId: "va-tools", levels: LATE, kind: "scenario", timeMins: 7, minWords: 50,
    title: "Automate a repetitive workflow",
    context: "Every week you copy new leads from a web form into a spreadsheet, email each a welcome note and create a follow-up task.",
    prompt: "Describe how you'd automate it, which tools you'd use, and how you'd keep it reliable.",
    rubric: [
      { point: "Name a concrete tool (Zapier, Make, Apps Script)", keywords: ["zapier", "make", "apps script", "n8n", "power automate"] },
      { point: "Describe trigger → actions", keywords: ["trigger", "new form", "when a", "action"] },
      { point: "Template the email / personalise fields", keywords: ["template", "personalis", "personaliz", "merge"] },
      { point: "Error handling / monitoring / test run", keywords: ["error", "test", "monitor", "notify", "check"] },
    ],
  },
  {
    id: "va-comm-jr", roleId: "virtual-assistant", competencyId: "va-comm", levels: EARLY, kind: "practical", timeMins: 6, minWords: 50,
    title: "Reply to an upset customer",
    context: "On behalf of your client's bakery: a customer emails angrily that their birthday cake order was delivered 2 hours late.",
    prompt: "Write the reply email.",
    rubric: [
      { point: "Apologise sincerely", keywords: ["sorry", "apolog"] },
      { point: "Acknowledge the specific impact", keywords: ["birthday", "late", "2 hours", "two hours"] },
      { point: "Offer a concrete remedy", keywords: ["refund", "discount", "voucher", "credit", "free"] },
      { point: "Professional sign-off and next step", keywords: ["regards", "best", "contact", "reach", "let us know"] },
    ],
  },
  {
    id: "va-comm-mid", roleId: "virtual-assistant", competencyId: "va-comm", levels: LATE, kind: "practical", timeMins: 6, minWords: 50,
    title: "Decline a meeting diplomatically",
    context: "Your client, a busy founder, wants to decline a speaking invitation from a major partner without damaging the relationship.",
    prompt: "Write the email on your client's behalf.",
    rubric: [
      { point: "Thank them and acknowledge the honour", keywords: ["thank", "honour", "honor", "appreciate"] },
      { point: "Decline clearly with a brief reason", keywords: ["unable", "won't be able", "can't", "cannot", "schedule"] },
      { point: "Offer an alternative (colleague, later date)", keywords: ["alternative", "colleague", "future", "another time", "instead"] },
      { point: "Warm close", keywords: ["look forward", "best", "warm", "regards"] },
    ],
  },
  {
    id: "va-judge-jr", roleId: "virtual-assistant", competencyId: "va-judgement", levels: EARLY, kind: "mcq", timeMins: 2,
    title: "Handling a confidential request",
    context: "Someone claiming to be your client's accountant calls asking for the company bank login.",
    prompt: "What do you do?",
    options: ["Share it — accountants need access", "Decline, verify through a known contact and tell your client", "Email it so there's a record", "Ask them to call back tomorrow and then share it"],
    answer: 1,
  },
  {
    id: "va-judge-mid", roleId: "virtual-assistant", competencyId: "va-judgement", levels: LATE, kind: "scenario", timeMins: 6, minWords: 50,
    title: "Two urgent requests collide",
    context: "Your client asks you to book flights for tomorrow before prices rise, while their co-founder asks you to urgently compile investor documents due in 2 hours.",
    prompt: "How do you prioritise and communicate?",
    rubric: [
      { point: "Clarify deadlines and impact", keywords: ["deadline", "impact", "clarify", "ask"] },
      { point: "Do the hard-deadline task first / hold the fare", keywords: ["2 hours", "investor", "first", "hold", "reserve"] },
      { point: "Tell both people the plan", keywords: ["inform", "let both", "tell", "communicate", "update"] },
      { point: "Escalate if the conflict can't be resolved", keywords: ["escalat", "decide", "priority call"] },
    ],
  },

  /* ---------------- Product designer ---------------- */
  {
    id: "pd-research", roleId: "product-designer", competencyId: "pd-research", levels: ALL, kind: "scenario", timeMins: 7, minWords: 50,
    title: "Plan usability tests",
    context: "Sign-up completion for a savings app dropped from 62% to 41% after a redesign.",
    prompt: "Plan research to find out why within one week.",
    rubric: [
      { point: "Use analytics/funnel to find the drop-off step", keywords: ["funnel", "analytics", "drop-off", "drop off"] },
      { point: "Moderated usability tests with 5–8 target users", keywords: ["usability test", "5 users", "five users", "participants", "moderated"] },
      { point: "Task-based script, avoid leading questions", keywords: ["task", "script", "leading"] },
      { point: "Synthesise findings into prioritised issues", keywords: ["synthes", "affinity", "prioriti", "themes"] },
    ],
  },
  {
    id: "pd-interaction", roleId: "product-designer", competencyId: "pd-interaction", levels: ALL, kind: "scenario", timeMins: 6, minWords: 40,
    title: "Design all the states",
    context: "You're designing a 'Transfer money' screen.",
    prompt: "Which states and edge cases must the design cover?",
    rubric: [
      { point: "Loading / processing", keywords: ["loading", "processing", "pending"] },
      { point: "Validation errors (amount, account)", keywords: ["validation", "invalid", "error"] },
      { point: "Insufficient balance", keywords: ["insufficient", "balance"] },
      { point: "Confirmation and success/receipt", keywords: ["confirm", "success", "receipt"] },
      { point: "Network failure / retry", keywords: ["network", "offline", "retry", "fail"] },
    ],
  },
  {
    id: "pd-visual", roleId: "product-designer", competencyId: "pd-visual", levels: ALL, kind: "mcq", timeMins: 2,
    title: "Visual hierarchy",
    context: "A pricing card has five equally bold elements competing for attention.",
    prompt: "What's the most effective first fix?",
    options: ["Add more colours", "Establish one focal point with size/weight contrast and reduce emphasis elsewhere", "Make everything larger", "Add drop shadows to all text"],
    answer: 1,
  },
  {
    id: "pd-proto", roleId: "product-designer", competencyId: "pd-proto", levels: ALL, kind: "mcq", timeMins: 2,
    title: "Prototype fidelity",
    context: "You want to test whether users understand a new navigation structure.",
    prompt: "Which prototype is most appropriate first?",
    options: ["Fully coded production build", "Low-to-mid fidelity clickable prototype focused on navigation", "Static high-fidelity PNGs", "A written spec"],
    answer: 1,
  },
  {
    id: "pd-comm", roleId: "product-designer", competencyId: "pd-comm", levels: ALL, kind: "scenario", timeMins: 5, minWords: 40,
    title: "Handle design critique",
    context: "An engineer says your design will take 3 sprints; the PM loves it.",
    prompt: "How do you respond in the review?",
    rubric: [
      { point: "Ask which parts drive the cost", keywords: ["which part", "why", "drive", "complex"] },
      { point: "Tie decisions to user evidence/goals", keywords: ["research", "evidence", "user", "goal"] },
      { point: "Propose a phased or simplified version", keywords: ["phase", "simplif", "mvp", "iterate"] },
    ],
  },

  /* ---------------- Growth marketer ---------------- */
  {
    id: "gm-content", roleId: "growth-marketer", competencyId: "gm-content", levels: ALL, kind: "practical", timeMins: 5, minWords: 30,
    title: "Write a push notification + email subject",
    context: "Re-engage users who saved items but haven't purchased in 14 days. Brand voice: warm, concise.",
    prompt: "Write one push notification (≤ 90 characters) and two email subject lines to A/B test.",
    rubric: [
      { point: "Clear value or reason to return", keywords: ["saved", "waiting", "back", "still"] },
      { point: "Call to action", keywords: ["shop", "tap", "check", "see", "get"] },
      { point: "Two distinct subject variants", keywords: ["a:", "b:", "variant", "1.", "2.", "option"] },
    ],
  },
  {
    id: "gm-analytics", roleId: "growth-marketer", competencyId: "gm-analytics", levels: ALL, kind: "practical", timeMins: 6, minWords: 40,
    title: "Diagnose a funnel",
    context: "Last month's campaign funnel:",
    material: { label: "Campaign funnel", rows: [["Step", "Users", "Prev. month"], ["Ad clicks", "20,000", "18,500"], ["Landing page", "16,400", "15,900"], ["Sign-up started", "4,100", "6,200"], ["Sign-up completed", "2,900", "4,300"]] },
    prompt: "Where's the problem, what are the likely causes, and what would you check next?",
    rubric: [
      { point: "Landing → sign-up start is the drop", keywords: ["sign-up started", "landing", "25%", "39%", "drop"] },
      { point: "Hypotheses (page change, message mismatch, load time)", keywords: ["page change", "message", "mismatch", "load", "broken", "mobile"] },
      { point: "Segment by device/source", keywords: ["segment", "device", "source", "channel"] },
      { point: "Next check / experiment", keywords: ["test", "experiment", "heatmap", "session recording"] },
    ],
  },
  {
    id: "gm-exp", roleId: "growth-marketer", competencyId: "gm-experiments", levels: ALL, kind: "mcq", timeMins: 2,
    title: "Reading an A/B test",
    context: "Variant B converted at 5.4% vs A at 5.0% after two days with 300 visitors each.",
    prompt: "What should you conclude?",
    options: ["Ship B — it's 8% better", "Too early: sample is small; run to the planned sample size before deciding", "A is better", "Stop testing and ask the CEO"],
    answer: 1,
  },
  {
    id: "gm-comm", roleId: "growth-marketer", competencyId: "gm-comm", levels: ALL, kind: "practical", timeMins: 5, minWords: 40,
    title: "Weekly results update",
    context: "Your referral campaign drove 640 sign-ups (target 800) at ₦1,200 CAC (target ₦1,500).",
    prompt: "Write the Slack update to leadership.",
    rubric: [
      { point: "Results vs targets", keywords: ["640", "800", "target", "below"] },
      { point: "Highlight the efficiency win", keywords: ["cac", "1,200", "cheaper", "below target", "efficient"] },
      { point: "Next steps", keywords: ["next", "plan", "will", "scale"] },
    ],
  },

  /* ---------------- Support engineer ---------------- */
  {
    id: "se-trouble", roleId: "support-engineer", competencyId: "se-troubleshoot", levels: ALL, kind: "scenario", timeMins: 6, minWords: 40,
    title: "Merchant can't receive payments",
    context: "A merchant says customers see 'Payment failed' since this morning. Other merchants are fine.",
    prompt: "How do you troubleshoot?",
    rubric: [
      { point: "Gather details: error, time, sample references", keywords: ["reference", "transaction id", "screenshot", "when", "details"] },
      { point: "Check account config (keys, settlement, KYC status)", keywords: ["api key", "keys", "config", "kyc", "settings"] },
      { point: "Reproduce / check logs", keywords: ["reproduce", "logs", "dashboard"] },
      { point: "Escalate with a clear summary if needed", keywords: ["escalat", "engineering", "ticket"] },
    ],
  },
  {
    id: "se-apis", roleId: "support-engineer", competencyId: "se-apis", levels: ALL, kind: "code-review", timeMins: 5,
    title: "Read an API error",
    context: "A developer pastes this response from our API.",
    prompt: "What's wrong, and what do you tell them?",
    code: { lang: "json", snippet: `HTTP/1.1 401 Unauthorized
{
  "status": false,
  "message": "Invalid key",
  "hint": "Using test key against live endpoint"
}` },
    options: ["The server is down", "They're using a test secret key against the live environment", "The JSON is malformed", "They need to retry later"],
    answer: 1,
    rubric: [
      { point: "Use the live secret key (or the test endpoint)", keywords: ["live key", "live secret", "test endpoint", "switch"] },
      { point: "Never share secret keys in tickets/frontend", keywords: ["secret", "don't share", "do not share", "frontend", "rotate"] },
    ],
  },
  {
    id: "se-comm", roleId: "support-engineer", competencyId: "se-comm", levels: ALL, kind: "practical", timeMins: 5, minWords: 40,
    title: "Explain a fix to a non-technical merchant",
    context: "The merchant's payouts paused because their bank account name didn't match their business registration.",
    prompt: "Write the reply.",
    rubric: [
      { point: "Empathy", keywords: ["sorry", "understand", "apolog"] },
      { point: "Plain-language cause", keywords: ["name", "match", "registration"] },
      { point: "Clear steps to fix", keywords: ["update", "upload", "steps", "settings"] },
      { point: "Timeline / follow-up", keywords: ["within", "hours", "once", "follow"] },
    ],
  },

  /* ---------------- Programme assistant ---------------- */
  {
    id: "pa-fac", roleId: "programme-assistant", competencyId: "pa-facilitation", levels: ALL, kind: "scenario", timeMins: 5, minWords: 40,
    title: "Run a digital-literacy session",
    context: "You're running a 1-hour session for 15 market traders on using mobile banking safely. Half have never used an app.",
    prompt: "Outline your session plan.",
    rubric: [
      { point: "Clear objectives", keywords: ["objective", "goal", "by the end"] },
      { point: "Hands-on practice", keywords: ["practice", "hands-on", "demo", "try"] },
      { point: "Adapt for mixed levels (pairing)", keywords: ["pair", "buddy", "mixed", "beginner"] },
      { point: "Safety/fraud tips and recap", keywords: ["fraud", "pin", "scam", "recap", "summary"] },
    ],
  },
  {
    id: "pa-digital", roleId: "programme-assistant", competencyId: "pa-digital", levels: ALL, kind: "mcq", timeMins: 2,
    title: "Tracking attendance",
    context: "You need to track attendance across 12 sessions and share totals with a funder.",
    prompt: "Best approach?",
    options: ["Paper lists only", "A shared Google Sheet/Form with one row per attendee per session and a summary tab", "WhatsApp messages", "Memory"],
    answer: 1,
  },
  {
    id: "pa-comm", roleId: "programme-assistant", competencyId: "pa-comm", levels: ALL, kind: "practical", timeMins: 5, minWords: 40,
    title: "Funder update",
    context: "This month: 4 sessions, 58 attendees (target 60), 41 opened bank apps; one session cancelled due to rain.",
    prompt: "Write a short update to the funder.",
    rubric: [
      { point: "Key numbers vs target", keywords: ["58", "60", "41", "target"] },
      { point: "Honest about the cancellation", keywords: ["cancel", "rain"] },
      { point: "Next month's plan", keywords: ["next month", "plan", "reschedul"] },
    ],
  },
];
