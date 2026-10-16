import { useState } from "react";
import { ArrowUpRightIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ExternalApplyDialogProps {
  provider: string;
  url: string;
  company: string;
  title: string;
  trigger?: React.ReactNode;
}

export function ExternalApplyDialog({ provider, url, company, title, trigger }: ExternalApplyDialogProps) {
  const [track, setTrack] = useState(true);
  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  })();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-full">
            Apply on {provider}
            <ArrowUpRightIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You're leaving Internflare</DialogTitle>
          <DialogDescription>
            {title} at {company} is an approved external listing. Your application will be submitted on {provider}, not on Internflare.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Destination</p>
            <p className="mt-1 flex items-center gap-1.5 break-all text-sm font-medium">
              <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
              {host}
            </p>
          </div>
          <div className="flex gap-2 rounded-lg border border-ai/30 bg-ai-soft p-3 text-sm text-foreground">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-ai-strong" />
            <p>Internflare can't see or update the status of applications made on other sites. You can track this opportunity manually.</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="track-ext" checked={track} onCheckedChange={(v) => setTrack(v === true)} />
            <Label htmlFor="track-ext" className="text-sm font-normal">
              Add to my tracked opportunities (uses 1 tracking slot)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Continue to {provider}
              <ArrowUpRightIcon />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
