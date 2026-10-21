import { API_URLS, apiRequest, CurrentSession } from "@/service/api";

export interface EmployerDashboardMetrics {
  total_opportunities: number;
  published_opportunities: number;
  draft_opportunities: number;
  total_views: number;
  last_3_opportunities: Array<{
    id: string;
    title: string;
    status: string;
    views: number;
    created_at: string;
  }>;
}

interface EmployerDashboardResponse {
  metrics: EmployerDashboardMetrics;
}

interface AdminCompaniesResponse {
  companies: Array<{ id: string; name: string; country: string | null }>;
}

const profileService = {
  // The browser sends the Better Auth session cookie through apiRequest's credentials: "include".
  getEmployerDashboardData: async (): Promise<EmployerDashboardMetrics> => {
    const response = await apiRequest<EmployerDashboardResponse>(
      API_URLS.employerDashboard,
    );
    if (!response) {
      throw new Error("Employer dashboard metrics response was empty");
    }
    return response.metrics;
  },

  getMyAdminCompanies: () =>
    apiRequest<AdminCompaniesResponse>(API_URLS.myAdminCompanies),

  getTalentDashboardData: () =>
    apiRequest<CurrentSession>(API_URLS.talentDashboard),

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

export default profileService;
