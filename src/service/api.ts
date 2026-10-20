const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const apiVersion = "/api/v1";

const apiPaths = {
  auth: {
    betterAuth: "/api/auth",
    currentSession: `${apiVersion}/me`,
    health: `${apiVersion}/health`,
  },
  company: {
    employerOnboarding: `${apiVersion}/auth/employer-onboarding`,
  },
  user: {
    employerDashboard: `${apiVersion}/user/employer/dashboard`,
    talentDashboard: `${apiVersion}/user/talent/dashboard`,
  },
} as const;

const API_URLS = {
  base: apiBaseUrl,
  betterAuth: `${apiBaseUrl}${apiPaths.auth.betterAuth}`,
  currentSession: `${apiBaseUrl}${apiPaths.auth.currentSession}`,
  authHealth: `${apiBaseUrl}${apiPaths.auth.health}`,
  employerOnboarding: `${apiBaseUrl}${apiPaths.company.employerOnboarding}`,
  employerDashboard: `${apiBaseUrl}${apiPaths.user.employerDashboard}`,
  talentDashboard: `${apiBaseUrl}${apiPaths.user.talentDashboard}`,
} as const;

interface CurrentSession {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly responseBody: string;

  constructor(message: string, status: number, responseBody: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

// Use this helper for JSON API calls so session cookies and error status are handled consistently.
async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const response = await fetch(url, {
    ...options,
    credentials: options.credentials ?? "include",
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new ApiRequestError(
      `API request failed with status ${response.status}`,
      response.status,
      responseBody,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return (await response.json()) as T;
}

export { API_URLS, apiRequest, CurrentSession };
