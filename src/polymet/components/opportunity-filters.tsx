import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export interface OpportunityFilterState {
  types: string[];
  arrangements: string[];
  levels: string[];
  sources: string[];
  countries: string[];
  industries: string[];
  pay: string[];
  minMonthlyNgn: number;
}

export const emptyFilters: OpportunityFilterState = {
  types: [], arrangements: [], levels: [], sources: [], countries: [], industries: [], pay: [], minMonthlyNgn: 0,
};

const groups: { key: keyof Omit<OpportunityFilterState, "minMonthlyNgn">; label: string; options: { value: string; label: string }[] }[] = [
  { key: "types", label: "Opportunity type", options: [{ value: "internship", label: "Internship" }, { value: "job", label: "Job" }, { value: "graduate", label: "Graduate role" }, { value: "freelance", label: "Freelance" }] },
  { key: "pay", label: "Internship pay", options: [{ value: "paid", label: "Paid" }, { value: "unpaid", label: "Unpaid" }] },
  { key: "arrangements", label: "Work arrangement", options: [{ value: "remote", label: "Remote" }, { value: "hybrid", label: "Hybrid" }, { value: "onsite", label: "Onsite" }] },
  { key: "levels", label: "Experience level", options: ["Entry", "Junior", "Graduate", "Mid"].map((v) => ({ value: v, label: v })) },
  { key: "sources", label: "Source", options: [{ value: "internflare", label: "Internflare" }, { value: "external", label: "Approved external" }] },
  { key: "countries", label: "Country", options: ["Nigeria", "Ghana", "Kenya", "Pan-Africa"].map((v) => ({ value: v, label: v })) },
  { key: "industries", label: "Industry", options: ["Fintech", "Design & Media", "Agritech", "Healthtech", "E-commerce", "Non-profit"].map((v) => ({ value: v, label: v })) },
];

interface OpportunityFiltersProps {
  value: OpportunityFilterState;
  onChange: (v: OpportunityFilterState) => void;
}

export function OpportunityFilters({ value, onChange }: OpportunityFiltersProps) {
  const toggle = (key: keyof Omit<OpportunityFilterState, "minMonthlyNgn">, v: string) => {
    const set = value[key];
    onChange({ ...value, [key]: set.includes(v) ? set.filter((x) => x !== v) : [...set, v] });
  };

  return (
    <div className="space-y-5">
      {groups.map((g, i) => (
        <fieldset key={g.key}>
          {i > 0 && <Separator className="mb-5" />}
          <legend className="mb-2.5 text-sm font-semibold">{g.label}</legend>
          <div className="space-y-2">
            {g.options.map((o) => {
              const id = `f-${g.key}-${o.value}`;
              return (
                <div key={o.value} className="flex items-center gap-2">
                  <Checkbox id={id} checked={value[g.key].includes(o.value)} onCheckedChange={() => toggle(g.key, o.value)} />
                  <Label htmlFor={id} className="text-sm font-normal">{o.label}</Label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
      <Separator />
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Minimum monthly pay (NGN)</legend>
        <Slider value={[value.minMonthlyNgn]} max={800000} step={50000} onValueChange={([v]) => onChange({ ...value, minMonthlyNgn: v })} aria-label="Minimum monthly pay" />
        <p className="mt-2 text-xs text-muted-foreground">
          {value.minMonthlyNgn === 0 ? "Any amount" : `₦${value.minMonthlyNgn.toLocaleString()}+ per month`} · NGN listings only
        </p>
      </fieldset>
    </div>
  );
}
