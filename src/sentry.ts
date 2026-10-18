import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
const configuredSampleRate = Number.parseFloat(
  import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0.1",
);
const tracesSampleRate = Number.isFinite(configuredSampleRate)
  ? Math.min(1, Math.max(0, configuredSampleRate))
  : 0.1;

// Leave Sentry inert until a project DSN is configured for this frontend.
Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  sendDefaultPii: false,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate,
});
