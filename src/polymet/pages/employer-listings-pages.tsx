import { useEffect, useMemo, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  ChevronLeftIcon,
  EyeIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, StateBlock } from "@/polymet/components/page-states";
import { StatTile, WidgetCard } from "@/polymet/components/widget-card";
import type { ListingStatus } from "@/polymet/data/employer-data";
import profileService from "@/service/user.service";
import { ApiRequestError } from "@/service/api";
import jobService, {
  type CompanyOpportunity,
  type OpportunityDetail,
} from "@/service/job.service";

const statusCls: Record<ListingStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  published: "bg-success-soft text-success border-success/25",
  paused: "bg-warning-soft text-warning border-warning/25",
  closed: "bg-destructive/10 text-destructive border-destructive/20",
};
export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        statusCls[status],
      )}
    >
      {status}
    </span>
  );
}

type ListingsTab = "all" | ListingStatus;

interface CompanyChoice {
  id: string;
  name: string;
}

interface ListingRow {
  id: string;
  title: string;
  type: string;
  arrangement: string;
  location: string;
  status: ListingStatus;
  views: number;
  posted: string;
  deadline: string;
  compensation: string;
}

function formatListingDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Convert API values to the labels and formats this employer-facing table presents.
function toListingRow(opportunity: CompanyOpportunity): ListingRow {
  const minimum =
    opportunity.compensation_min === null
      ? null
      : Number(opportunity.compensation_min);
  const maximum =
    opportunity.compensation_max === null
      ? null
      : Number(opportunity.compensation_max);
  const currency = opportunity.currency;
  const formatAmount = (amount: number) =>
    currency && /^[A-Z]{3}$/.test(currency)
      ? new Intl.NumberFormat("en", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(amount)
      : new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(
          amount,
        );
  const compensation = !opportunity.is_paid
    ? "Unpaid"
    : minimum === null && maximum === null
      ? "Compensation not specified"
      : `${minimum === null ? "" : formatAmount(minimum)}${minimum !== null && maximum !== null ? "–" : ""}${maximum === null ? "" : formatAmount(maximum)}${opportunity.payment_frequency ? ` / ${opportunity.payment_frequency}` : ""}`;

  return {
    id: opportunity.id,
    title: opportunity.title,
    type: opportunity.opportunity_type,
    arrangement: opportunity.work_arrangement,
    location: opportunity.location ?? "Location not specified",
    status: opportunity.status,
    views: opportunity.views_count,
    posted: formatListingDate(opportunity.created_at),
    deadline: formatListingDate(opportunity.application_deadline),
    compensation,
  };
}

function getListingLoadError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401)
      return "Your session has expired. Sign in again to view company listings.";
    if (error.status === 403)
      return "You need active administrator access to this company to view its listings.";
    if (error.status >= 500)
      return "The listing service is temporarily unavailable. Try again shortly.";
    return `Could not load company listings (HTTP ${error.status}).`;
  }
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred while loading company listings.";
}

interface ListingsState {
  companies: CompanyChoice[];
  companyId: string;
  items: ListingRow[];
  tab: ListingsTab;
  query: string;
  page: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string;
  retryCount: number;
  deleteTarget: ListingRow | null;
  deleting: boolean;
  deleteError: string;
  actionError: string;
}

type ListingsAction =
  | { type: "statusUpdated"; id: string; status: ListingStatus }
  | { type: "actionFailed"; error: string }
  | { type: "deleteRequested"; listing: ListingRow }
  | { type: "deleteCancelled" }
  | { type: "deleteStarted" }
  | { type: "deleteSucceeded" }
  | { type: "deleteFailed"; error: string }
  | { type: "loadStarted" }
  | { type: "companiesLoaded"; companies: CompanyChoice[] }
  | { type: "loadFailed"; error: string }
  | { type: "listLoaded"; items: ListingRow[]; total: number; totalPages: number }
  | { type: "listFailed"; error: string }
  | { type: "companySelected"; companyId: string }
  | { type: "tabChanged"; tab: ListingsTab }
  | { type: "queryChanged"; query: string }
  | { type: "pageChanged"; page: number }
  | { type: "retried" };

const initialListingsState: ListingsState = {
  companies: [],
  companyId: "",
  items: [],
  tab: "all",
  query: "",
  page: 1,
  total: 0,
  totalPages: 0,
  loading: true,
  error: "",
  retryCount: 0,
  deleteTarget: null,
  deleting: false,
  deleteError: "",
  actionError: "",
};

// Single source of truth for every transition on the listings page.
function listingsReducer(
  state: ListingsState,
  action: ListingsAction,
): ListingsState {
  switch (action.type) {
    case "loadStarted":
      return { ...state, loading: true, error: "" };
    case "companiesLoaded": {
      // Auto-select a sole company; with several, wait for the user to choose.
      if (action.companies.length === 0) {
        return {
          ...state,
          companies: [],
          loading: false,
          error:
            "No active administrator company was found. Complete employer onboarding first.",
        };
      }
      const single = action.companies.length === 1;
      return {
        ...state,
        companies: action.companies,
        companyId: single ? action.companies[0].id : state.companyId,
        loading: single,
      };
    }
    case "loadFailed":
      return { ...state, loading: false, error: action.error };
    case "listLoaded":
      return {
        ...state,
        items: action.items,
        total: action.total,
        totalPages: action.totalPages,
        loading: false,
      };
    case "listFailed":
      return {
        ...state,
        items: [],
        total: 0,
        totalPages: 0,
        loading: false,
        error: action.error,
      };
    case "companySelected":
      return { ...state, companyId: action.companyId, page: 1 };
    case "tabChanged":
      return { ...state, tab: action.tab };
    case "queryChanged":
      return { ...state, query: action.query };
    case "pageChanged":
      return { ...state, page: action.page };
    case "statusUpdated":
      return {
        ...state,
        actionError: "",
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, status: action.status } : item,
        ),
      };
    case "actionFailed":
      return { ...state, actionError: action.error };
    case "deleteRequested":
      return { ...state, deleteTarget: action.listing, deleteError: "" };
    case "deleteCancelled":
      // Keep the dialog open while the request is in flight.
      return state.deleting
        ? state
        : { ...state, deleteTarget: null, deleteError: "" };
    case "deleteStarted":
      return { ...state, deleting: true, deleteError: "" };
    case "deleteSucceeded":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== state.deleteTarget?.id),
        total: Math.max(0, state.total - 1),
        deleteTarget: null,
        deleting: false,
      };
    case "deleteFailed":
      return { ...state, deleting: false, deleteError: action.error };
    case "retried":
      return { ...state, retryCount: state.retryCount + 1 };
  }
}

export function EmployerListingsPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(listingsReducer, initialListingsState);
  const {
    companies,
    companyId,
    items,
    tab,
    query,
    page,
    total,
    totalPages,
    loading,
    error,
    retryCount,
    deleteTarget,
    deleting,
    deleteError,
    actionError,
  } = state;

  // Pause a live listing or resume a paused one, updating the row once the API confirms.
  const changeStatus = async (
    listing: ListingRow,
    status: "published" | "paused",
  ) => {
    try {
      await jobService.setOpportunityStatus(listing.id, status);
      dispatch({ type: "statusUpdated", id: listing.id, status });
    } catch (failure: unknown) {
      dispatch({
        type: "actionFailed",
        error:
          failure instanceof ApiRequestError && failure.status === 403
            ? "You need active administrator access to change this listing."
            : `Could not ${status === "paused" ? "pause" : "resume"} “${listing.title}”. Please try again.`,
      });
    }
  };

  // Delete through the API (backend re-verifies admin access), then drop the row locally on success.
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    dispatch({ type: "deleteStarted" });
    try {
      await jobService.deleteOpportunity(deleteTarget.id);
      dispatch({ type: "deleteSucceeded" });
    } catch (deleteFailure: unknown) {
      dispatch({
        type: "deleteFailed",
        error:
          deleteFailure instanceof ApiRequestError && deleteFailure.status === 403
            ? "You need active administrator access to delete this listing."
            : deleteFailure instanceof ApiRequestError &&
                deleteFailure.status === 404
              ? "This listing no longer exists. Refresh the page."
              : "Could not delete the listing. Please try again.",
      });
    }
  };
  const list = useMemo(
    () =>
      items.filter(
        (listing) =>
          (tab === "all" || listing.status === tab) &&
          listing.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, tab, query],
  );
  const activeCount = items.filter(
    (listing) => listing.status === "published" || listing.status === "paused",
  ).length;

  // Load only companies the signed-in user actively administers; the API repeats this authorization check.
  useEffect(() => {
    let active = true;
    dispatch({ type: "loadStarted" });
    profileService
      .getMyAdminCompanies()
      .then((response) => {
        if (!response)
          throw new Error("The company service returned an empty response.");
        if (!active) return;
        dispatch({ type: "companiesLoaded", companies: response.companies });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        dispatch({ type: "loadFailed", error: getListingLoadError(loadError) });
      });
    return () => {
      active = false;
    };
  }, [retryCount]);

  // Fetch each selected company's page; generation cleanup prevents stale requests replacing newer selections.
  useEffect(() => {
    if (!companyId) return;
    let active = true;
    dispatch({ type: "loadStarted" });
    jobService
      .listCompanyOpportunities(companyId, page)
      .then((response) => {
        if (!response)
          throw new Error("The listing service returned an empty response.");
        if (!active) return;
        dispatch({
          type: "listLoaded",
          items: response.data.map(toListingRow),
          total: response.pagination.total_items,
          totalPages: response.pagination.total_pages,
        });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        dispatch({ type: "listFailed", error: getListingLoadError(loadError) });
      });
    return () => {
      active = false;
    };
  }, [companyId, page, retryCount]);


  return (
    <div>
      <PageHeader
        title="Listings"
        description={`${total} listings · ${activeCount} active on this page`}
        actions={
          <Button asChild>
            <Link to="/employer/listings/new">
              <PlusIcon /> New listing
            </Link>
          </Button>
        }
      />
      {companies.length > 1 && (
        <label className="mb-4 flex max-w-sm flex-col gap-1.5 text-sm font-medium">
          Company
          <select
            className="h-10 rounded-md border bg-card px-3 font-normal"
            value={companyId}
            onChange={(event) =>
              dispatch({ type: "companySelected", companyId: event.target.value })
            }
            aria-label="Select company"
          >
            <option value="">Choose a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={tab}
          onValueChange={(value) =>
            dispatch({ type: "tabChanged", tab: value as ListingsTab })
          }
        >
          <TabsList className="h-auto flex-wrap justify-start">
            {(["all", "published", "draft", "paused", "closed"] as const).map(
              (t) => (
                <TabsTrigger key={t} value={t} className="capitalize">
                  {t}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) =>
              dispatch({ type: "queryChanged", query: event.target.value })
            }
            placeholder="Search listings on this page"
            className="h-9 bg-card pl-9"
            aria-label="Search listings"
          />
        </div>
      </div>
      <div className="mt-4">
        {actionError && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {actionError}
          </p>
        )}
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
          >
            <p className="flex items-center gap-2 font-medium text-destructive">
              <AlertCircleIcon className="h-4 w-4" />
              {error}
            </p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => dispatch({ type: "retried" })}
            >
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-2 rounded-xl border bg-card p-10 text-sm text-muted-foreground"
          >
            <Loader2Icon className="h-4 w-4 animate-spin" /> Loading company
            listings…
          </div>
        ) : !companyId ? (
          <StateBlock
            kind="empty"
            title="Select a company"
            description="Choose one of your administrator companies to view its listings."
          />
        ) : list.length === 0 ? (
          <StateBlock
            kind="empty"
            title={`No ${tab === "all" ? "" : tab} listings`}
            description="Create a listing to start receiving applications."
            action={{ label: "New listing", to: "/employer/listings/new" }}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="w-10">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((listing) => (
                    // The whole row opens the detail page; the title is a real link for keyboard and middle-click use.
                    <TableRow
                      key={listing.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/employer/listings/${listing.id}`)}
                    >
                      <TableCell>
                        <Link
                          to={`/employer/listings/${listing.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="font-medium hover:text-primary"
                        >
                          {listing.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {listing.type} · {listing.arrangement} ·{" "}
                          {listing.location} · {listing.compensation}
                        </p>
                      </TableCell>
                      <TableCell>
                        <ListingStatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">—</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {listing.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {listing.deadline}
                      </TableCell>
                      {/* Stop propagation so using the menu does not trigger row navigation. */}
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${listing.title}`}
                            >
                              <MoreVerticalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-32 text-sm">
                            <DropdownMenuItem
                              className="gap-2 text-sm [&_svg]:size-3.5"
                              onSelect={() =>
                                navigate(`/employer/listings/${listing.id}/edit`)
                              }
                            >
                              <PencilIcon className="size-3.5" /> Edit
                            </DropdownMenuItem>
                            {/* Only live listings can be paused; only paused ones can be resumed. */}
                            {listing.status === "published" && (
                              <DropdownMenuItem
                                className="gap-2 text-sm [&_svg]:size-3.5"
                                onSelect={() => void changeStatus(listing, "paused")}
                              >
                                <PauseIcon className="size-3.5" /> Pause
                              </DropdownMenuItem>
                            )}
                            {listing.status === "paused" && (
                              <DropdownMenuItem
                                className="gap-2 text-sm [&_svg]:size-3.5"
                                onSelect={() => void changeStatus(listing, "published")}
                              >
                                <PlayIcon className="size-3.5" /> Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="gap-2 text-sm text-destructive focus:text-destructive [&_svg]:size-3.5"
                              onSelect={() =>
                                dispatch({ type: "deleteRequested", listing })
                              }
                            >
                              <Trash2Icon className="size-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        <AlertDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) dispatch({ type: "deleteCancelled" });
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete “{deleteTarget?.title}”?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the listing. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError && (
              <p role="alert" className="text-sm text-destructive">
                {deleteError}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={(event) => {
                  // Prevent the dialog auto-closing so failures can be shown.
                  event.preventDefault();
                  void confirmDelete();
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!error && !loading && totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => dispatch({ type: "pageChanged", page: page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => dispatch({ type: "pageChanged", page: page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailState {
  listing: OpportunityDetail | null;
  loading: boolean;
  error: string;
  notFound: boolean;
  retryCount: number;
}

type DetailAction =
  | { type: "loadStarted" }
  | { type: "loaded"; listing: OpportunityDetail }
  | { type: "failed"; error: string; notFound: boolean }
  | { type: "retried" };

function detailReducer(state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case "loadStarted":
      return { ...state, loading: true, error: "", notFound: false };
    case "loaded":
      return { ...state, listing: action.listing, loading: false };
    case "failed":
      return {
        ...state,
        listing: null,
        loading: false,
        error: action.error,
        notFound: action.notFound,
      };
    case "retried":
      return { ...state, retryCount: state.retryCount + 1 };
  }
}

// Explain detail-load failures; the API returns 401/403 for non-published listings the user may not manage.
function getDetailLoadError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401)
      return "Your session has expired. Sign in again to view this listing.";
    if (error.status === 403)
      return "You need active administrator access to this company to view this listing.";
    if (error.status === 400) return "This listing link is not valid.";
    if (error.status >= 500)
      return "The listing service is temporarily unavailable. Try again shortly.";
    return `Could not load this listing (HTTP ${error.status}).`;
  }
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred while loading this listing.";
}

export function EmployerListingDetailPage() {
  const { id = "" } = useParams();
  const [state, dispatch] = useReducer(detailReducer, {
    listing: null,
    loading: true,
    error: "",
    notFound: false,
    retryCount: 0,
  });
  const { listing, loading, error, notFound, retryCount } = state;

  // Fetch the listing by id; the backend enforces authentication and company-admin authorization.
  useEffect(() => {
    let active = true;
    dispatch({ type: "loadStarted" });
    jobService
      .getOpportunity(id)
      .then((response) => {
        if (!response)
          throw new Error("The listing service returned an empty response.");
        if (!active) return;
        dispatch({ type: "loaded", listing: response.opportunity });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        dispatch({
          type: "failed",
          error: getDetailLoadError(loadError),
          notFound: loadError instanceof ApiRequestError && loadError.status === 404,
        });
      });
    return () => {
      active = false;
    };
  }, [id, retryCount]);

  if (loading)
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 rounded-xl border bg-card p-10 text-sm text-muted-foreground"
      >
        <Loader2Icon className="h-4 w-4 animate-spin" /> Loading listing…
      </div>
    );
  if (notFound)
    return (
      <StateBlock
        kind="no-results"
        title="Listing not found"
        action={{ label: "All listings", to: "/employer/listings" }}
      />
    );
  if (error || !listing)
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
      >
        <p className="flex items-center gap-2 font-medium text-destructive">
          <AlertCircleIcon className="h-4 w-4" />
          {error || "Listing could not be loaded."}
        </p>
        <Button
          className="mt-3"
          variant="outline"
          onClick={() => dispatch({ type: "retried" })}
        >
          Try again
        </Button>
      </div>
    );

  const l = toListingRow(listing);
  const skills = listing.skills_required ?? [];
  // Applicant analytics are not part of the opportunities API, so only real listing data is shown.
  const facts = [
    { label: "Employment type", value: listing.employment_type },
    { label: "Experience level", value: listing.experience_level },
    { label: "Country", value: listing.country },
    {
      label: "Duration",
      value: listing.duration_weeks ? `${listing.duration_weeks} weeks` : null,
    },
    { label: "Start date", value: listing.start_date ? formatListingDate(listing.start_date) : null },
    { label: "Openings", value: listing.openings?.toString() ?? null },
  ];

  return (
    <div>
      <Link
        to="/employer/listings"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Listings
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{l.title}</h1>
            <ListingStatusBadge status={l.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {l.type} · {l.arrangement} · {l.location} · {l.compensation} ·
            Posted {l.posted} · Closes {l.deadline}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="bg-card">
            <Link to={`/opportunities/${l.id}`}>
              <EyeIcon /> Public view
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/employer/listings/${l.id}/edit`}>
              <PencilIcon /> Edit
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Views" value={l.views.toLocaleString()} />
        <StatTile label="Status" value={l.status} />
        <StatTile label="Posted" value={l.posted} />
        <StatTile label="Deadline" value={l.deadline} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <WidgetCard title="Description">
          <p className="whitespace-pre-line text-sm">{listing.description}</p>
          {listing.responsibilities && (
            <>
              <h3 className="mt-5 text-sm font-semibold">Responsibilities</h3>
              <p className="mt-1 whitespace-pre-line text-sm">
                {listing.responsibilities}
              </p>
            </>
          )}
          {skills.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border bg-muted px-2 py-0.5 text-xs"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>
        <WidgetCard title="Details">
          <dl className="space-y-3 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="text-right capitalize">{fact.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </WidgetCard>
      </div>
    </div>
  );
}
