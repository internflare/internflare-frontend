/**
 * Simulated AI assessment engine.
 * In production this would call an LLM to generate questions and grade answers
 * against the same rubrics; here generation and grading run locally and
 * deterministically so every score stays explainable.
 */
import { engineeringBank } from "@/polymet/data/ai-bank-engineering";
import { businessBank } from "@/polymet/data/ai-bank-business";
import type { BankQuestion, QuestionResponse } from "@/polymet/data/ai-bank-types";
import {
  expertiseLevels,
  getLevel,
  getRole,
  type AiAssessmentReport,
  type AiQuestionResult,
  type CompetencyResult,
  type ExpertiseLevel,
} from "@/polymet/data/pathway-data";

const bank: BankQuestion[] = [...engineeringBank, ...businessBank];

export interface GeneratedAssessment {
  roleId: string;
  level: ExpertiseLevel;
  questions: BankQuestion[];
  totalMins: number;
  seed: number;
}

export const kindLabel: Record<BankQuestion["kind"], string> = {
  mcq: "Knowledge check",
  scenario: "Interview scenario",
  "code-review": "Code review",
  "code-write": "Coding task",
  practical: "Practical task",
};

export function hasBank(roleId: string) {
  return bank.some((q) => q.roleId === roleId);
}

/** "AI" assembles one question per competency, tuned to the chosen level. */
export function generateAssessment(roleId: string, level: ExpertiseLevel, seed = Date.now()): GeneratedAssessment {
  const role = getRole(roleId);
  const questions: BankQuestion[] = [];
  role?.competencies.forEach((c, i) => {
    const pool = bank.filter((q) => q.roleId === roleId && q.competencyId === c.id);
    const atLevel = pool.filter((q) => q.levels.includes(level));
    const candidates = atLevel.length ? atLevel : pool;
    if (candidates.length) questions.push(candidates[(seed + i) % candidates.length]);
  });
  // Put coding work in the middle: warm-up first, written communication last.
  const order: BankQuestion["kind"][] = ["mcq", "code-review", "code-write", "scenario", "practical"];
  questions.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  return { roleId, level, questions, totalMins: questions.reduce((n, q) => n + q.timeMins, 0), seed };
}

const words = (t = "") => t.trim().split(/\s+/).filter(Boolean).length;
const norm = (t = "") => t.toLowerCase().replace(/\s+/g, " ");

function gradeRubric(q: BankQuestion, text = "") {
  const t = norm(text);
  const covered: string[] = [];
  const missed: string[] = [];
  (q.rubric ?? []).forEach((r) => (r.keywords.some((k) => t.includes(k)) ? covered : missed).push(r.point));
  const total = Math.max(1, (q.rubric ?? []).length);
  let raw = Math.round((covered.length / total) * 100);
  if (q.minWords && words(text) < q.minWords && raw > 0) {
    raw = Math.min(raw, 50);
    missed.push(`Answer is brief for this level — aim for ${q.minWords}+ words with specifics`);
  }
  return { raw, covered, missed };
}

export function gradeResponse(q: BankQuestion, r: QuestionResponse = {}): AiQuestionResult {
  const base = { questionId: q.id, competencyId: q.competencyId, kind: kindLabel[q.kind], title: q.title };

  if (q.kind === "mcq") {
    const ok = r.choice === q.answer;
    return { ...base, raw: ok ? 100 : 0, covered: ok ? ["Chose the correct approach"] : [], missed: ok ? [] : [`Correct approach: ${q.options?.[q.answer ?? 0]}`], summary: ok ? "Correct." : r.choice === undefined ? "Not answered." : "Incorrect — see the recommended approach." };
  }

  if (q.kind === "code-review") {
    const ok = r.choice === q.answer;
    const rub = gradeRubric({ ...q, minWords: undefined }, r.text);
    const raw = Math.round((ok ? 60 : 0) + rub.raw * 0.4);
    return {
      ...base,
      raw,
      covered: [...(ok ? ["Identified the core defect"] : []), ...rub.covered],
      missed: [...(ok ? [] : [`Core defect: ${q.options?.[q.answer ?? 0]}`]), ...rub.missed],
      summary: ok ? (rub.raw >= 60 ? "Spotted the bug and proposed a production-quality fix." : "Spotted the bug; the fix explanation missed key review points.") : "Missed the core defect in the snippet.",
    };
  }

  if (q.kind === "code-write") {
    const code = r.code ?? "";
    const untouched = !code.trim() || code.trim() === (q.starter ?? "").trim();
    const covered: string[] = [];
    const missed: string[] = [];
    (q.checks ?? []).forEach((c) => {
      let pass = false;
      try { pass = !untouched && new RegExp(c.pattern, "im").test(code); } catch { pass = false; }
      (pass ? covered : missed).push(c.label);
    });
    const raw = untouched ? 0 : Math.round((covered.length / Math.max(1, (q.checks ?? []).length)) * 100);
    return { ...base, raw, covered, missed, summary: untouched ? "No code submitted." : raw >= 80 ? "Solution meets the requirements." : raw >= 50 ? "Partially working — some requirements missing." : "Solution misses most requirements." };
  }

  const g = gradeRubric(q, r.text);
  return { ...base, ...g, summary: !r.text?.trim() ? "Not answered." : g.raw >= 80 ? "Strong, production-minded answer." : g.raw >= 50 ? `Covers ${g.covered.length} of ${(q.rubric ?? []).length} key points.` : "Misses most of what an interviewer would look for." };
}

export interface EvidenceInput { link?: string; note?: string }

export function buildReport(gen: GeneratedAssessment, responses: Record<string, QuestionResponse>, evidence: Record<string, EvidenceInput>, durationMins: number) {
  const role = getRole(gen.roleId)!;
  const lvl = getLevel(gen.level);
  const results = gen.questions.map((q) => gradeResponse(q, responses[q.id]));
  const scores: Record<string, CompetencyResult> = {};
  role.competencies.forEach((c) => {
    const rs = results.filter((r) => r.competencyId === c.id);
    const raw = rs.length ? rs.reduce((n, r) => n + r.raw, 0) / rs.length : 0;
    const ev = evidence[c.id];
    const bonus = ev?.link?.trim() ? 10 : ev?.note?.trim() ? 4 : 0;
    scores[c.id] = { score: Math.min(lvl.ceiling, Math.round((raw / 100) * lvl.ceiling) + bonus), evidence: "assessed" };
  });
  const rawAverage = Math.round(results.reduce((n, r) => n + r.raw, 0) / Math.max(1, results.length));
  const idx = expertiseLevels.findIndex((l) => l.id === gen.level);
  const drop = rawAverage >= 70 ? 0 : rawAverage >= 45 ? 1 : 2;
  const demoIdx = idx - drop;
  const demonstratedLevel = demoIdx >= 0 ? expertiseLevels[demoIdx].id : "below-intern";
  const demoLabel = demoIdx >= 0 ? expertiseLevels[demoIdx].label : "foundation";
  const summary =
    drop === 0
      ? `You demonstrated ${lvl.label.toLowerCase()} ${role.title.toLowerCase()} skills on production-style questions.${rawAverage >= 88 && idx < 3 ? ` Consider trying ${expertiseLevels[idx + 1].label} next time.` : ""}`
      : `You attempted ${lvl.label}, but your answers are closer to ${demoLabel} level. Your result is scored against the ${lvl.label} rubric — the gaps below show exactly what to work on.`;
  const report: AiAssessmentReport = { level: gen.level, rawAverage, demonstratedLevel, summary, results, durationMins };
  return { scores, report };
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
