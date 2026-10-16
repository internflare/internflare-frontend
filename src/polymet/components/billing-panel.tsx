import { useReducer } from "react";
import { AlertTriangleIcon, CreditCardIcon, DownloadIcon, Loader2Icon, LockIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PricingPlans } from "@/polymet/components/pricing-plans";
import { formatNaira, type Plan } from "@/polymet/data/pricing-data";

export interface BillingInvoice { id: string; date: string; plan: string; amount: string; status: string; method: string }
export interface UsageItem { label: string; used: number; limit: number; note?: string }

interface BillingPanelProps {
  audience: "talent" | "employer";
  currentPlanId: string;
  currentPlanName: string;
  price: number;
  renewal: string;
  usage: UsageItem[];
  invoices: BillingInvoice[];
  showFailedNotice?: boolean;
}

interface BillingPanelState {
  checkout: Plan | null;
  method: string;
  pending: Plan | null;
  failed: boolean;
  cancelled: boolean;
  retrying: boolean;
}

type BillingPanelAction =
  | { type: "set-checkout"; checkout: Plan | null }
  | { type: "set-method"; method: string }
  | { type: "set-pending"; pending: Plan | null }
  | { type: "set-failed"; failed: boolean }
  | { type: "set-cancelled"; cancelled: boolean }
  | { type: "set-retrying"; retrying: boolean };

function billingPanelReducer(
  state: BillingPanelState,
  action: BillingPanelAction,
): BillingPanelState {
  switch (action.type) {
    case "set-checkout":
      return { ...state, checkout: action.checkout };
    case "set-method":
      return { ...state, method: action.method };
    case "set-pending":
      return { ...state, pending: action.pending };
    case "set-failed":
      return { ...state, failed: action.failed };
    case "set-cancelled":
      return { ...state, cancelled: action.cancelled };
    case "set-retrying":
      return { ...state, retrying: action.retrying };
  }
}

export function BillingPanel({ audience, currentPlanId, currentPlanName, price, renewal, usage, invoices, showFailedNotice }: BillingPanelProps) {
  const [{ checkout, method, pending, failed, cancelled, retrying }, dispatch] =
    useReducer(billingPanelReducer, {
      checkout: null,
      method: "card",
      pending: null,
      failed: !!showFailedNotice,
      cancelled: false,
      retrying: false,
    });

  const pay = () => {
    if (!checkout) return;
    dispatch({ type: "set-pending", pending: checkout });
    dispatch({ type: "set-checkout", checkout: null });
    toast("Redirect to payment provider (demo)", { description: "Your plan will change only after the provider confirms payment." });
  };

  return (
    <div className="space-y-6">
      {failed && (
        <div role="alert" className="flex flex-wrap items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold">Last renewal attempt failed</p>
            <p className="text-sm text-muted-foreground">We couldn't charge Card •••• 4242. We'll retry automatically within 3 days. Your records are safe; paid limits pause if all retries fail.</p>
          </div>
          <Button size="sm" variant="outline" className="bg-card" disabled={retrying} onClick={() => { dispatch({ type: "set-retrying", retrying: true }); setTimeout(() => { dispatch({ type: "set-retrying", retrying: false }); dispatch({ type: "set-failed", failed: false }); toast("Retry submitted — awaiting provider confirmation"); }, 900); }}>
            {retrying ? <Loader2Icon className="animate-spin" /> : <RefreshCwIcon />} Retry payment
          </Button>
        </div>
      )}
      {pending && (
        <div className="flex flex-wrap items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4">
          <Loader2Icon className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-warning" />
          <div className="flex-1">
            <p className="font-semibold">Upgrade to {pending.name} pending verification</p>
            <p className="text-sm text-muted-foreground">We're waiting for the payment provider to confirm. {pending.name} features stay inactive until then — you're still on {currentPlanName}.</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => dispatch({ type: "set-pending", pending: null })}>Cancel request</Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-2xl font-bold">{currentPlanName} <span className="text-base font-medium text-muted-foreground">{formatNaira(price)}/month</span></p>
          <p className="mt-1 text-sm text-muted-foreground">{cancelled ? `Cancelled — access until ${renewal}, then Free` : `Renews ${renewal} · Card •••• 4242`}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="bg-card" onClick={() => toast("Payment method update opens provider (demo)")}><CreditCardIcon /> Update payment method</Button>
            {!cancelled && price > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Cancel plan</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel {currentPlanName}?</AlertDialogTitle>
                    <AlertDialogDescription>You'll keep {currentPlanName} features until {renewal}. After that you'll move to Free and its limits apply. Existing records are kept.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Keep plan</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => dispatch({ type: "set-cancelled", cancelled: true })}>Cancel plan</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="font-semibold">Usage this period</p>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {usage.map((u) => {
              const pct = Math.round((u.used / u.limit) * 100);
              return (
                <li key={u.label}>
                  <div className="flex justify-between text-sm"><span>{u.label}</span><span className={cn("tabular-nums", pct >= 90 ? "font-semibold text-destructive" : pct >= 75 ? "font-semibold text-warning" : "text-muted-foreground")}>{u.used}/{u.limit}</span></div>
                  <Progress value={pct} className={cn("mt-1.5 h-1.5", pct >= 90 && "[&>div]:bg-destructive")} aria-label={`${u.label} ${pct}%`} />
                  {u.note && <p className="mt-1 text-xs text-muted-foreground">{u.note}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="mb-1 text-lg font-semibold">Change plan</h2>
        <p className="mb-2 text-sm text-muted-foreground">Upgrades take effect after verified payment. Downgrades take effect at the next renewal.</p>
        <PricingPlans defaultAudience={audience} currentPlanId={currentPlanId} compact onSelect={(p) => (p.price === 0 ? toast("Downgrade scheduled for next renewal") : dispatch({ type: "set-checkout", checkout: p }))} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-3"><p className="font-semibold">Billing history</p></div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Method</TableHead><TableHead className="sr-only">Receipt</TableHead></TableRow></TableHeader>
            <TableBody>
              {invoices.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.id.toUpperCase()}</TableCell>
                  <TableCell>{i.date}</TableCell>
                  <TableCell>{i.plan}</TableCell>
                  <TableCell className="tabular-nums">{i.amount}</TableCell>
                  <TableCell><span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", i.status === "Paid" ? "border-success/25 bg-success-soft text-success" : "border-destructive/20 bg-destructive/10 text-destructive")}>{i.status}</span></TableCell>
                  <TableCell className="text-muted-foreground">{i.method}</TableCell>
                  <TableCell>{i.status === "Paid" && <Button size="sm" variant="ghost" onClick={() => toast(`Downloading receipt ${i.id}`)} aria-label={`Download receipt ${i.id}`}><DownloadIcon /></Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!checkout} onOpenChange={(o) => !o && dispatch({ type: "set-checkout", checkout: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {checkout?.name}</DialogTitle>
            <DialogDescription>{formatNaira(checkout?.price ?? 0)} per month, billed today and on the same date each month. Payment is processed by the configured payment provider.</DialogDescription>
          </DialogHeader>
          <RadioGroup value={method} onValueChange={(value) => dispatch({ type: "set-method", method: value })} className="gap-2">
            {[["card", "Debit or credit card"], ["transfer", "Bank transfer"], ["ussd", "USSD"]].map(([v, l]) => (
              <Label key={v} htmlFor={`pm-${v}`} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                <RadioGroupItem id={`pm-${v}`} value={v} /> {l}
              </Label>
            ))}
          </RadioGroup>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><LockIcon className="h-3.5 w-3.5" /> You'll be redirected to the provider to complete payment securely. Features activate only after verified confirmation.</p>
          <DialogFooter><Button onClick={pay}>Continue to payment</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
