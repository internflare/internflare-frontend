import { API_URLS, apiRequest } from "@/service/api";

export interface CreateOpportunityInput {
  company_id: string;
  source_type: "employer";
  title: string;
  description: string;
  responsibilities: string;
  opportunity_type: string;
  employment_type: string;
  experience_level: string;
  is_paid: boolean;
  compensation_min: number | null;
  compensation_max: number | null;
  currency: string | null;
  payment_frequency: string | null;
  country: string | null;
  location: string | null;
  work_arrangement: string;
  skills_required: string[];
  duration_weeks: number | null;
  start_date: string | null;
  application_deadline: string | null;
  openings: number | null;
  status: "draft" | "published";
  external_apply_url: string | null;
}

interface CreateOpportunityResponse {
  opportunity: {
    id: string;
    title: string;
    status: string;
  };
}

export interface CompanyOpportunity {
  id: string;
  title: string;
  description: string;
  opportunity_type: string;
  work_arrangement: string;
  location: string | null;
  status: "draft" | "published" | "paused" | "closed";
  is_paid: boolean;
  compensation_min: string | null;
  compensation_max: string | null;
  currency: string | null;
  payment_frequency: string | null;
  application_deadline: string | null;
  views_count: number;
  created_at: string;
}

interface CompanyOpportunityListResponse {
  data: CompanyOpportunity[];
  total: number;
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface OpportunityDetail extends CompanyOpportunity {
  external_apply_url: string | null;
  company_id: string | null;
  external_company_name: string | null;
  responsibilities: string | null;
  employment_type: string | null;
  experience_level: string | null;
  country: string | null;
  skills_required: string[] | null;
  duration_weeks: number | null;
  start_date: string | null;
  openings: number | null;
  updated_at: string | null;
}

const jobService = {
  // Company id travels in the query (browsers cannot send a GET body); the backend verifies session and admin membership.
  listCompanyOpportunities: (companyId: string, page = 1) =>
    apiRequest<CompanyOpportunityListResponse>(
      `${API_URLS.jobListings}?scope=company&company_id=${encodeURIComponent(companyId)}&page=${page}&page_size=100`,
    ),

  // Draft/paused/closed listings are only returned to active admins of the owning company.
  getOpportunity: (id: string) =>
    apiRequest<{ opportunity: OpportunityDetail }>(
      `${API_URLS.jobListings}/${encodeURIComponent(id)}`,
    ),

  // Pause/resume uses a partial PATCH; the backend re-verifies company-admin access.
  setOpportunityStatus: (id: string, status: "published" | "paused") =>
    apiRequest<CreateOpportunityResponse>(
      `${API_URLS.jobListings}/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
    ),

  // Update an existing listing; company ownership is fixed server-side so it is not sent.
  updateOpportunity: (
    id: string,
    input: Omit<CreateOpportunityInput, "company_id" | "source_type">,
  ) =>
    apiRequest<CreateOpportunityResponse>(
      `${API_URLS.jobListings}/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    ),

  // Soft-fail safe: the backend re-checks session and company-admin membership before deleting.
  deleteOpportunity: (id: string) =>
    apiRequest<void>(`${API_URLS.jobListings}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  createOpportunity: (input: CreateOpportunityInput) =>
    apiRequest<CreateOpportunityResponse>(API_URLS.jobListings, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
};

export default jobService;
