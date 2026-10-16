import { AlertTriangleIcon, ArrowUpCircleIcon, CheckIcon, MinusIcon, RefreshCwIcon, XCircleIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PricingPlans } from "@/polymet/components/pricing-plans";

const employerRows = [
  { label: "Active listings", values: ["2", "Configurable", "Configurable", "Configurable"] },
  { label: "Applicant views", values: ["20", "Configurable", "Configurable", "Configurable"] },
  { label: "Interview requests", values: ["5", "Configurable", "Configurable", "Configurable"] },
  { label: "Tracking slots", values: ["5", "Configurable", "Configurable", "Configurable"] },
  { label: "SquadCot workspace", values: ["1 intern", "Configurable", "Configurable", "Configurable"] },
  { label: "Employees you can add", values: ["1", "Configurable", "Configurable", "Configurable"] },
];
const talentRows = [
  { label: "Internship applications", values: ["Up to 3", "Configurable", "Configurable", "Configurable"] },
  { label: "Job applications", values: ["1", "Configurable", "Configurable", "Configurable"] },
  { label: "Job tracking slots", values: ["2", "Configurable", "Configurable", "Configurable"] },
  { label: "Public portfolio", values: ["yes", "yes", "yes", "yes"] },
];

const policies = [
  { Icon: ArrowUpCircleIcon, title: "Upgrades", text: "New limits apply only after payment is confirmed by the payment provider. Pending payments keep your current plan active." },
  { Icon: RefreshCwIcon, title: "Renewals", text: "Plans renew monthly. You'll get a reminder before each renewal and a receipt afterwards." },
  { Icon: XCircleIcon, title: "Cancellation", text: "Cancel any time. Paid features remain until the end of the current billing period, then you move to Free." },
  { Icon: AlertTriangleIcon, title: "Failed payments", text: "If a payment fails we retry and notify you. Your records are preserved; paid limits pause until payment succeeds." },
];

function CompareTable({ title, plans, rows }: { title: string; plans: string[]; rows: { label: string; values: string[] }[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b px-5 py-3"><h3 className="font-semibold">{title}</h3></div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[38%]">Entitlement</TableHead>
              {plans.map((p) => <TableHead key={p}>{p}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.label}>
                <TableCell className="font-medium">{r.label}</TableCell>
                {r.values.map((v, i) => (
                  <TableCell key={`${r.label}-${plans[i]}`} className={v === "Configurable" ? "text-muted-foreground" : ""}>
                    {v === "yes" ? <CheckIcon className="h-4 w-4 text-success" aria-label="Included" /> : v === "no" ? <MinusIcon className="h-4 w-4" aria-label="Not included" /> : v}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Plans for talent and employers</h1>
        <p className="mt-3 text-muted-foreground">Prices in Nigerian Naira, billed monthly. Limits marked “configurable” are pending final product configuration and will be confirmed before purchase.</p>
      </div>
      <div className="mt-10"><PricingPlans /></div>
      <div className="mt-16 grid gap-6">
        <CompareTable title="Talent plan comparison" plans={["Free", "Career ₦5,000", "Pro ₦15,000", "Elite ₦30,000"]} rows={talentRows} />
        <CompareTable title="Employer plan comparison" plans={["Free", "Starter ₦10,000", "Growth ₦30,000", "Professional ₦100,000"]} rows={employerRows} />
      </div>
      <section className="mt-16">
        <h2 className="text-xl font-semibold">Billing, renewals and cancellations</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {policies.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
