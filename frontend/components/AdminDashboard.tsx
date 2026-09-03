"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Inbox,
  Images,
  Library,
  MessageSquareQuote,
  LayoutDashboard,
  Landmark,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
} from "lucide-react";
import { defaultClientLogos } from "@/lib/clients";
import { services as builtInServices } from "@/lib/content";
import { AdminExtras } from "@/components/AdminExtras";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
type Tab =
  | "overview"
  | "blogs"
  | "enquiries"
  | "clients"
  | "services"
  | "media"
  | "testimonials"
  | "settings"
  | "security"
  | "government";
type Summary = {
  totals: {
    views: number;
    visitors: number;
    clicks: number;
    enquiries: number;
    posts: number;
    conversionRate: number;
  };
  topPages: { _id: string; views: number }[];
  recentEvents: {
    _id: string;
    type: string;
    path: string;
    label?: string;
    createdAt: string;
  }[];
  daily: { _id: string; views: number; visitors: number }[];
  sources: { _id: string; views: number }[];
  devices: { _id: string; views: number }[];
};
type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "review" | "published";
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  featuredImage?: string;
  scheduledAt?: string;
  authorName?: string;
  category?: string;
  relatedServices?: string[];
};
type Lead = {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  status: string;
  createdAt: string;
  notes?: string;
  priority?: "Low" | "Normal" | "High" | "Urgent";
  assignedTo?: string;
  followUpAt?: string;
  viewedAt?: string;
  activity?: { action: string; detail?: string; by?: string; at: string }[];
};
type ClientLogo = {
  _id: string;
  name: string;
  imageData: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  order: number;
  active: boolean;
  fileName?: string;
  builtIn?: boolean;
};
type ManagedService = {
  _id: string;
  title: string;
  slug: string;
  eyebrow?: string;
  summary: string;
  description: string;
  includes: string[];
  audience: string[];
  notFor?: string[];
  requiredDocuments?: string[];
  processSteps?: string[];
  costFactors?: string[];
  timingFactors?: string[];
  authorities?: string[];
  delayCauses?: string[];
  reviewedAt?: string;
  ar?: { title?: string; eyebrow?: string; summary?: string; description?: string; includes?: string[]; audience?: string[]; notFor?: string[]; requiredDocuments?: string[]; processSteps?: string[]; costFactors?: string[]; timingFactors?: string[]; delayCauses?: string[]; faqs?: { question: string; answer: string }[] };
  related: string[];
  faqs: { question: string; answer: string }[];
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  builtIn?: boolean;
  category?: string;
  order?: number;
  featured?: boolean;
  featuredImage?: string;
};
export async function adminApi(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok)
    throw new Error(
      (await response.json().catch(() => ({}))).error || "Request failed",
    );
  return response.json();
}
const api = adminApi;
export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [managedServices, setManagedServices] = useState<ManagedService[]>([]);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState<Post | null>(null);
  const [serviceEditor, setServiceEditor] = useState<ManagedService | null>(
    null,
  );
  const load = useCallback(async () => {
    setError("");
    try {
      await api("/auth/me");
      setAuthenticated(true);
      const [s, p, l, c, serviceItems] = await Promise.all([
        api("/admin/dashboard"),
        api("/admin/posts"),
        api("/admin/leads"),
        api("/admin/clients"),
        api("/admin/services"),
      ]);
      setSummary(s);
      setPosts(p);
      setLeads(l);
      setClients(c);
      setManagedServices(serviceItems);
    } catch (e) {
      setAuthenticated(false);
      setError(e instanceof Error ? e.message : "Unable to load dashboard");
    }
  }, []);
  useEffect(() => {
    load();
    const interval = window.setInterval(load, 60_000);
    return () => window.clearInterval(interval);
  }, [load]);
  if (authenticated === null)
    return (
      <AdminShell>
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      </AdminShell>
    );
  if (!authenticated) return <Login onSuccess={load} error={error} />;
  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setAuthenticated(false);
  }
  return (
    <div className="fixed inset-0 z-[90] min-h-screen overflow-y-auto bg-[#f4f6f8] text-ink">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold">
              Raneem administration
            </p>
            <h1 className="mt-1 text-xl font-extrabold">
              Content & performance
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[220px_1fr]">
        <aside className="border-b bg-white p-3 md:min-h-[calc(100vh-77px)] md:border-b-0 md:border-r md:p-4">
          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {(
              [
                ["overview", "Overview", LayoutDashboard],
                ["blogs", "Blogs", FileText],
                ["enquiries", "Enquiries", Inbox],
                ["clients", "Clients", Images],
                ["services", "Services", BriefcaseBusiness],
                ["media", "Media", Library],
                ["testimonials", "Testimonials", MessageSquareQuote],
                ["settings", "SEO & settings", Settings],
                ["security", "Security", Shield],
                ["government", "Authorities", Landmark],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${tab === id ? "bg-navy text-white" : "hover:bg-mist"}`}
              >
                <Icon size={18} />
                {label}
                {id === "enquiries" && leads.some((lead) => !lead.viewedAt) && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                    {leads.filter((lead) => !lead.viewedAt).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {error && (
            <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}
          {tab === "overview" && <Overview data={summary} refresh={load} />}{" "}
          {tab === "blogs" && (
            <Blogs posts={posts} setEditor={setEditor} refresh={load} />
          )}{" "}
          {tab === "enquiries" && <Enquiries leads={leads} refresh={load} />}
          {tab === "clients" && <Clients logos={clients} refresh={load} />}
          {tab === "services" && (
            <Services
              managed={managedServices}
              setEditor={setServiceEditor}
              refresh={load}
            />
          )}
          {(
            ["media", "testimonials", "settings", "security", "government"] as Tab[]
          ).includes(tab) && (
            <AdminExtras
              section={
                tab as "media" | "testimonials" | "settings" | "security" | "government"
              }
            />
          )}
        </main>
      </div>
      {editor !== null && (
        <PostEditor
          post={editor}
          close={() => setEditor(null)}
          saved={async () => {
            setEditor(null);
            await load();
          }}
        />
      )}
      {serviceEditor !== null && (
        <ServiceEditor
          service={serviceEditor}
          close={() => setServiceEditor(null)}
          saved={async () => {
            setServiceEditor(null);
            await load();
          }}
        />
      )}
    </div>
  );
}
function Login({ onSuccess, error }: { onSuccess: () => void; error: string }) {
  const [twoFactorEmail, setTwoFactorEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (result.requiresTwoFactor) setTwoFactorEmail(result.email);
      else onSuccess();
    } catch (submitError) {
      setLoginError(
        submitError instanceof Error ? submitError.message : "Sign in failed",
      );
    }
  }
  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await api("/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ email: twoFactorEmail, code: data.get("code") }),
      });
      onSuccess();
    } catch (submitError) {
      setLoginError(
        submitError instanceof Error
          ? submitError.message
          : "Verification failed",
      );
    }
  }
  async function forgotPassword() {
    const email = window.prompt("Enter your admin email address");
    if (!email) return;
    try {
      const result = await api("/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      window.alert(result.message);
      const code = window.prompt("Enter the six-digit code sent to your email");
      if (!code) return;
      const password = window.prompt(
        "Enter a new password (at least 12 characters)",
      );
      if (!password) return;
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, password }),
      });
      setLoginError("Password reset successfully. You can now sign in.");
    } catch (resetError) {
      setLoginError(
        resetError instanceof Error
          ? resetError.message
          : "Password reset failed",
      );
    }
  }
  return (
    <AdminShell>
      <form
        onSubmit={twoFactorEmail ? verify : submit}
        className="w-full max-w-md rounded-2xl border bg-white p-7 shadow-soft sm:p-9"
      >
        <p className="eyebrow">PRIVATE ADMIN</p>
        <h1 className="mt-3 text-3xl font-extrabold">
          {twoFactorEmail ? "Verify sign in" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage blogs, enquiries and website performance.
        </p>
        {(loginError || error) && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {loginError || error}
          </p>
        )}
        {twoFactorEmail ? (
          <label className="mt-6 block text-sm font-semibold">
            Six-digit code
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              name="code"
              className="mt-2 w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-[.4em]"
            />
          </label>
        ) : (
          <>
            <label className="mt-6 block text-sm font-semibold">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-2 w-full rounded-lg border px-4 py-3"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Password
              <input
                required
                type="password"
                name="password"
                className="mt-2 w-full rounded-lg border px-4 py-3"
              />
            </label>
          </>
        )}
        <button className="mt-6 w-full rounded-lg bg-navy px-5 py-3 font-bold text-white">
          {twoFactorEmail ? "Verify" : "Sign in"}
        </button>
        {!twoFactorEmail && (
          <button
            type="button"
            onClick={forgotPassword}
            className="mt-4 w-full text-sm font-semibold text-royal"
          >
            Forgot password?
          </button>
        )}
      </form>
    </AdminShell>
  );
}
function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[90] grid min-h-screen place-items-center overflow-y-auto bg-mist px-4 py-16">
      {children}
    </div>
  );
}
function Overview({
  data,
  refresh,
}: {
  data: Summary | null;
  refresh: () => void;
}) {
  const [days, setDays] = useState(30);
  const [rangeData, setRangeData] = useState<Summary | null>(data);
  useEffect(() => {
    if (days === 30) setRangeData(data);
    else
      adminApi(`/admin/dashboard?days=${days}`)
        .then(setRangeData)
        .catch(() => undefined);
  }, [days, data]);
  const active = rangeData || data;
  if (!active) return <p>Loading analytics…</p>;
  const maximum = Math.max(...active.daily.map((item) => item.views), 1);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <select
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="rounded-lg border bg-white px-3 py-2 text-sm"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={365}>1 year</option>
        </select>
      </div>
      <OverviewBase data={active} refresh={refresh} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Traffic trend">
          <div className="flex h-52 items-end gap-1 overflow-hidden">
            {active.daily.map((day) => (
              <div
                key={day._id}
                title={`${day._id}: ${day.views} views`}
                className="min-w-1 flex-1 rounded-t bg-royal/80"
                style={{
                  height: `${Math.max(4, (day.views / maximum) * 100)}%`,
                }}
              />
            ))}
          </div>
        </Panel>
        <Panel title="Devices & sources">
          <div className="space-y-3 text-sm">
            {active.devices.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <span>{item._id}</span>
                <b>{item.views}</b>
              </div>
            ))}
            {active.sources.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex justify-between gap-4 border-b pb-2"
              >
                <span className="truncate">{item._id}</span>
                <b>{item.views}</b>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
function OverviewBase({
  data,
  refresh,
}: {
  data: Summary | null;
  refresh: () => void;
}) {
  if (!data) return <p>Loading analytics…</p>;
  const cards = [
    ["Page views", data.totals.views],
    ["Visitors", data.totals.visitors],
    ["Tracked clicks", data.totals.clicks],
    ["Enquiries", data.totals.enquiries],
    ["Blog posts", data.totals.posts],
  ];
  return (
    <>
      <Title
        title="Last 30 days"
        action={
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div className="rounded-xl border bg-white p-5" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <b className="mt-3 block text-3xl">{value}</b>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Top pages">
          <div className="space-y-3">
            {data.topPages.map((p) => (
              <div
                className="flex justify-between gap-4 border-b pb-3 text-sm"
                key={p._id}
              >
                <span className="truncate">{p._id}</span>
                <b>{p.views}</b>
              </div>
            ))}
            {!data.topPages.length && (
              <Empty text="No page views recorded yet." />
            )}
          </div>
        </Panel>
        <Panel title="Recent activity">
          <div className="space-y-3">
            {data.recentEvents.map((e) => (
              <div
                className="flex items-start justify-between gap-4 border-b pb-3 text-sm"
                key={e._id}
              >
                <span>
                  <b className="block capitalize">
                    {e.type.replaceAll("_", " ")}
                  </b>
                  <span className="text-slate-500">{e.label || e.path}</span>
                </span>
                <time className="shrink-0 text-xs text-slate-400">
                  {new Date(e.createdAt).toLocaleDateString()}
                </time>
              </div>
            ))}
            {!data.recentEvents.length && (
              <Empty text="No events recorded yet." />
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
function Blogs({
  posts,
  setEditor,
  refresh,
}: {
  posts: Post[];
  setEditor: (p: Post) => void;
  refresh: () => void;
}) {
  const blank = {
    _id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "published" as const,
    updatedAt: "",
    featuredImage: "",
    scheduledAt: "",
  };
  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await api(`/admin/posts/${id}`, { method: "DELETE" });
    refresh();
  }
  return (
    <>
      <Title
        title="Blog management"
        action={
          <button
            onClick={() => setEditor(blank)}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={16} />
            New blog
          </button>
        }
      />
      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        {posts.map((p) => (
          <div
            className="grid gap-3 border-b p-5 sm:grid-cols-[1fr_130px_130px] sm:items-center"
            key={p._id}
          >
            <div>
              <b>{p.title}</b>
              <p className="mt-1 text-xs text-slate-500">/{p.slug}</p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {p.status}
            </span>
            <div className="flex gap-3 text-sm">
              <button
                className="font-bold text-royal"
                onClick={() => setEditor(p)}
              >
                Edit
              </button>
              <button className="text-red-600" onClick={() => remove(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {!posts.length && (
          <Empty text="No blog posts yet. Create the first draft." />
        )}
      </div>
    </>
  );
}
function Enquiries({ leads, refresh }: { leads: Lead[]; refresh: () => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const services = Array.from(
    new Set(leads.map((lead) => lead.service)),
  ).sort();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !normalizedQuery ||
      [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone,
        lead.service,
        lead.message,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery));
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesService =
      serviceFilter === "all" || lead.service === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
  }

  async function status(id: string, value: string) {
    await api(`/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: value }),
    });
    refresh();
  }
  async function update(id: string, changes: Partial<Lead>) {
    await api(`/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });
    refresh();
  }
  function exportCsv() {
    const rows = [
      [
        "Date",
        "Name",
        "Email",
        "Phone",
        "Service",
        "Status",
        "Priority",
        "Assigned to",
        "Follow-up",
        "Message",
        "Notes",
      ],
      ...filteredLeads.map((lead) => [
        lead.createdAt,
        `${lead.firstName} ${lead.lastName || ""}`.trim(),
        lead.email,
        lead.phone,
        lead.service,
        lead.status,
        lead.priority || "Normal",
        lead.assignedTo || "",
        lead.followUpAt || "",
        lead.message || "",
        lead.notes || "",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `raneem-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <Title
        title="Enquiries"
        action={
          <button
            onClick={exportCsv}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold"
          >
            Export CSV
          </button>
        }
      />
      <div className="mt-6 rounded-xl border bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_190px_240px_auto]">
          <label className="relative">
            <span className="sr-only">Search enquiries</span>
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-royal"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border bg-white px-3 py-2.5 text-sm"
            aria-label="Filter enquiries by status"
          >
            <option value="all">All statuses</option>
            {[
              "New",
              "Contacted",
              "Qualified",
              "Converted",
              "Closed",
              "Spam",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className="min-w-0 rounded-lg border bg-white px-3 py-2.5 text-sm"
            aria-label="Filter enquiries by service"
          >
            <option value="all">All services</option>
            {services.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearFilters}
            disabled={
              !query && statusFilter === "all" && serviceFilter === "all"
            }
            className="rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing {filteredLeads.length} of {leads.length} enquiries
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        {filteredLeads.map((l) => (
          <article
            className={`rounded-xl border bg-white p-5 ${!l.viewedAt ? "border-l-4 border-l-gold" : ""}`}
            key={l._id}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <b>
                  {l.firstName} {l.lastName}
                </b>
                <p className="mt-1 text-sm text-slate-500">
                  {l.service} · {new Date(l.createdAt).toLocaleString()}
                </p>
              </div>
              <select
                value={l.status}
                onChange={(e) => status(l._id, e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                {[
                  "New",
                  "Contacted",
                  "Qualified",
                  "Converted",
                  "Closed",
                  "Spam",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a
                className="font-semibold text-royal"
                href={`mailto:${l.email}`}
              >
                {l.email}
              </a>
              <a className="font-semibold text-royal" href={`tel:${l.phone}`}>
                {l.phone}
              </a>
            </div>
            {l.message && (
              <p className="mt-4 rounded-lg bg-mist p-4 text-sm leading-6">
                {l.message}
              </p>
            )}
            <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3">
              <label className="text-xs font-semibold">
                Priority
                <select
                  value={l.priority || "Normal"}
                  onChange={(e) =>
                    update(l._id, {
                      priority: e.target.value as Lead["priority"],
                    })
                  }
                  className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm"
                >
                  {["Low", "Normal", "High", "Urgent"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold">
                Assigned to
                <input
                  defaultValue={l.assignedTo}
                  onBlur={(e) => update(l._id, { assignedTo: e.target.value })}
                  placeholder="Team member"
                  className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-semibold">
                Follow-up date
                <input
                  type="datetime-local"
                  defaultValue={l.followUpAt?.slice(0, 16)}
                  onBlur={(e) =>
                    update(l._id, { followUpAt: e.target.value || undefined })
                  }
                  className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="mt-3 block text-xs font-semibold">
              Internal notes
              <textarea
                defaultValue={l.notes}
                onBlur={(e) => update(l._id, { notes: e.target.value })}
                rows={2}
                placeholder="Add follow-up notes…"
                className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>
            <div className="mt-3 flex items-center justify-between">
              {!l.viewedAt && (
                <button
                  onClick={async () => {
                    await api(`/admin/leads/${l._id}/view`, { method: "POST" });
                    refresh();
                  }}
                  className="text-xs font-bold text-royal"
                >
                  Mark as read
                </button>
              )}
              {l.activity?.length ? (
                <span className="ml-auto text-xs text-slate-400">
                  {l.activity.length} updates
                </span>
              ) : null}
            </div>
          </article>
        ))}
        {!filteredLeads.length && (
          <Empty
            text={
              leads.length
                ? "No enquiries match the selected filters."
                : "No enquiries received yet."
            }
          />
        )}
      </div>
    </>
  );
}

function Clients({
  logos,
  refresh,
}: {
  logos: ClientLogo[];
  refresh: () => void;
}) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const builtInLogos: ClientLogo[] = defaultClientLogos.map(
    ([name, fileName], index) => ({
      _id: `built-in-${fileName}`,
      name,
      imageData: `/clients/${fileName}`,
      mimeType: fileName.toLowerCase().endsWith(".jpg")
        ? "image/jpeg"
        : "image/png",
      order: index,
      active: true,
      fileName,
      builtIn: true,
    }),
  );
  const allLogos = [...builtInLogos, ...logos];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredLogos = allLogos.filter(
    (logo) =>
      !normalizedQuery ||
      logo.name.toLowerCase().includes(normalizedQuery) ||
      logo.fileName?.toLowerCase().includes(normalizedQuery),
  );

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const file = data.get("logo");
    const name = String(data.get("name") || "").trim();

    if (!(file instanceof File) || !file.size) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setMessage("Use a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > 1_500_000) {
      setMessage("The logo must be smaller than 1.5 MB.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const imageData = await fileToDataUrl(file);
      await api("/admin/clients", {
        method: "POST",
        body: JSON.stringify({
          name,
          imageData,
          mimeType: file.type,
          order: logos.length,
          active: true,
        }),
      });
      formElement.reset();
      setMessage("Client logo added successfully.");
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function update(id: string, changes: Partial<ClientLogo>) {
    try {
      await api(`/admin/clients/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this client logo permanently?")) return;
    try {
      await api(`/admin/clients/${id}`, { method: "DELETE" });
      refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    }
  }

  return (
    <>
      <Title title="Trusted clients" />
      <form
        onSubmit={upload}
        className="mt-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <Field label="Client name">
          <input required minLength={2} maxLength={100} name="name" />
        </Field>
        <Field label="Logo (PNG, JPG or WebP)">
          <input
            required
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp"
          />
        </Field>
        <button
          disabled={saving}
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          <Plus size={17} /> {saving ? "Uploading…" : "Add client"}
        </button>
        {message && (
          <p className="text-sm text-slate-600 sm:col-span-3">{message}</p>
        )}
      </form>

      <div className="relative mt-6 max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search clients or logo filenames…"
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-royal"
          aria-label="Search clients"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredLogos.map((logo) => (
          <article className="rounded-xl border bg-white p-5" key={logo._id}>
            <div className="flex h-28 items-center justify-center rounded-lg bg-mist p-4">
              <img
                src={logo.imageData}
                alt={`${logo.name} logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <b className="block truncate">{logo.name}</b>
                <span className="text-xs text-slate-500">
                  {logo.builtIn ? "Website logo" : `Order ${logo.order}`}
                </span>
              </div>
              {logo.builtIn ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  Connected
                </span>
              ) : (
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={logo.active}
                    onChange={(event) =>
                      update(logo._id, { active: event.target.checked })
                    }
                  />
                  Visible
                </label>
              )}
            </div>
            {logo.builtIn ? (
              <p className="mt-4 truncate border-t pt-4 text-xs text-slate-500">
                {logo.fileName}
              </p>
            ) : (
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  Position
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    defaultValue={logo.order}
                    onBlur={(event) =>
                      update(logo._id, { order: Number(event.target.value) })
                    }
                    className="w-20 rounded-lg border px-2 py-1.5"
                  />
                </label>
                <button
                  onClick={() => remove(logo._id)}
                  className="ml-auto text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
        {!filteredLogos.length && (
          <Empty text="No clients match your search." />
        )}
      </div>
    </>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the logo file"));
    reader.readAsDataURL(file);
  });
}

function Services({
  managed,
  setEditor,
  refresh,
}: {
  managed: ManagedService[];
  setEditor: (service: ManagedService) => void;
  refresh: () => void;
}) {
  const [query, setQuery] = useState("");
  const existing: ManagedService[] = builtInServices
    .filter((service) => !managed.some((item) => item.slug === service.slug))
    .map((service) => ({
      _id: `built-in-${service.slug}`,
      ...service,
      faqs: service.faq.map(({ q, a }) => ({ question: q, answer: a })),
      status: "published",
      builtIn: true,
    }));
  const blank: ManagedService = {
    _id: "",
    title: "",
    slug: "",
    eyebrow: "",
    summary: "",
    description: "",
    includes: [],
    audience: [],
    related: [],
    faqs: [],
    status: "draft",
    category: "",
    order: 0,
    featured: false,
  };
  const normalizedQuery = query.trim().toLowerCase();
  const visible = [...existing, ...managed].filter(
    (service) =>
      !normalizedQuery ||
      service.title.toLowerCase().includes(normalizedQuery) ||
      service.slug.toLowerCase().includes(normalizedQuery) ||
      service.summary.toLowerCase().includes(normalizedQuery),
  );

  async function remove(id: string) {
    if (!confirm("Delete this service permanently?")) return;
    await api(`/admin/services/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <>
      <Title
        title="Service management"
        action={
          <button
            onClick={() => setEditor(blank)}
            className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={16} /> New service
          </button>
        }
      />
      <div className="relative mt-6 max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search services…"
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-royal"
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        {visible.map((service) => (
          <div
            className="grid gap-3 border-b p-5 sm:grid-cols-[1fr_130px_170px] sm:items-center"
            key={service._id}
          >
            <div className="min-w-0">
              <b className="block truncate">{service.title}</b>
              <p className="mt-1 truncate text-xs text-slate-500">
                /services/{service.slug}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${service.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {service.builtIn ? "Existing" : service.status}
            </span>
            <div className="flex gap-3 text-sm">
              <a
                href={`/services/${service.slug}`}
                target="_blank"
                className="font-bold text-royal"
              >
                View
              </a>
              {service.builtIn ? (
                <button
                  className="font-bold text-royal"
                  onClick={() =>
                    setEditor({ ...service, _id: "", builtIn: false })
                  }
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="font-bold text-royal"
                    onClick={() => setEditor(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => remove(service._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!visible.length && <Empty text="No matching services." />}
      </div>
    </>
  );
}

function ServiceEditor({
  service,
  close,
  saved,
}: {
  service: ManagedService;
  close: () => void;
  saved: () => void;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const faqs = String(data.get("faqs") || "")
      .split("\n")
      .map((line) => line.split("|").map((part) => part.trim()))
      .filter(([question, answer]) => question && answer)
      .map(([question, answer]) => ({ question, answer }));
    const arabicFaqs = String(data.get("arFaqs") || "").split("\n").map(line => line.split("|").map(part => part.trim())).filter(([question, answer]) => question && answer).map(([question, answer]) => ({ question, answer }));
    const body = {
      title: data.get("title"),
      slug: data.get("slug"),
      eyebrow: data.get("eyebrow") || undefined,
      summary: data.get("summary"),
      description: data.get("description"),
      includes: lines(data.get("includes")),
      audience: lines(data.get("audience")),
      notFor: lines(data.get("notFor")),
      requiredDocuments: lines(data.get("requiredDocuments")),
      processSteps: lines(data.get("processSteps")),
      costFactors: lines(data.get("costFactors")),
      timingFactors: lines(data.get("timingFactors")),
      authorities: lines(data.get("authorities")),
      delayCauses: lines(data.get("delayCauses")),
      reviewedAt: data.get("reviewedAt") || undefined,
      ar: { title: data.get("arTitle") || undefined, eyebrow: data.get("arEyebrow") || undefined, summary: data.get("arSummary") || undefined, description: data.get("arDescription") || undefined, includes: lines(data.get("arIncludes")), audience: lines(data.get("arAudience")), notFor: lines(data.get("arNotFor")), requiredDocuments: lines(data.get("arRequiredDocuments")), processSteps: lines(data.get("arProcessSteps")), costFactors: lines(data.get("arCostFactors")), timingFactors: lines(data.get("arTimingFactors")), delayCauses: lines(data.get("arDelayCauses")), faqs: arabicFaqs },
      related: lines(data.get("related")),
      category: data.get("category") || undefined,
      order: Number(data.get("order") || 0),
      featured: data.get("featured") === "true",
      featuredImage: data.get("featuredImage") || undefined,
      faqs,
      status: data.get("status"),
      seoTitle: data.get("seoTitle") || undefined,
      seoDescription: data.get("seoDescription") || undefined,
    };
    setSaving(true);
    setError("");
    try {
      await api(
        service._id ? `/admin/services/${service._id}` : "/admin/services",
        {
          method: service._id ? "PATCH" : "POST",
          body: JSON.stringify(body),
        },
      );
      saved();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Save failed",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/60 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={submit}
        className="mx-auto max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold">
            {service._id ? "Edit service" : "New service"}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Close
          </button>
        </div>
        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Service title">
            <input
              required
              minLength={3}
              name="title"
              defaultValue={service.title}
            />
          </Field>
          <Field label="URL slug">
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              name="slug"
              defaultValue={service.slug}
            />
          </Field>
          <Field label="Eyebrow label">
            <input
              name="eyebrow"
              defaultValue={service.eyebrow}
              placeholder="BUSINESS SERVICES · UAE"
            />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={service.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Category">
            <input
              name="category"
              defaultValue={service.category}
              placeholder="Business Setup"
            />
          </Field>
          <Field label="Display order">
            <input
              type="number"
              min={0}
              name="order"
              defaultValue={service.order || 0}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={service.featured}
            />
            Feature this service
          </label>
          <Field label="Featured image (media data or URL)" wide>
            <input
              name="featuredImage"
              defaultValue={service.featuredImage}
              placeholder="Paste an image copied from Media"
            />
          </Field>
          <Field label="Short summary" wide>
            <textarea
              required
              minLength={10}
              rows={3}
              name="summary"
              defaultValue={service.summary}
            />
          </Field>
          <Field label="Service overview" wide>
            <textarea
              required
              minLength={20}
              rows={5}
              name="description"
              defaultValue={service.description}
            />
          </Field>
          <Field label="What we assist with (one per line)">
            <textarea
              rows={6}
              name="includes"
              defaultValue={service.includes.join("\n")}
            />
          </Field>
          <Field label="Who it is for (one per line)">
            <textarea
              rows={6}
              name="audience"
              defaultValue={service.audience.join("\n")}
            />
          </Field>
          <Field label="Who it is not for (one per line)"><textarea rows={4} name="notFor" defaultValue={(service.notFor || []).join("\n")} /></Field>
          <Field label="Typical required documents"><textarea rows={4} name="requiredDocuments" defaultValue={(service.requiredDocuments || []).join("\n")} /></Field>
          <Field label="Process steps"><textarea rows={4} name="processSteps" defaultValue={(service.processSteps || []).join("\n")} /></Field>
          <Field label="Cost factors"><textarea rows={4} name="costFactors" defaultValue={(service.costFactors || []).join("\n")} /></Field>
          <Field label="Timing factors"><textarea rows={4} name="timingFactors" defaultValue={(service.timingFactors || []).join("\n")} /></Field>
          <Field label="Authorities involved"><textarea rows={4} name="authorities" defaultValue={(service.authorities || []).join("\n")} /></Field>
          <Field label="Common delay causes"><textarea rows={4} name="delayCauses" defaultValue={(service.delayCauses || []).join("\n")} /></Field>
          <Field label="Information reviewed date"><input type="date" name="reviewedAt" defaultValue={service.reviewedAt?.slice(0, 10)} /></Field>
          <div className="sm:col-span-2 mt-5 border-t pt-6"><h3 className="text-xl font-extrabold">Arabic content</h3><p className="mt-1 text-sm text-slate-500">Shown on the Arabic service page. Leave blank until reviewed by an Arabic-speaking editor.</p></div>
          <Field label="Arabic title"><input dir="rtl" name="arTitle" defaultValue={service.ar?.title} /></Field>
          <Field label="Arabic eyebrow"><input dir="rtl" name="arEyebrow" defaultValue={service.ar?.eyebrow} /></Field>
          <Field label="Arabic summary" wide><textarea dir="rtl" rows={3} name="arSummary" defaultValue={service.ar?.summary} /></Field>
          <Field label="Arabic overview" wide><textarea dir="rtl" rows={5} name="arDescription" defaultValue={service.ar?.description} /></Field>
          <Field label="Arabic: assistance items"><textarea dir="rtl" rows={4} name="arIncludes" defaultValue={(service.ar?.includes || []).join("\n")} /></Field>
          <Field label="Arabic: audience"><textarea dir="rtl" rows={4} name="arAudience" defaultValue={(service.ar?.audience || []).join("\n")} /></Field>
          <Field label="Arabic: not suitable for"><textarea dir="rtl" rows={4} name="arNotFor" defaultValue={(service.ar?.notFor || []).join("\n")} /></Field>
          <Field label="Arabic: documents"><textarea dir="rtl" rows={4} name="arRequiredDocuments" defaultValue={(service.ar?.requiredDocuments || []).join("\n")} /></Field>
          <Field label="Arabic: process"><textarea dir="rtl" rows={4} name="arProcessSteps" defaultValue={(service.ar?.processSteps || []).join("\n")} /></Field>
          <Field label="Arabic: cost factors"><textarea dir="rtl" rows={4} name="arCostFactors" defaultValue={(service.ar?.costFactors || []).join("\n")} /></Field>
          <Field label="Arabic: timing factors"><textarea dir="rtl" rows={4} name="arTimingFactors" defaultValue={(service.ar?.timingFactors || []).join("\n")} /></Field>
          <Field label="Arabic: delay causes"><textarea dir="rtl" rows={4} name="arDelayCauses" defaultValue={(service.ar?.delayCauses || []).join("\n")} /></Field>
          <Field label="Arabic FAQs (Question | Answer)" wide><textarea dir="rtl" rows={6} name="arFaqs" defaultValue={(service.ar?.faqs || []).map(faq => `${faq.question} | ${faq.answer}`).join("\n")} /></Field>
          <Field label="FAQs (Question | Answer, one per line)" wide>
            <textarea
              rows={7}
              name="faqs"
              defaultValue={service.faqs
                .map((faq) => `${faq.question} | ${faq.answer}`)
                .join("\n")}
            />
          </Field>
          <Field label="Related service slugs (one per line)" wide>
            <textarea
              rows={3}
              name="related"
              defaultValue={service.related.join("\n")}
            />
          </Field>
          <Field label="SEO title">
            <input
              maxLength={70}
              name="seoTitle"
              defaultValue={service.seoTitle}
            />
          </Field>
          <Field label="SEO description">
            <input
              maxLength={170}
              name="seoDescription"
              defaultValue={service.seoDescription}
            />
          </Field>
        </div>
        <button
          disabled={saving}
          className="mt-6 w-full rounded-lg bg-navy px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save service"}
        </button>
      </form>
    </div>
  );
}

function lines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function PostEditor({
  post,
  close,
  saved,
}: {
  post: Post;
  close: () => void;
  saved: () => void;
}) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = {
      title: d.get("title"),
      slug: d.get("slug"),
      excerpt: d.get("excerpt"),
      content: d.get("content"),
      status: d.get("status"),
      seoTitle: d.get("seoTitle") || undefined,
      seoDescription: d.get("seoDescription") || undefined,
      tags: String(d.get("tags") || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      featuredImage: d.get("featuredImage") || undefined,
      scheduledAt: d.get("scheduledAt") || null,
      authorName: d.get("authorName") || undefined,
      category: d.get("category") || undefined,
      relatedServices: lines(d.get("relatedServices")),
    };
    await api(post._id ? `/admin/posts/${post._id}` : "/admin/posts", {
      method: post._id ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });
    saved();
  }
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/60 p-3 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">
            {post._id ? "Edit blog" : "New blog"}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input required name="title" defaultValue={post.title} />
          </Field>
          <Field label="Slug">
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              name="slug"
              defaultValue={post.slug}
            />
          </Field>
          <Field label="Excerpt" wide>
            <textarea
              required
              rows={3}
              name="excerpt"
              defaultValue={post.excerpt}
            />
          </Field>
          <MarkdownEditor defaultValue={post.content} />
          <Field label="Status">
            <select name="status" defaultValue={post.status}>
              <option value="draft">Draft</option>
              <option value="review">In review</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input name="tags" defaultValue={post.tags?.join(", ")} />
          </Field>
          <Field label="Featured image (media data or URL)" wide>
            <input
              name="featuredImage"
              defaultValue={post.featuredImage}
              placeholder="Paste an image copied from the Media library"
            />
          </Field>
          <Field label="Schedule publication">
            <input
              type="datetime-local"
              name="scheduledAt"
              defaultValue={post.scheduledAt?.slice(0, 16)}
            />
          </Field>
          <Field label="Author">
            <input
              name="authorName"
              defaultValue={post.authorName}
              placeholder="Raneem team"
            />
          </Field>
          <Field label="Category">
            <input
              name="category"
              defaultValue={post.category}
              placeholder="Business setup"
            />
          </Field>
          <Field label="Related service slugs (one per line)" wide>
            <textarea
              rows={3}
              name="relatedServices"
              defaultValue={post.relatedServices?.join("\n")}
            />
          </Field>
          <Field label="SEO title">
            <input
              name="seoTitle"
              maxLength={70}
              defaultValue={post.seoTitle}
            />
          </Field>
          <Field label="SEO description">
            <input
              name="seoDescription"
              maxLength={170}
              defaultValue={post.seoDescription}
            />
          </Field>
        </div>
        <button className="mt-6 w-full rounded-lg bg-navy px-5 py-3 font-bold text-white">
          Save blog
        </button>
      </form>
    </div>
  );
}
function MarkdownEditor({ defaultValue }: { defaultValue: string }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [language, setLanguage] = useState("javascript");
  const [preview, setPreview] = useState(defaultValue);
  function insertCode() {
    const field = textarea.current;
    if (!field) return;
    const block = `\n\n\`\`\`${language}\n// Add code here\n\`\`\`\n\n`;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    field.setRangeText(block, start, end, "end");
    setPreview(field.value);
    field.focus();
  }
  return (
    <div className="sm:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Article content</p>
          <p className="mt-1 text-xs text-slate-500">
            Markdown is supported for headings, lists, links, tables and code.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded-lg border px-3 py-2 text-xs"
            aria-label="Code language"
          >
            {[
              "javascript",
              "typescript",
              "json",
              "html",
              "css",
              "bash",
              "text",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={insertCode}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
          >
            Insert code block
          </button>
        </div>
      </div>
      <textarea
        ref={textarea}
        required
        rows={16}
        name="content"
        defaultValue={defaultValue}
        onChange={(event) => setPreview(event.target.value)}
        className="mt-3 w-full rounded-lg border px-4 py-3 font-mono text-sm leading-6"
      />
      <div className="mt-4 rounded-xl border bg-white p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
          Live preview
        </p>
        <div className="blog-content text-sm leading-7 text-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <div className="mt-2 [&>*]:w-full [&>*]:rounded-lg [&>*]:border [&>*]:px-4 [&>*]:py-3 [&>*]:font-normal">
        {children}
      </div>
    </label>
  );
}
function Title({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold">
          Dashboard
        </p>
        <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <h3 className="mb-5 flex items-center gap-2 font-extrabold">
        <BarChart3 size={18} />
        {title}
      </h3>
      {children}
    </section>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="p-6 text-center text-sm text-slate-500">{text}</p>;
}
