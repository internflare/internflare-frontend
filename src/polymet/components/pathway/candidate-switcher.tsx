import { useNavigate } from "react-router-dom";
import { FlaskConicalIcon, RotateCcwIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathway } from "@/polymet/components/pathway/pathway-provider";

/** Prototype-only control for demonstrating pathway scenarios. */
export function CandidateSwitcher() {
  const { candidate, candidates, switchCandidate, resetDemo } = usePathway();
  const navigate = useNavigate();
  return (
    <div className="m-3 rounded-xl border border-dashed bg-muted/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <FlaskConicalIcon className="h-3.5 w-3.5" /> Demo candidate
        </p>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetDemo} aria-label="Reset demo data">
          <RotateCcwIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Select
        value={candidate.id}
        onValueChange={(v) => {
          switchCandidate(v);
          navigate(v === "new" ? "/onboarding" : "/app");
        }}
      >
        <SelectTrigger className="mt-2 h-auto bg-card py-2 text-left" aria-label="Switch demo candidate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {candidates.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <span className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {c.avatar && <AvatarImage src={c.avatar} alt="" />}
                  <AvatarFallback className="text-[10px]">{c.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{c.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{c.scenario}</span>
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
