import { getOpportunity, opportunities, type Opportunity } from "@/polymet/data/opportunities-data";
import {
  careerRoles,
  getRole,
  opportunityRequirements,
  pathwayModules,
  type CandidateProfile,
  type CareerRole,
  type OpportunityRequirement,
  type PathwayLevel,
  type RoleAssessment,
} from "@/polymet/data/pathway-data";

export const levelOf = (o: Opportunity): PathwayLevel => opportunityRequirements[o.id]?.level ?? (o.type === "internship" ? "internship" : "job");
export const isInternship = (o: Opportunity) => levelOf(o) === "internship";

export function overallScore(a: RoleAssessment | undefined, role: CareerRole | undefined) {
  if (!a || !role) return null;
  const vals = role.competencies.map((c) => a.scores[c.id]?.score ?? 0);
  return Math.round(vals.reduce((n, v) => n + v, 0) / vals.length);
}

export interface Gap {
  label: string;
  detail: string;
}

export function checkRequirement(a: RoleAssessment, role: CareerRole, threshold: number, mins: { competencyId: string; min: number }[]) {
  const overall = overallScore(a, role) ?? 0;
  const unmet: Gap[] = [];
  const met: string[] = [];
  if (overall >= threshold) met.push(`Overall ${role.title} readiness ${overall} meets the required ${threshold}`);
  else unmet.push({ label: `Overall readiness ${overall} / ${threshold} required`, detail: `${threshold - overall} more points needed across ${role.title} competencies.` });
  mins.forEach((m) => {
    const comp = role.competencies.find((c) => c.id === m.competencyId);
    const score = a.scores[m.competencyId]?.score ?? 0;
    if (!comp) return;
    if (score >= m.min) met.push(`${comp.label}: ${score} (minimum ${m.min})`);
    else unmet.push({ label: `${comp.label}: ${score} / ${m.min} required`, detail: comp.description });
  });
  return { overall, met, unmet, ok: unmet.length === 0 };
}

export type RoleStatus = "not-assessed" | "learning" | "internship" | "job";

export interface RoleReadiness {
  role: CareerRole;
  status: RoleStatus;
  overall: number | null;
  assessment?: RoleAssessment;
  internship: { ok: boolean; met: string[]; unmet: Gap[]; threshold: number };
  job: { ok: boolean; met: string[]; unmet: Gap[]; threshold: number };
  strengths: string[];
}

export function roleReadiness(c: CandidateProfile, roleId: string): RoleReadiness | null {
  const role = getRole(roleId);
  if (!role) return null;
  const a = c.assessments[roleId];
  const empty = { ok: false, met: [], unmet: [] };
  if (!a) {
    return { role, status: "not-assessed", overall: null, internship: { ...empty, threshold: role.thresholds.internship }, job: { ...empty, threshold: role.thresholds.job }, strengths: [] };
  }
  const i = checkRequirement(a, role, role.thresholds.internship, role.coreMins.internship);
  const j = checkRequirement(a, role, role.thresholds.job, role.coreMins.job);
  const strengths = role.competencies
    .filter((comp) => (a.scores[comp.id]?.score ?? 0) >= 70)
    .map((comp) => `${comp.label} (${a.scores[comp.id].score}, ${a.scores[comp.id].evidence})`);
  return {
    role,
    status: j.ok ? "job" : i.ok ? "internship" : "learning",
    overall: overallScore(a, role),
    assessment: a,
    internship: { ...i, threshold: role.thresholds.internship },
    job: { ...j, threshold: role.thresholds.job },
    strengths,
  };
}

export interface Recommendation {
  label: string;
  to: string;
}

export interface Eligibility {
  state: "eligible" | "not-assessed" | "not-eligible" | "closed" | "unconfigured";
  requirement?: OpportunityRequirement;
  role?: CareerRole;
  overall: number | null;
  met: string[];
  unmet: Gap[];
  primary: Recommendation;
  secondary?: Recommendation;
  headline: string;
}

export function eligibilityFor(c: CandidateProfile, oppId: string): Eligibility {
  const o = getOpportunity(oppId);
  const req = opportunityRequirements[oppId];
  if (!o || !req) return { state: "unconfigured", overall: null, met: [], unmet: [], primary: { label: "Browse learning", to: "/app/learn" }, headline: "Requirements pending product configuration" };
  const role = getRole(req.roleId)!;
  if (o.status !== "open") return { state: "closed", requirement: req, role, overall: null, met: [], unmet: [], primary: { label: req.level === "internship" ? "See open internships" : "See open jobs", to: req.level === "internship" ? "/app/internships" : "/app/jobs" }, headline: `This ${req.level} is ${o.status}` };
  const a = c.assessments[req.roleId];
  if (!a) {
    return {
      state: "not-assessed",
      requirement: req,
      role,
      overall: null,
      met: [],
      unmet: [{ label: `${role.title} assessment not completed`, detail: "Completing your profile alone does not unlock applications. Take the role assessment to check eligibility." }],
      primary: { label: `Take ${role.title} assessment`, to: `/app/assessments/${role.id}/take?from=${oppId}` },
      secondary: { label: "Explore learning", to: `/app/learn?role=${role.id}` },
      headline: "Assessment required before applying",
    };
  }
  const r = checkRequirement(a, role, req.threshold, req.competencyMins);
  if (r.ok) {
    return { state: "eligible", requirement: req, role, overall: r.overall, met: r.met, unmet: [], primary: { label: "Apply", to: "" }, headline: req.level === "internship" ? "Ready to apply for this internship" : "Your current skills match this job" };
  }
  // Not eligible → route sideways or down
  const rr = roleReadiness(c, req.roleId)!;
  const isJob = req.level === "job";
  const fallback: Recommendation =
    isJob && rr.internship.ok
      ? { label: "See internships you qualify for", to: `/app/internships?role=${role.id}&eligible=1` }
      : { label: "See your recommended learning plan", to: `/app/learning?role=${role.id}` };
  return {
    state: "not-eligible",
    requirement: req,
    role,
    overall: r.overall,
    met: r.met,
    unmet: r.unmet,
    primary: fallback,
    secondary: isJob && rr.internship.ok ? { label: "Job-readiness development plan", to: `/app/learning?role=${role.id}` } : { label: "Request reassessment after new evidence", to: `/app/learning?role=${role.id}#reassess` },
    headline: isJob ? "More practical experience is needed for this job" : "Not eligible for this internship yet",
  };
}

export function matchFactors(c: CandidateProfile, oppId: string) {
  const req = opportunityRequirements[oppId];
  const a = req && c.assessments[req.roleId];
  const role = req && getRole(req.roleId);
  if (!req || !a || !role) return null;
  const mins = Object.fromEntries(req.competencyMins.map((m) => [m.competencyId, m.min]));
  const factors = role.competencies.map((comp) => {
    const r = a.scores[comp.id];
    return {
      label: comp.label,
      score: r?.score ?? 0,
      note: `${r?.evidence ?? "no evidence"}${mins[comp.id] ? ` · employer minimum ${mins[comp.id]}` : ""}`,
    };
  });
  const score = overallScore(a, role) ?? 0;
  const top = [...factors].sort((x, y) => y.score - x.score)[0];
  const low = [...factors].sort((x, y) => x.score - y.score)[0];
  return {
    score,
    summary: `Strongest: ${top.label} (${top.score}). Weakest: ${low.label} (${low.score}). Based on your ${role.title} assessment from ${a.assessedOn}.`,
    factors,
  };
}

export function openByLevel(level: PathwayLevel) {
  return opportunities.filter((o) => o.status === "open" && levelOf(o) === level);
}

export function recommendedFor(c: CandidateProfile, level: PathwayLevel) {
  return openByLevel(level)
    .map((o) => ({ o, e: eligibilityFor(c, o.id) }))
    .filter((x) => x.e.state === "eligible")
    .sort((a, b) => (b.e.overall ?? 0) - (a.e.overall ?? 0));
}

export function modulesFor(roleId: string) {
  return pathwayModules.filter((m) => m.roleId === roleId);
}

/** Projected competency scores if submitted evidence for completed modules is accepted. */
export function projectedAssessment(c: CandidateProfile, roleId: string): RoleAssessment | null {
  const a = c.assessments[roleId];
  if (!a) return null;
  const lp = c.learning[roleId];
  const scores = { ...a.scores };
  modulesFor(roleId).forEach((m) => {
    if (!lp?.completed.includes(m.id)) return;
    if (m.evidenceRequired && !lp.evidence[m.id]) return;
    if (lp.appliedBoosts?.includes(m.id)) return;
    Object.entries(m.boosts).forEach(([k, v]) => {
      const cur = scores[k]?.score ?? 0;
      scores[k] = { score: Math.min(95, cur + v), evidence: "assessed" };
    });
  });
  return { ...a, scores };
}

export interface NextAction {
  title: string;
  detail: string;
  cta: Recommendation;
  tone: "primary" | "ai" | "success" | "warning";
}

export function nextActions(c: CandidateProfile): NextAction[] {
  if (!c.targetRoleId) {
    return [
      { title: "Choose a career goal", detail: "Pick the role you're aiming for so we can assess the right skills.", cta: { label: "Set career goal", to: "/onboarding" }, tone: "primary" },
      { title: "Explore learning freely", detail: "Browse courses and practical projects any time — no assessment needed.", cta: { label: "Explore Learn", to: "/app/learn" }, tone: "ai" },
    ];
  }
  const rr = roleReadiness(c, c.targetRoleId);
  if (!rr) return [];
  const role = rr.role;
  if (rr.status === "not-assessed") {
    return [
      { title: `Take the ${role.title} assessment`, detail: "About 15 minutes. Results explain what you did well and what to improve.", cta: { label: "Start assessment", to: `/app/assessments/${role.id}/take` }, tone: "primary" },
      { title: "Explore learning while you decide", detail: "Learning is open to everyone, regardless of readiness.", cta: { label: "Explore Learn", to: `/app/learn?role=${role.id}` }, tone: "ai" },
    ];
  }
  const out: NextAction[] = [];
  if (rr.status === "job") {
    out.push({ title: "Your current skills match these jobs", detail: `You meet the ${role.title} job-readiness threshold (${rr.job.threshold}). No internship required first.`, cta: { label: "View matching jobs", to: `/app/jobs?role=${role.id}&eligible=1` }, tone: "success" });
    if (c.priorPathway) out.push({ title: "Your evidence is above your previous pathway", detail: `${c.priorPathway}. We're recommending job-level roles based on your newer evidence.`, cta: { label: "See assessment details", to: `/app/assessments?role=${role.id}` }, tone: "ai" });
  } else if (rr.status === "internship") {
    out.push({ title: "You may qualify for these internships", detail: `You meet the ${role.title} internship threshold (${rr.internship.threshold}).`, cta: { label: "View internships", to: `/app/internships?role=${role.id}&eligible=1` }, tone: "success" });
    out.push({ title: "Build toward job readiness", detail: rr.job.unmet.map((g) => g.label).join(" · "), cta: { label: "Job-readiness plan", to: `/app/learning?role=${role.id}` }, tone: "ai" });
  } else {
    out.push({ title: "Complete these learning activities", detail: `Then submit evidence and request reassessment. Still needed: ${rr.internship.unmet.map((g) => g.label).join(" · ")}`, cta: { label: "Start recommended learning", to: `/app/learning?role=${role.id}` }, tone: "warning" });
    out.push({ title: "Optional: get a mentor", detail: "A mentor can review your practical work and keep you accountable.", cta: { label: "Find a mentor", to: "/app/mentors" }, tone: "ai" });
  }
  const lp = c.learning[role.id];
  const pendingEvidence = modulesFor(role.id).filter((m) => lp?.completed.includes(m.id) && m.evidenceRequired && !lp.evidence[m.id]);
  if (pendingEvidence.length) out.push({ title: "Submit practical evidence", detail: `${pendingEvidence.length} completed module(s) still need evidence before reassessment.`, cta: { label: "Submit evidence", to: `/app/learning?role=${role.id}` }, tone: "warning" });
  return out;
}

export { careerRoles };

/* ---------------- Employer talent pool ---------------- */

export interface PoolStatus {
  role: CareerRole;
  overall: number;
  threshold: number;
  inPool: boolean;
  placement: "job" | "internship" | "learning";
  met: string[];
  unmet: Gap[];
}

/** A talent enters the internflareJobs pool only when their assessed evidence meets the role's job-readiness rules. */
export function poolStatus(a: RoleAssessment): PoolStatus | null {
  const role = getRole(a.roleId);
  if (!role) return null;
  const job = checkRequirement(a, role, role.thresholds.job, role.coreMins.job);
  const intern = checkRequirement(a, role, role.thresholds.internship, role.coreMins.internship);
  return {
    role,
    overall: job.overall,
    threshold: role.thresholds.job,
    inPool: job.ok,
    placement: job.ok ? "job" : intern.ok ? "internship" : "learning",
    met: job.met,
    unmet: job.unmet,
  };
}

/** Fit against one employer listing's own threshold and competency minimums. */
export function listingFit(a: RoleAssessment, listingId: string) {
  const req = opportunityRequirements[listingId];
  const role = getRole(a.roleId);
  if (!req || !role || req.roleId !== a.roleId) return null;
  return { req, ...checkRequirement(a, role, req.threshold, req.competencyMins) };
}
