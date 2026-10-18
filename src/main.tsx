import "./sentry";
import { StrictMode } from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

// Catch render-time React errors and report them through the initialized SDK.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <main className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The error has been reported. Please reload the page to try again.
          </p>
          <button
            type="button"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </main>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
