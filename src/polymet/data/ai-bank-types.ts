import type { ExpertiseLevel } from "@/polymet/data/pathway-data";

export type QuestionKind = "mcq" | "scenario" | "code-review" | "code-write" | "practical";

export interface RubricPoint {
  /** What a strong answer covers — shown in feedback. */
  point: string;
  /** Any of these (lowercase) phrases counts as covering the point. */
  keywords: string[];
}

export interface CodeCheck {
  label: string;
  /** Regex source, tested case-insensitively against the submitted code. */
  pattern: string;
}

export interface BankQuestion {
  id: string;
  roleId: string;
  competencyId: string;
  levels: ExpertiseLevel[];
  kind: QuestionKind;
  title: string;
  prompt: string;
  /** Production context the AI frames the question with. */
  context?: string;
  code?: { lang: string; snippet: string };
  /** Tabular or document material for practical tasks. */
  material?: { label: string; rows?: string[][]; text?: string };
  options?: string[];
  answer?: number;
  rubric?: RubricPoint[];
  checks?: CodeCheck[];
  starter?: string;
  minWords?: number;
  timeMins: number;
}

export type QuestionResponse = { choice?: number; text?: string; code?: string };
