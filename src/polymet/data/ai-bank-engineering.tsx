import type { BankQuestion } from "@/polymet/data/ai-bank-types";

const FE = "frontend-developer";
const BE = "backend-engineer";

export const engineeringBank: BankQuestion[] = [
  /* ---------------- Frontend · React ---------------- */
  {
    id: "fe-react-jr", roleId: FE, competencyId: "fe-react", levels: ["intern", "junior"], kind: "code-review", timeMins: 6,
    title: "Review a data-fetching component",
    context: "You're reviewing a teammate's PR for the merchant dashboard. Customers say the orders page is slow and the API team reports a spike in requests.",
    prompt: "What is the main bug in this component? Then explain how you'd fix it and anything else you'd flag in review.",
    code: {
      lang: "tsx",
      snippet: `function OrderList({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/customers/" + customerId + "/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data));
  });

  return (
    <ul>
      {orders.map((o) => <li>{o.total}</li>)}
    </ul>
  );
}`,
    },
    options: [
      "useEffect has no dependency array, so it refetches after every render and loops",
      "fetch cannot be called inside a React component",
      "useState must be initialised with null instead of []",
      "orders.map should be replaced with forEach",
    ],
    answer: 0,
    rubric: [
      { point: "Add [customerId] as the dependency array", keywords: ["[customerid]", "dependency array", "dependencies", "deps"] },
      { point: "Add a stable key to each <li>", keywords: ["key"] },
      { point: "Handle stale responses / cleanup (AbortController or ignore flag)", keywords: ["abort", "cleanup", "race", "stale", "ignore", "unmount"] },
      { point: "Handle loading and error states", keywords: ["loading", "error", "catch", "res.ok", "r.ok"] },
    ],
  },
  {
    id: "fe-react-mid", roleId: FE, competencyId: "fe-react", levels: ["mid", "senior"], kind: "code-write", timeMins: 10,
    title: "Implement a debounced search hook",
    context: "The product search box fires an API call on every keystroke, costing us ~40k extra requests a day.",
    prompt: "Implement useDebouncedValue so the search only updates after the user stops typing for `delay` ms. It must clean up correctly when the value changes or the component unmounts.",
    starter: `import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  // your implementation
}
`,
    checks: [
      { label: "Keeps the debounced value in state", pattern: "useState" },
      { label: "Schedules the update with setTimeout", pattern: "setTimeout\\(" },
      { label: "Clears the timer in the effect cleanup", pattern: "return\\s*\\(\\)\\s*=>\\s*\\{?\\s*clearTimeout" },
      { label: "Re-runs when value or delay change", pattern: "\\[\\s*value\\s*,\\s*delay\\s*\\]|\\[\\s*delay\\s*,\\s*value\\s*\\]" },
      { label: "Returns the debounced value", pattern: "return\\s+debounced|return\\s+\\w+\\s*;?\\s*\\}\\s*$" },
    ],
  },

  /* ---------------- Frontend · TypeScript ---------------- */
  {
    id: "fe-ts-jr", roleId: FE, competencyId: "fe-ts", levels: ["intern", "junior"], kind: "code-write", timeMins: 8,
    title: "Type an API response safely",
    context: "The profile API sometimes omits last_name and returns nickname as null. Production logs show 'undefined' appearing in user names.",
    prompt: "Add types and fix displayName so it never renders 'undefined'. Prefer nickname, otherwise first + last name (when present).",
    starter: `// API shape: { id: number; first_name: string; last_name?: string; nickname?: string | null }

export function displayName(user) {
  return user.nickname || user.first_name + " " + user.last_name;
}
`,
    checks: [
      { label: "Declares a type or interface for the user", pattern: "(interface|type)\\s+\\w+" },
      { label: "Marks last_name as optional", pattern: "last_name\\?\\s*:" },
      { label: "Types nickname as string | null (optional)", pattern: "nickname\\?\\s*:\\s*string\\s*\\|\\s*null" },
      { label: "Types the user parameter", pattern: "displayName\\(\\s*user\\s*:" },
      { label: "Declares a string return type", pattern: "\\)\\s*:\\s*string" },
      { label: "Guards against a missing last_name", pattern: "last_name\\s*\\?|\\?\\?|filter\\(Boolean\\)|last_name\\s*&&|trim\\(" },
    ],
  },
  {
    id: "fe-ts-mid", roleId: FE, competencyId: "fe-ts", levels: ["mid", "senior"], kind: "mcq", timeMins: 3,
    title: "Exhaustive state handling",
    context: "Payment status is modelled as type Status = { kind: 'idle' } | { kind: 'pending' } | { kind: 'paid'; ref: string } | { kind: 'failed'; reason: string }.",
    prompt: "A teammate adds { kind: 'refunded' }. Which pattern makes the compiler flag every switch that forgot to handle it?",
    options: [
      "Add a default branch that returns null",
      "Assign the value to a variable typed never in the default branch",
      "Cast the status to any before switching",
      "Use if/else instead of switch",
    ],
    answer: 1,
  },

  /* ---------------- Frontend · Testing ---------------- */
  {
    id: "fe-test-jr", roleId: FE, competencyId: "fe-testing", levels: ["intern", "junior"], kind: "scenario", timeMins: 6, minWords: 40,
    title: "Test plan for a sign-up form",
    context: "You've built a sign-up form (name, email, password) that calls POST /api/signup and shows a success message.",
    prompt: "Before merging, which tests would you write, with which tools, and what would each one assert?",
    rubric: [
      { point: "Test from the user's perspective (Testing Library, queries by role/label)", keywords: ["testing library", "getbyrole", "getbylabel", "user-event", "userevent", "user's perspective", "like a user"] },
      { point: "Invalid input shows validation errors", keywords: ["invalid", "validation", "error message", "wrong email"] },
      { point: "Successful submit shows success, with the API mocked", keywords: ["mock", "msw", "success", "stub"] },
      { point: "Server error / network failure path", keywords: ["server error", "500", "network", "fails", "failure"] },
      { point: "Loading / double-submit prevention", keywords: ["loading", "disabled", "double", "twice"] },
    ],
  },
  {
    id: "fe-test-mid", roleId: FE, competencyId: "fe-testing", levels: ["mid", "senior"], kind: "code-review", timeMins: 6,
    title: "Diagnose a flaky test",
    context: "This test passes locally but fails ~30% of CI runs.",
    prompt: "Why is it flaky? Explain how you'd make it deterministic.",
    code: {
      lang: "tsx",
      snippet: `test("shows customer orders", () => {
  render(<OrderList customerId="42" />);
  expect(screen.getByText("₦12,000")).toBeInTheDocument();
});`,
    },
    options: [
      "Orders load asynchronously; it asserts before data arrives and relies on a real network call",
      "toBeInTheDocument is deprecated",
      "customerId must be a number",
      "render must be called inside beforeEach",
    ],
    answer: 0,
    rubric: [
      { point: "Await the async UI (findBy / waitFor)", keywords: ["findby", "waitfor", "await", "async"] },
      { point: "Mock the network deterministically (MSW / mocked fetch)", keywords: ["msw", "mock", "stub", "intercept"] },
      { point: "Avoid real timers / shared state between tests", keywords: ["fake timers", "isolat", "reset", "shared state", "cleanup"] },
    ],
  },

  /* ---------------- Frontend · Accessibility ---------------- */
  {
    id: "fe-a11y-jr", roleId: FE, competencyId: "fe-a11y", levels: ["intern", "junior"], kind: "code-review", timeMins: 5,
    title: "Accessibility review",
    context: "A screen-reader user reports they can't save their profile.",
    prompt: "Pick the most complete diagnosis, then describe the corrected markup.",
    code: {
      lang: "tsx",
      snippet: `<div className="btn" onClick={save}>
  <img src="/icons/save.svg" />
</div>

<input placeholder="Email" />`,
    },
    options: [
      "Only the icon colour contrast is too low",
      "The clickable div isn't focusable or keyboard-operable, the icon has no accessible name, and the input has no label",
      "The placeholder should be longer",
      "onClick should be renamed onPress",
    ],
    answer: 1,
    rubric: [
      { point: "Use a native <button>", keywords: ["<button", "button element", "native button", "use a button"] },
      { point: "Give the icon button an accessible name", keywords: ["aria-label", "alt", "accessible name", "visually hidden", "sr-only"] },
      { point: "Associate a <label> with the input", keywords: ["<label", "htmlfor", "label for", "aria-labelledby"] },
    ],
  },
  {
    id: "fe-a11y-mid", roleId: FE, competencyId: "fe-a11y", levels: ["mid", "senior"], kind: "scenario", timeMins: 6, minWords: 50,
    title: "Accessible checkout modal",
    context: "You own the checkout modal used by 200k monthly buyers. An audit flagged it as a WCAG blocker.",
    prompt: "Describe everything you'd implement so the modal is accessible for keyboard and screen-reader users.",
    rubric: [
      { point: "Move focus into the dialog and trap it", keywords: ["focus trap", "trap focus", "move focus", "initial focus"] },
      { point: "Return focus to the trigger on close", keywords: ["return focus", "restore focus", "back to the trigger", "previously focused"] },
      { point: "Escape closes the dialog", keywords: ["escape", "esc"] },
      { point: "role=dialog, aria-modal and a labelled title", keywords: ["role=\"dialog\"", "role=dialog", "aria-modal", "aria-labelledby", "alertdialog"] },
      { point: "Make background inert / prevent scroll", keywords: ["inert", "aria-hidden", "scroll lock", "background"] },
    ],
  },

  /* ---------------- Frontend · Production delivery ---------------- */
  {
    id: "fe-deploy-jr", roleId: FE, competencyId: "fe-deploy", levels: ["intern", "junior"], kind: "scenario", timeMins: 7, minWords: 50,
    title: "Production incident after your deploy",
    context: "15 minutes after your PR ships, Sentry shows `TypeError: Cannot read properties of undefined (reading 'map')` on the orders page for 8% of sessions.",
    prompt: "Walk through exactly how you respond, from the first minute to the follow-up.",
    rubric: [
      { point: "Check the stack trace, release and affected users in monitoring", keywords: ["stack trace", "sentry", "logs", "release", "monitoring"] },
      { point: "Mitigate fast: roll back or feature-flag off", keywords: ["roll back", "rollback", "revert", "feature flag", "toggle off"] },
      { point: "Reproduce with the failing data (empty/undefined response)", keywords: ["reproduce", "undefined", "empty", "api response", "edge case"] },
      { point: "Fix with a guard/default and add a regression test", keywords: ["default", "guard", "optional chaining", "?? []", "regression test", "add a test"] },
      { point: "Communicate and write a short post-incident note", keywords: ["communicate", "team", "post-mortem", "postmortem", "incident note", "update"] },
    ],
  },
  {
    id: "fe-deploy-mid", roleId: FE, competencyId: "fe-deploy", levels: ["mid", "senior"], kind: "scenario", timeMins: 7, minWords: 60,
    title: "Fix a slow product page",
    context: "Field data shows LCP of 4.8s on mobile for the product page; conversion on mobile is 30% below desktop.",
    prompt: "How do you diagnose and improve it? Prioritise and say how you'd verify the impact.",
    rubric: [
      { point: "Measure first (field data, Web Vitals, Performance panel)", keywords: ["web vitals", "field data", "crux", "lighthouse", "performance panel", "measure"] },
      { point: "Optimise the hero image (size, format, priority/preload)", keywords: ["image", "webp", "avif", "preload", "fetchpriority", "srcset"] },
      { point: "Reduce JS: code-splitting, bundle analysis, defer third parties", keywords: ["code split", "bundle", "lazy", "third-party", "defer"] },
      { point: "Server/caching: CDN, SSR/streaming, cache headers", keywords: ["cdn", "cache", "ssr", "server render", "ttfb"] },
      { point: "Verify with before/after metrics or an experiment", keywords: ["before and after", "a/b", "verify", "monitor", "compare"] },
    ],
  },

  /* ---------------- Frontend · Communication ---------------- */
  {
    id: "fe-comm-jr", roleId: FE, competencyId: "fe-comm", levels: ["intern", "junior"], kind: "practical", timeMins: 6, minWords: 50,
    title: "Write the pull request description",
    context: "You fixed the orders-page crash: the API returns no `orders` field for new customers. You added a default empty array, an empty state, and a test.",
    prompt: "Write the PR description your reviewer will read.",
    rubric: [
      { point: "What changed", keywords: ["what changed", "changes", "this pr", "adds", "fixes"] },
      { point: "Why / root cause", keywords: ["because", "root cause", "why", "new customers", "missing"] },
      { point: "How to test", keywords: ["how to test", "steps", "to test", "verify", "qa"] },
      { point: "Risk, screenshots or follow-ups", keywords: ["risk", "screenshot", "follow-up", "follow up", "rollback"] },
    ],
  },
  {
    id: "fe-comm-mid", roleId: FE, competencyId: "fe-comm", levels: ["mid", "senior"], kind: "scenario", timeMins: 6, minWords: 50,
    title: "Push back on an unrealistic deadline",
    context: "A product manager wants bulk order editing shipped in 2 days for a merchant demo. You estimate 6 days for the full feature.",
    prompt: "How do you respond? Write what you'd actually say or send.",
    rubric: [
      { point: "Explain the estimate and the main risks", keywords: ["estimate", "risk", "because", "complex"] },
      { point: "Offer a smaller scope / MVP for the demo", keywords: ["scope", "mvp", "smaller", "phase", "subset", "prototype"] },
      { point: "Give options with trade-offs", keywords: ["option", "trade-off", "tradeoff", "either"] },
      { point: "Agree next steps in writing", keywords: ["follow up", "follow-up", "confirm", "next step", "in writing", "document"] },
    ],
  },

  /* ---------------- Backend · API design ---------------- */
  {
    id: "be-api-jr", roleId: BE, competencyId: "be-api", levels: ["intern", "junior"], kind: "code-review", timeMins: 7,
    title: "Review a money-transfer endpoint",
    context: "This endpoint moves wallet balances between merchants. It's about to go to production.",
    prompt: "What is the most serious problem? Then list what you'd change before approving.",
    code: {
      lang: "js",
      snippet: `app.post("/transfers", async (req, res) => {
  const { from, to, amount } = req.body;
  await db.query("UPDATE accounts SET balance = balance - " + amount + " WHERE id = " + from);
  await db.query("UPDATE accounts SET balance = balance + " + amount + " WHERE id = " + to);
  res.send("ok");
});`,
    },
    options: [
      "It should use PUT instead of POST",
      "It concatenates user input into SQL (injection) and runs two updates without a transaction",
      "res.send should be res.write",
      "async functions can't be used in Express handlers",
    ],
    answer: 1,
    rubric: [
      { point: "Use parameterised queries", keywords: ["parameter", "$1", "placeholder", "prepared"] },
      { point: "Wrap both updates in a transaction", keywords: ["transaction", "begin", "commit", "rollback", "atomic"] },
      { point: "Validate input (positive amount, sufficient balance, auth)", keywords: ["validat", "positive", "balance check", "insufficient", "auth"] },
      { point: "Return proper status codes and JSON", keywords: ["201", "400", "status code", "json"] },
      { point: "Make it idempotent for retries", keywords: ["idempot", "retry", "duplicate"] },
    ],
  },
  {
    id: "be-api-mid", roleId: BE, competencyId: "be-api", levels: ["mid", "senior"], kind: "scenario", timeMins: 8, minWords: 60,
    title: "Design an idempotent payments API",
    context: "Mobile clients on flaky networks retry POST /payments, and some customers were charged twice last month.",
    prompt: "Design the API behaviour so retries are safe. Cover the request contract, storage and responses.",
    rubric: [
      { point: "Client-supplied idempotency key", keywords: ["idempotency key", "idempotency-key", "request id", "unique key"] },
      { point: "Persist key + response with a unique constraint", keywords: ["unique constraint", "unique index", "store the response", "persist"] },
      { point: "Return the original response on replay; conflict if payload differs", keywords: ["same response", "replay", "409", "conflict"] },
      { point: "Handle in-flight duplicates (locking)", keywords: ["lock", "in-flight", "concurrent", "race"] },
      { point: "Key expiry and documentation", keywords: ["expire", "ttl", "24 hours", "document"] },
    ],
  },

  /* ---------------- Backend · Databases ---------------- */
  {
    id: "be-db-jr", roleId: BE, competencyId: "be-db", levels: ["intern", "junior"], kind: "code-write", timeMins: 8,
    title: "Write a reporting query",
    context: "Finance needs each customer's total value of paid orders in 2024, highest first.",
    prompt: "Write the SQL. Tables: customers(id, name), orders(id, customer_id, amount, status, created_at).",
    starter: `-- customers(id, name)
-- orders(id, customer_id, amount, status, created_at)

SELECT
`,
    checks: [
      { label: "Joins orders to customers", pattern: "join\\s+(orders|customers)" },
      { label: "Aggregates with SUM(amount)", pattern: "sum\\s*\\(\\s*\\w*\\.?amount\\s*\\)" },
      { label: "Filters to paid orders", pattern: "status\\s*=\\s*'paid'" },
      { label: "Restricts to 2024", pattern: "2024|extract\\s*\\(\\s*year|date_trunc" },
      { label: "Groups by customer", pattern: "group\\s+by" },
      { label: "Sorts highest first", pattern: "order\\s+by[\\s\\S]*desc" },
    ],
  },
  {
    id: "be-db-mid", roleId: BE, competencyId: "be-db", levels: ["mid", "senior"], kind: "scenario", timeMins: 8, minWords: 60,
    title: "A slow query on 80M rows",
    context: "`SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20` now takes 3s at p95 on an 80M-row table.",
    prompt: "How do you investigate and fix it without downtime?",
    rubric: [
      { point: "EXPLAIN (ANALYZE) to read the plan", keywords: ["explain"] },
      { point: "Composite index on (user_id, created_at DESC)", keywords: ["composite", "(user_id, created_at", "multi-column", "covering index"] },
      { point: "Create the index concurrently", keywords: ["concurrently", "without locking", "online"] },
      { point: "Select only needed columns / keyset pagination", keywords: ["select only", "avoid select *", "keyset", "cursor"] },
      { point: "Longer term: partitioning or archiving", keywords: ["partition", "archiv", "retention"] },
    ],
  },

  /* ---------------- Backend · Testing ---------------- */
  {
    id: "be-test-jr", roleId: BE, competencyId: "be-testing", levels: ["intern", "junior"], kind: "mcq", timeMins: 2,
    title: "Choosing the right test",
    context: "POST /orders validates input, writes to Postgres and publishes an event.",
    prompt: "Which test gives the most confidence that a valid request is stored correctly?",
    options: [
      "A unit test of the validation function only",
      "An integration test that calls the endpoint against a test database and checks the stored row",
      "A snapshot test of the JSON response",
      "Manually testing in production",
    ],
    answer: 1,
  },
  {
    id: "be-test-mid", roleId: BE, competencyId: "be-testing", levels: ["mid", "senior"], kind: "code-write", timeMins: 9,
    title: "Write tests for a pricing rule",
    context: "A bug last quarter let FLAT500 produce negative totals.",
    prompt: "Write tests for applyDiscount covering the happy paths and the edge cases.",
    starter: `// applyDiscount(total: number, code: string): number
// "SAVE10"  -> 10% off
// "FLAT500" -> minus 500, never below 0
// unknown code -> throws
import { applyDiscount } from "./discount";

describe("applyDiscount", () => {

});
`,
    checks: [
      { label: "Tests SAVE10", pattern: "SAVE10" },
      { label: "Tests FLAT500", pattern: "FLAT500" },
      { label: "Covers the never-below-zero boundary", pattern: "toBe\\(\\s*0\\s*\\)|toEqual\\(\\s*0\\s*\\)" },
      { label: "Asserts unknown codes throw", pattern: "toThrow" },
      { label: "Uses at least two separate test cases", pattern: "(it|test)\\([\\s\\S]*(it|test)\\(" },
    ],
  },

  /* ---------------- Backend · Operations ---------------- */
  {
    id: "be-ops-jr", roleId: BE, competencyId: "be-deploy", levels: ["intern", "junior"], kind: "scenario", timeMins: 7, minWords: 50,
    title: "Latency spike after a deploy",
    context: "Right after your release, API p95 latency jumps from 200ms to 4s and checkout errors rise.",
    prompt: "What do you do, in order?",
    rubric: [
      { point: "Check dashboards, logs and traces", keywords: ["dashboard", "logs", "trace", "metrics", "apm"] },
      { point: "Roll back to stop the impact", keywords: ["roll back", "rollback", "revert"] },
      { point: "Find the cause (slow query, N+1, missing index)", keywords: ["n+1", "slow query", "index", "profil", "root cause"] },
      { point: "Communicate status to the team/stakeholders", keywords: ["communicate", "status page", "slack", "team", "stakeholder"] },
      { point: "Prevent recurrence (alert, load test, canary)", keywords: ["alert", "load test", "canary", "prevent"] },
    ],
  },
  {
    id: "be-ops-mid", roleId: BE, competencyId: "be-deploy", levels: ["mid", "senior"], kind: "scenario", timeMins: 8, minWords: 60,
    title: "Zero-downtime column rename",
    context: "You need to rename users.phone to users.phone_number on a busy production table while old and new app versions run side by side.",
    prompt: "Describe the rollout plan step by step, including rollback.",
    rubric: [
      { point: "Expand/contract: add the new column first", keywords: ["expand", "add the new column", "add column", "new column"] },
      { point: "Dual-write and backfill in batches", keywords: ["dual write", "dual-write", "backfill", "batch"] },
      { point: "Switch reads, then remove old column later", keywords: ["switch reads", "read from", "drop the old", "contract", "remove the old"] },
      { point: "Rollback plan at each step", keywords: ["rollback", "roll back", "revert"] },
    ],
  },

  /* ---------------- Backend · Communication ---------------- */
  {
    id: "be-comm-jr", roleId: BE, competencyId: "be-comm", levels: ["intern", "junior"], kind: "practical", timeMins: 6, minWords: 50,
    title: "Incident update for non-technical stakeholders",
    context: "Payments to one bank have failed for 40 minutes. The cause is a provider timeout; a retry fix is being tested.",
    prompt: "Write the update you'd post in the #merchant-support channel.",
    rubric: [
      { point: "Clear impact (who/what is affected, since when)", keywords: ["affected", "impact", "since", "40 minutes", "failing"] },
      { point: "What's being done", keywords: ["working on", "fix", "testing", "investigating"] },
      { point: "When the next update is", keywords: ["next update", "update you", "within", "eta"] },
      { point: "Plain language, apology/empathy", keywords: ["sorry", "apolog", "understand"] },
    ],
  },
  {
    id: "be-comm-mid", roleId: BE, competencyId: "be-comm", levels: ["mid", "senior"], kind: "scenario", timeMins: 6, minWords: 50,
    title: "Outline a design doc",
    context: "You're proposing to move webhook delivery from synchronous calls to a queue.",
    prompt: "Outline the design doc sections and what each would contain.",
    rubric: [
      { point: "Problem, goals and non-goals", keywords: ["problem", "goal", "non-goal"] },
      { point: "Options considered with trade-offs", keywords: ["option", "alternative", "trade-off", "tradeoff"] },
      { point: "Rollout and migration plan", keywords: ["rollout", "migration", "phase"] },
      { point: "Risks, monitoring and success metrics", keywords: ["risk", "metric", "monitor", "success"] },
    ],
  },
];
