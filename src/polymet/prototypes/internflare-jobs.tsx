import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MarketingLayout } from "@/polymet/layouts/marketing-layout";
import { AuthLayout } from "@/polymet/layouts/auth-layout";
import { TalentLayout } from "@/polymet/layouts/talent-layout";
import { FocusLayout } from "@/polymet/layouts/focus-layout";
import { HomePage } from "@/polymet/pages/home-page";
import { InternshipsPage, JobsPage } from "@/polymet/pages/opportunity-board-page";
import { LearnExplorePage } from "@/polymet/pages/learn-explore-page";
import { AssessmentsPage } from "@/polymet/pages/assessments-page";
import { AssessmentTakePage } from "@/polymet/pages/assessment-take-page";
import { WorkspacePage } from "@/polymet/pages/workspace-page";
import { PathwayProvider } from "@/polymet/components/pathway/pathway-provider";
import { OpportunityDetailPage } from "@/polymet/pages/opportunity-detail-page";
import { CompanyProfilePage } from "@/polymet/pages/company-profile-page";
import { TalentPortfolioPage } from "@/polymet/pages/talent-portfolio-page";
import { PricingPage } from "@/polymet/pages/pricing-page";
import { SignInPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from "@/polymet/pages/auth-pages";
import { TalentOnboardingPage } from "@/polymet/pages/talent-onboarding-page";
import { TalentDashboardPage } from "@/polymet/pages/talent-dashboard-page";
import { ApplicationsPage } from "@/polymet/pages/applications-page";
import { SavedPage } from "@/polymet/pages/saved-page";
import { NotificationsPage } from "@/polymet/pages/notifications-page";
import { InterviewsPage } from "@/polymet/pages/interviews-page";
import { OffersPage } from "@/polymet/pages/offers-page";
import { LearningPage } from "@/polymet/pages/learning-page";
import { CareerToolsPage } from "@/polymet/pages/career-tools-page";
import { CareerToolPage } from "@/polymet/pages/career-tool-page";
import { ProfilePage } from "@/polymet/pages/profile-page";
import { PortfolioBuilderPage } from "@/polymet/pages/portfolio-builder-page";
import { SettingsPage } from "@/polymet/pages/settings-page";
import { LeadsPlanPage, LeadsPipelinePage, LeadsProspectsPage, LeadsCalendarPage } from "@/polymet/pages/leads-pages";
import { ProspectDetailPage, LeadsOutreachPage, LeadsAnalyticsPage, LeadsSettingsPage, LeadsSetupPage } from "@/polymet/pages/leads-workspace-pages";
import { MentorDirectoryPage, MentorProfilePage, MentorSessionsPage } from "@/polymet/pages/mentors-pages";
import { EmployerLayout } from "@/polymet/layouts/employer-layout";
import { EmployerDashboardPage } from "@/polymet/pages/employer-dashboard-page";
import { EmployerListingsPage, EmployerListingDetailPage } from "@/polymet/pages/employer-listings-pages";
import { ListingEditorPage } from "@/polymet/pages/listing-editor-page";
import { CandidatesInboxPage, CandidateDetailPage } from "@/polymet/pages/employer-candidates-pages";
import { EmployerHiringPage, EmployerBillingPage } from "@/polymet/pages/employer-ops-pages";
import { EmployerTalentPoolPage } from "@/polymet/pages/employer-talent-pool-page";
import { EmployerOnboardingPage } from "@/polymet/pages/employer-onboarding-page";
import { NotFoundPage, PermissionDeniedPage } from "@/polymet/pages/system-pages";
import { AppThemeProvider } from "@/polymet/components/theme-toggle";

export default function InternflareJobsPrototype() {
  return (
    <AppThemeProvider>
    <PathwayProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MarketingLayout><HomePage /></MarketingLayout>} />
        <Route path="/opportunities" element={<Navigate to="/internships" replace />} />
        <Route path="/internships" element={<MarketingLayout><InternshipsPage publicView /></MarketingLayout>} />
        <Route path="/jobs" element={<MarketingLayout><JobsPage publicView /></MarketingLayout>} />
        <Route path="/learn" element={<MarketingLayout><LearnExplorePage publicView /></MarketingLayout>} />
        <Route path="/opportunities/:id" element={<MarketingLayout><OpportunityDetailPage /></MarketingLayout>} />
        <Route path="/companies/:id" element={<MarketingLayout><CompanyProfilePage /></MarketingLayout>} />
        <Route path="/talent/:id" element={<MarketingLayout><TalentPortfolioPage /></MarketingLayout>} />
        <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />

        <Route path="/sign-in" element={<AuthLayout><SignInPage /></AuthLayout>} />
        <Route path="/sign-up" element={<AuthLayout><SignUpPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />
        <Route path="/verify-email" element={<AuthLayout><VerifyEmailPage /></AuthLayout>} />

        <Route path="/onboarding" element={<FocusLayout><TalentOnboardingPage /></FocusLayout>} />
        <Route path="/app" element={<TalentLayout><TalentDashboardPage /></TalentLayout>} />
        <Route path="/app/opportunities" element={<Navigate to="/app/internships" replace />} />
        <Route path="/app/learn" element={<TalentLayout><LearnExplorePage /></TalentLayout>} />
        <Route path="/app/internships" element={<TalentLayout><InternshipsPage /></TalentLayout>} />
        <Route path="/app/jobs" element={<TalentLayout><JobsPage /></TalentLayout>} />
        <Route path="/app/assessments" element={<TalentLayout><AssessmentsPage /></TalentLayout>} />
        <Route path="/app/assessments/:roleId/take" element={<TalentLayout><AssessmentTakePage /></TalentLayout>} />
        <Route path="/app/workspace" element={<TalentLayout><WorkspacePage /></TalentLayout>} />
        <Route path="/app/applications" element={<TalentLayout><ApplicationsPage /></TalentLayout>} />
        <Route path="/app/saved" element={<TalentLayout><SavedPage /></TalentLayout>} />
        <Route path="/app/notifications" element={<TalentLayout><NotificationsPage /></TalentLayout>} />
        <Route path="/app/interviews" element={<TalentLayout><InterviewsPage /></TalentLayout>} />
        <Route path="/app/offers" element={<TalentLayout><OffersPage /></TalentLayout>} />
        <Route path="/app/readiness" element={<Navigate to="/app/assessments" replace />} />
        <Route path="/app/learning" element={<TalentLayout><LearningPage /></TalentLayout>} />
        <Route path="/app/tools" element={<TalentLayout><CareerToolsPage /></TalentLayout>} />
        <Route path="/app/tools/:toolId" element={<TalentLayout><CareerToolPage /></TalentLayout>} />
        <Route path="/app/profile" element={<TalentLayout><ProfilePage /></TalentLayout>} />
        <Route path="/app/portfolio" element={<TalentLayout><PortfolioBuilderPage /></TalentLayout>} />
        <Route path="/app/settings" element={<TalentLayout><SettingsPage /></TalentLayout>} />
        <Route path="/app/leads" element={<TalentLayout><LeadsPlanPage /></TalentLayout>} />
        <Route path="/app/leads/setup" element={<FocusLayout><LeadsSetupPage /></FocusLayout>} />
        <Route path="/app/leads/pipeline" element={<TalentLayout><LeadsPipelinePage /></TalentLayout>} />
        <Route path="/app/leads/prospects" element={<TalentLayout><LeadsProspectsPage /></TalentLayout>} />
        <Route path="/app/leads/prospects/:id" element={<TalentLayout><ProspectDetailPage /></TalentLayout>} />
        <Route path="/app/leads/calendar" element={<TalentLayout><LeadsCalendarPage /></TalentLayout>} />
        <Route path="/app/leads/outreach" element={<TalentLayout><LeadsOutreachPage /></TalentLayout>} />
        <Route path="/app/leads/analytics" element={<TalentLayout><LeadsAnalyticsPage /></TalentLayout>} />
        <Route path="/app/leads/settings" element={<TalentLayout><LeadsSettingsPage /></TalentLayout>} />
        <Route path="/app/mentors" element={<TalentLayout><MentorDirectoryPage /></TalentLayout>} />
        <Route path="/app/mentors/sessions" element={<TalentLayout><MentorSessionsPage /></TalentLayout>} />
        <Route path="/app/mentors/:id" element={<TalentLayout><MentorProfilePage /></TalentLayout>} />

        <Route path="/employer/onboarding" element={<FocusLayout><EmployerOnboardingPage /></FocusLayout>} />
        <Route path="/employer" element={<EmployerLayout><EmployerDashboardPage /></EmployerLayout>} />
        <Route path="/employer/listings" element={<EmployerLayout><EmployerListingsPage /></EmployerLayout>} />
        <Route path="/employer/listings/new" element={<EmployerLayout><ListingEditorPage /></EmployerLayout>} />
        <Route path="/employer/listings/:id" element={<EmployerLayout><EmployerListingDetailPage /></EmployerLayout>} />
        <Route path="/employer/listings/:id/edit" element={<EmployerLayout><ListingEditorPage /></EmployerLayout>} />
        <Route path="/employer/candidates" element={<EmployerLayout><CandidatesInboxPage /></EmployerLayout>} />
        <Route path="/employer/candidates/:id" element={<EmployerLayout><CandidateDetailPage /></EmployerLayout>} />
        <Route path="/employer/hiring" element={<EmployerLayout><EmployerHiringPage /></EmployerLayout>} />
        <Route path="/employer/billing" element={<EmployerLayout><EmployerBillingPage /></EmployerLayout>} />
        <Route path="/employer/talent-pool" element={<EmployerLayout><EmployerTalentPoolPage /></EmployerLayout>} />
        <Route path="/employer/talent-search" element={<Navigate to="/employer/talent-pool" replace />} />

        <Route path="/no-access" element={<MarketingLayout><PermissionDeniedPage /></MarketingLayout>} />
        <Route path="*" element={<MarketingLayout><NotFoundPage /></MarketingLayout>} />
      </Routes>
    </Router>
    </PathwayProvider>
    </AppThemeProvider>
  );
}
