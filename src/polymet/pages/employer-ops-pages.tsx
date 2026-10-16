import { useState } from "react";
import { Link } from "react-router-dom";
import { LockIcon, UserSearchIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/polymet/components/page-states";
import { BillingPanel } from "@/polymet/components/billing-panel";
import { billingHistory, employerInterviews, employerOrg, planUsage, testTasks } from "@/polymet/data/employer-data";

const offers = [
  { id: "of1", candidate: "Amara Okafor", role: "Product Design Intern (partner programme)", amount: "$400/month", sent: "13 May", status: "Awaiting response", expires: "24 May" },
  { id: "of2", candidate: "Tunde Bakare", role: "Merchant Support Associate", amount: "₦300,000/month", sent: "02 Apr", status: "Accepted · SquadCot access pending", expires: "—" },
];

export function EmployerHiringPage() {
  const [outcomes, setOutcomes] = useState<Record<string, string>>({});
  const [taskStatus, setTaskStatus] = useState<Record<string, string>>({});
  return (
    <div>
      <PageHeader title="Interviews & offers" description="Interviews and paid test tasks are independent steps — use either, both or neither." />
      <Tabs defaultValue="interviews">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="interviews">Interviews ({employerInterviews.length})</TabsTrigger>
          <TabsTrigger value="tasks">Paid test tasks ({testTasks.length})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="interviews" className="mt-4">
          <div className="overflow-hidden rounded-xl border bg-card"><div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Role</TableHead><TableHead>When</TableHead><TableHead>Format</TableHead><TableHead>Status</TableHead><TableHead>Outcome</TableHead></TableRow></TableHeader>
              <TableBody>
                {employerInterviews.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.candidate}</TableCell>
                    <TableCell className="text-sm">{i.role}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{i.date} · {i.time}</TableCell>
                    <TableCell className="text-sm">{i.format}<p className="text-xs text-muted-foreground">{i.interviewer}</p></TableCell>
                    <TableCell className="text-sm">{i.status}</TableCell>
                    <TableCell>
                      <Select value={outcomes[i.id] ?? ""} onValueChange={(v) => { setOutcomes({ ...outcomes, [i.id]: v }); toast(`Outcome recorded: ${v}`); }}>
                        <SelectTrigger className="h-8 w-40" aria-label={`Outcome for ${i.candidate}`}><SelectValue placeholder="Record outcome" /></SelectTrigger>
                        <SelectContent>{["Advance", "Hold", "Do not advance", "No-show"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div></div>
        </TabsContent>
        <TabsContent value="tasks" className="mt-4 space-y-3">
          {testTasks.map((t) => {
            const steps = ["Invited", "Accepted", "Submitted", "Under review", "Revisions", "Approved", "Paid"];
            const current = taskStatus[t.id] ?? "Accepted";
            const idx = steps.indexOf(current);
            return (
              <div key={t.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><p className="font-semibold">{t.title}</p><p className="text-sm text-muted-foreground">{t.candidate} · {t.role} · due {t.deadline}</p></div>
                  <span className="rounded-md border bg-muted px-2 py-0.5 text-sm font-semibold">{t.payment}</span>
                </div>
                <ol className="mt-4 flex flex-wrap gap-1.5">
                  {steps.map((s, i) => <li key={s} className={cn("rounded-md border px-2 py-0.5 text-xs", i < idx ? "border-success/25 bg-success-soft text-success" : i === idx ? "border-primary bg-accent font-semibold text-brown" : "text-muted-foreground")}>{s}</li>)}
                </ol>
                <p className="mt-3 text-sm"><span className="text-muted-foreground">Payment:</span> {t.paymentStatus}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="bg-card" disabled={current !== "Accepted"} onClick={() => setTaskStatus({ ...taskStatus, [t.id]: "Under review" })}>Mark submission received</Button>
                  <Button size="sm" variant="outline" className="bg-card" disabled={current !== "Under review"} onClick={() => setTaskStatus({ ...taskStatus, [t.id]: "Revisions" })}>Request revision</Button>
                  <Button size="sm" disabled={!["Under review", "Revisions"].includes(current)} onClick={() => { setTaskStatus({ ...taskStatus, [t.id]: "Approved" }); toast("Submission approved", { description: "Payment release requested — pending provider confirmation." }); }}>Approve & release payment</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast("Dispute opened — Internflare support will review")}>Open dispute</Button>
                </div>
              </div>
            );
          })}
        </TabsContent>
        <TabsContent value="offers" className="mt-4">
          <div className="overflow-hidden rounded-xl border bg-card"><Table>
            <TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Role</TableHead><TableHead>Compensation</TableHead><TableHead>Sent</TableHead><TableHead>Status</TableHead><TableHead>Expires</TableHead></TableRow></TableHeader>
            <TableBody>{offers.map((o) => <TableRow key={o.id}><TableCell className="font-medium">{o.candidate}</TableCell><TableCell className="text-sm">{o.role}</TableCell><TableCell className="tabular-nums">{o.amount}</TableCell><TableCell>{o.sent}</TableCell><TableCell className="text-sm">{o.status}</TableCell><TableCell>{o.expires}</TableCell></TableRow>)}</TableBody>
          </Table></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function EmployerBillingPage() {
  return (
    <div>
      <PageHeader title="Plan & billing" description="Premium features activate only after verified payment confirmation from the payment provider." />
      <BillingPanel audience="employer" currentPlanId="starter" currentPlanName={employerOrg.plan} price={10000} renewal={employerOrg.renewal} usage={planUsage} invoices={billingHistory} showFailedNotice={false} />
    </div>
  );
}

export function TalentSearchLockedPage() {
  return (
    <div>
      <PageHeader title="Talent discovery" description="Search verified talent profiles and public portfolios." />
      <div className="relative overflow-hidden rounded-2xl border bg-card">
        <div aria-hidden="true" className="pointer-events-none select-none p-6 opacity-40 blur-[2px]">
          {[1, 2, 3].map((i) => <div key={i} className="mb-3 flex items-center gap-3 rounded-lg border p-4"><div className="h-10 w-10 rounded-full bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 w-40 rounded bg-muted" /><div className="h-3 w-64 rounded bg-muted" /></div></div>)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-card/60 p-6">
          <div className="max-w-sm text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary"><LockIcon className="h-5 w-5" /></span>
            <p className="mt-4 text-lg font-semibold">Available on the Growth plan</p>
            <p className="mt-1 text-sm text-muted-foreground">Your Starter plan includes applicants to your own listings. Proactive talent search requires Growth (entitlements pending configuration).</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button asChild><Link to="/employer/billing">Compare plans</Link></Button>
              <Button asChild variant="outline" className="bg-card"><Link to="/employer/candidates"><UserSearchIcon /> Review applicants</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
