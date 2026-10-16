import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader } from "@/polymet/components/page-states";
import { BillingPanel } from "@/polymet/components/billing-panel";
import { ThemeSegmented } from "@/polymet/components/theme-toggle";
import { currentTalent } from "@/polymet/data/talent-data";

export function SettingsPage() {
  const [twoFa, setTwoFa] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  return (
    <div>
      <Toaster />
      <PageHeader title="Settings" description="Manage your account, security, data and subscription." />
      <Tabs defaultValue="account">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Plan & billing</TabsTrigger>
          <TabsTrigger value="data">Data & consent</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-5">
          <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="st-email">Email</Label><Input id="st-email" defaultValue={currentTalent.email} /></div>
              <div className="space-y-1.5"><Label htmlFor="st-phone">Phone</Label><Input id="st-phone" defaultValue="+234 801 234 5678" /></div>
              <div className="space-y-1.5"><Label htmlFor="st-tz">Time zone</Label>
                <Select defaultValue="wat"><SelectTrigger id="st-tz"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="wat">West Africa Time (UTC+1)</SelectItem><SelectItem value="gmt">GMT (UTC+0)</SelectItem><SelectItem value="eat">East Africa Time (UTC+3)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="st-cur">Display currency</Label>
                <Select defaultValue="ngn"><SelectTrigger id="st-cur"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="ngn">NGN (₦)</SelectItem><SelectItem value="usd">USD ($)</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Listings always show compensation in the employer's original currency.</p>
            <div className="space-y-2 border-t pt-4">
              <div>
                <p className="text-sm font-medium">Appearance</p>
                <p className="text-xs text-muted-foreground">Applies instantly on this device. System follows your OS setting.</p>
              </div>
              <ThemeSegmented />
            </div>
            <div className="flex justify-end"><Button onClick={() => toast("Account updated")}>Save</Button></div>
          </div>
        </TabsContent>
        <TabsContent value="security" className="mt-5">
          <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="st-pw">Current password</Label><Input id="st-pw" type="password" /></div>
              <div className="space-y-1.5"><Label htmlFor="st-npw">New password</Label><Input id="st-npw" type="password" /></div>
            </div>
            <Button variant="outline" className="bg-card" onClick={() => toast("Password updated")}>Update password</Button>
            <div className="flex items-start justify-between gap-4 border-t pt-4">
              <div><Label htmlFor="st-2fa">Two-step verification</Label><p className="text-xs text-muted-foreground">Require a code from your authenticator app at sign-in</p></div>
              <Switch id="st-2fa" checked={twoFa} onCheckedChange={setTwoFa} />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-sm text-muted-foreground">Chrome on macOS · Lagos · now</p>
              <Button variant="link" className="px-0" onClick={() => toast("Signed out of other sessions")}>Sign out of all other sessions</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="billing" className="mt-5">
          <BillingPanel
            audience="talent"
            currentPlanId="career"
            currentPlanName="Career"
            price={5000}
            renewal="14 Jun 2025"
            usage={[{ label: "Internship applications", used: 4, limit: 6, note: "Career limit (configurable)" }, { label: "Job applications", used: 2, limit: 4 }, { label: "Tracking slots", used: 3, limit: 5 }, { label: "AI tool runs", used: 18, limit: 40 }]}
            invoices={[{ id: "inv-t-019", date: "14 May 2025", plan: "Career", amount: "₦5,000", status: "Paid", method: "Card •••• 1881" }, { id: "inv-t-012", date: "14 Apr 2025", plan: "Career", amount: "₦5,000", status: "Paid", method: "Card •••• 1881" }]}
          />
        </TabsContent>
        <TabsContent value="data" className="mt-5">
          <div className="max-w-2xl space-y-4">
            <div className="space-y-4 rounded-xl border bg-card p-6">
              {[["Use my profile for AI matching", "Compare your profile with listings to show match factors", true], ["Allow AI drafting with my profile", "Career tools may read your profile to draft content", true], ["Share anonymised data for research", "Helps improve readiness benchmarks", false]].map(([l, d, v]) => (
                <div key={l as string} className="flex items-start justify-between gap-4">
                  <div><Label htmlFor={`c-${l}`}>{l as string}</Label><p className="text-xs text-muted-foreground">{d as string}</p></div>
                  <Switch id={`c-${l}`} defaultChecked={v as boolean} />
                </div>
              ))}
            </div>
            <div className="rounded-xl border bg-card p-6">
              <p className="font-semibold">Export your data</p>
              <p className="text-sm text-muted-foreground">Download your profile, applications and portfolio as a ZIP.</p>
              <Button variant="outline" className="mt-3 bg-card" onClick={() => toast("Export requested — we'll email you a link")}>Request export</Button>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-card p-6">
              <p className="font-semibold text-destructive">Delete account</p>
              <p className="text-sm text-muted-foreground">Permanently removes your profile and portfolio. Records needed for active engagements or payments are retained as required by law.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline" className="mt-3 border-destructive/40 bg-card text-destructive hover:bg-destructive/10 hover:text-destructive">Delete account</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Delete your account?</AlertDialogTitle><AlertDialogDescription>Type DELETE to confirm. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                  <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} aria-label="Type DELETE to confirm" />
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction disabled={confirmText !== "DELETE"} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast("Deletion request received (demo)")}>Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
