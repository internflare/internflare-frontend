import { Link } from "react-router-dom";
import { BadgeCheckIcon, EyeOffIcon, ShieldCheckIcon, ScaleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PricingPlans } from "@/polymet/components/pricing-plans";
import { faqs } from "@/polymet/data/pricing-data";

const trust = [
  { Icon: BadgeCheckIcon, title: "Company verification", text: "Registration and domain checks. Status is shown on every listing and profile." },
  { Icon: ShieldCheckIcon, title: "Separate verification types", text: "Identity, qualifications, employment and work evidence are verified independently." },
  { Icon: EyeOffIcon, title: "You control visibility", text: "Choose what's public. Private workspace data never appears on public profiles." },
  { Icon: ScaleIcon, title: "Human decisions", text: "AI scores are explainable guidance. Employers make hiring decisions." },
];

export function HomeTrust() {
  return (
    <section id="trust" className="scroll-mt-20 border-y bg-[#1d1d1d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Trust, verification & privacy</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Built so both sides can rely on what they see</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePricingFaq() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Start free. Upgrade when you need more.</h2>
        </div>
        <div className="mt-8">
          <PricingPlans compact />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link to="/pricing" className="font-semibold text-brown hover:text-primary dark:text-primary">Compare all plan entitlements →</Link>
        </p>
      </section>
      <section id="faq" className="scroll-mt-20 border-t bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Common questions</h2>
          </div>
          <Accordion type="single" collapsible className="rounded-xl border bg-card px-5">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="last:border-0">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-accent/60 px-6 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brown dark:text-foreground">Ready to build your career?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Create a profile in minutes, or register your company and publish your first listing for free.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/sign-up">Get started as talent</Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-card"><Link to="/sign-up?type=employer">I'm hiring</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
