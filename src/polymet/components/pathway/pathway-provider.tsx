import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { demoCandidates, getRole, type CandidateProfile, type CompetencyResult, type StatedGoal, type ExpertiseLevel, type AiAssessmentReport } from "@/polymet/data/pathway-data";
import { modulesFor, overallScore, projectedAssessment } from "@/polymet/lib/pathway-engine";

const TODAY = "12 May 2025";

interface PathwayContextValue {
  candidate: CandidateProfile;
  candidates: CandidateProfile[];
  switchCandidate: (id: string) => void;
  setTargetRole: (roleId: string) => void;
  setStatedGoal: (goal: StatedGoal) => void;
  recordAssessment: (roleId: string, scores: Record<string, CompetencyResult>, meta?: { level: ExpertiseLevel; report: AiAssessmentReport }) => void;
  toggleModule: (roleId: string, moduleId: string) => void;
  submitEvidence: (roleId: string, moduleId: string, url: string, note: string) => void;
  reassess: (roleId: string) => { before: number; after: number } | null;
  apply: (oppId: string) => void;
  resetDemo: () => void;
}

const PathwayContext = createContext<PathwayContextValue | null>(null);

const clone = (list: CandidateProfile[]) => JSON.parse(JSON.stringify(list)) as CandidateProfile[];

function PathwayStore({ children, initialCandidateId = "amara" }: { children: React.ReactNode; initialCandidateId?: string }) {
  const [list, setList] = useState<CandidateProfile[]>(() => clone(demoCandidates));
  const [activeId, setActiveId] = useState(initialCandidateId);
  const candidate = list.find((c) => c.id === activeId) ?? list[0];

  const update = useCallback(
    (fn: (c: CandidateProfile) => CandidateProfile) => setList((prev) => prev.map((c) => (c.id === activeId ? fn(c) : c))),
    [activeId],
  );

  const reassess = useCallback(
    (roleId: string) => {
      const projected = projectedAssessment(candidate, roleId);
      const role = getRole(roleId);
      const before = overallScore(candidate.assessments[roleId], role);
      if (!projected || before === null) return null;
      const after = overallScore(projected, role) ?? before;
      update((c) => {
        const lp = c.learning[roleId] ?? { completed: [], evidence: {} };
        const counted = modulesFor(roleId)
          .filter((m) => lp.completed.includes(m.id) && (!m.evidenceRequired || lp.evidence[m.id]))
          .map((m) => m.id);
        return {
          ...c,
          assessments: {
            ...c.assessments,
            [roleId]: { ...projected, assessedOn: TODAY, attempts: projected.attempts + 1, history: [...projected.history, { date: TODAY, overall: after, kind: "Reassessment" }] },
          },
          learning: { ...c.learning, [roleId]: { ...lp, appliedBoosts: Array.from(new Set([...(lp.appliedBoosts ?? []), ...counted])) } },
        };
      });
      return { before, after };
    },
    [candidate, update],
  );

  const value = useMemo<PathwayContextValue>(
    () => ({
      candidate,
      candidates: list,
      switchCandidate: setActiveId,
      setTargetRole: (roleId) => update((c) => ({ ...c, targetRoleId: roleId })),
      setStatedGoal: (goal) => update((c) => ({ ...c, statedGoal: goal })),
      recordAssessment: (roleId, scores, meta) =>
        update((c) => {
          const prev = c.assessments[roleId];
          const overall = overallScore({ roleId, scores, assessedOn: TODAY, attempts: 1, history: [] }, getRole(roleId)) ?? 0;
          return {
            ...c,
            targetRoleId: c.targetRoleId ?? roleId,
            assessments: {
              ...c.assessments,
              [roleId]: {
                roleId,
                scores,
                assessedOn: TODAY,
                attempts: (prev?.attempts ?? 0) + 1,
                level: meta?.level ?? prev?.level,
                report: meta?.report,
                history: [...(prev?.history ?? []), { date: TODAY, overall, kind: prev ? "Reassessment" : "Assessment" }],
              },
            },
          };
        }),
      toggleModule: (roleId, moduleId) =>
        update((c) => {
          const lp = c.learning[roleId] ?? { completed: [], evidence: {} };
          const completed = lp.completed.includes(moduleId) ? lp.completed.filter((m) => m !== moduleId) : [...lp.completed, moduleId];
          return { ...c, learning: { ...c.learning, [roleId]: { ...lp, completed } } };
        }),
      submitEvidence: (roleId, moduleId, url, note) =>
        update((c) => {
          const lp = c.learning[roleId] ?? { completed: [], evidence: {} };
          const completed = lp.completed.includes(moduleId) ? lp.completed : [...lp.completed, moduleId];
          return { ...c, learning: { ...c.learning, [roleId]: { ...lp, completed, evidence: { ...lp.evidence, [moduleId]: { url, note } } } } };
        }),
      reassess,
      apply: (oppId) => update((c) => ({ ...c, applied: c.applied.includes(oppId) ? c.applied : [...c.applied, oppId] })),
      resetDemo: () => setList(clone(demoCandidates)),
    }),
    [candidate, list, update, reassess],
  );

  return <PathwayContext.Provider value={value}>{children}</PathwayContext.Provider>;
}

/** Nest-safe: inner providers pass through when an outer store exists. */
export function PathwayProvider({ children, initialCandidateId }: { children: React.ReactNode; initialCandidateId?: string }) {
  const existing = useContext(PathwayContext);
  if (existing) return <>{children}</>;
  return <PathwayStore initialCandidateId={initialCandidateId}>{children}</PathwayStore>;
}

export function usePathway() {
  const ctx = useContext(PathwayContext);
  if (!ctx) throw new Error("usePathway must be used inside <PathwayProvider>");
  return ctx;
}
