import { API_URLS, apiRequest, CurrentSession } from "@/service/api";

const authService = {
  // The browser sends the Better Auth session cookie through apiRequest's credentials: "include".
  getSession: () => apiRequest<CurrentSession>(API_URLS.currentSession),

  // send post request of talent onboarding data to backend
  postTalentOnboardingData: (data: Record<string, unknown>) =>
    apiRequest(`${API_URLS.betterAuth}/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  // Create the employer's company through profile-service using the session cookie.
  postEmployerOnboardingData: (data: Record<string, unknown>) =>
    apiRequest(API_URLS.employerOnboarding, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  //
};

export default authService;
