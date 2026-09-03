"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
async function api(path: string, options: RequestInit = {}) {
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

export function AdminExtras({
  section,
}: {
  section: "media" | "testimonials" | "settings" | "security" | "government";
}) {
  if (section === "media") return <MediaManager />;
  if (section === "testimonials") return <TestimonialsManager />;
  if (section === "settings") return <SettingsManager />;
  if (section === "government") return <GovernmentManager />;
  return <SecurityManager />;
}

function Heading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gold">
        Dashboard
      </p>
      <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
function Notice({ text }: { text: string }) {
  return text ? (
    <p className="mt-4 rounded-lg bg-mist p-3 text-sm text-slate-700">{text}</p>
  ) : null;
}

type Media = {
  _id: string;
  name: string;
  alt?: string;
  imageData: string;
  size: number;
};
function MediaManager() {
  const [items, setItems] = useState<Media[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(
    () =>
      api("/admin/media")
        .then(setItems)
        .catch((e) => setMessage(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File) || !file.size) return;
    if (file.size > 2_000_000)
      return setMessage("Image must be smaller than 2 MB.");
    const imageData = await readFile(file);
    try {
      await api("/admin/media", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          alt: data.get("alt"),
          imageData,
          mimeType: file.type,
          size: file.size,
        }),
      });
      form.reset();
      setMessage("Image added to the media library.");
      load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed");
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete this media item?")) return;
    await api(`/admin/media/${id}`, { method: "DELETE" });
    load();
  }
  const shown = items.filter((item) =>
    `${item.name} ${item.alt || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        title="Media library"
        description="Upload reusable images for blogs, services and other website content."
      />
      <form
        onSubmit={upload}
        className="mt-6 grid gap-4 rounded-xl border bg-white p-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <input
          required
          name="name"
          placeholder="Image name"
          className="rounded-lg border px-4 py-3"
        />
        <input
          name="alt"
          placeholder="Alternative text"
          className="rounded-lg border px-4 py-3"
        />
        <input
          required
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="rounded-lg border px-3 py-2"
        />
        <button className="rounded-lg bg-navy px-4 py-3 font-bold text-white">
          <Plus className="mr-2 inline" size={16} />
          Upload
        </button>
      </form>
      <Notice text={message} />
      <div className="relative mt-6 max-w-lg">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search media…"
          className="w-full rounded-xl border bg-white py-3 pl-11 pr-4"
        />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shown.map((item) => (
          <article key={item._id} className="rounded-xl border bg-white p-4">
            <div className="flex h-36 items-center justify-center rounded-lg bg-mist p-3">
              <img
                src={item.imageData}
                alt={item.alt || item.name}
                className="h-full w-full object-contain"
              />
            </div>
            <b className="mt-3 block truncate">{item.name}</b>
            <p className="text-xs text-slate-500">
              {Math.round(item.size / 1024)} KB
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  navigator.clipboard
                    .writeText(item.imageData)
                    .then(() =>
                      setMessage("Image copied. Paste it into an image field."),
                    )
                }
                className="text-sm font-semibold text-royal"
              >
                Copy image
              </button>
              <button
                onClick={() => remove(item._id)}
                className="flex items-center gap-1 text-sm text-red-600"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

type Testimonial = {
  _id: string;
  name: string;
  company?: string;
  rating: number;
  review: string;
  published: boolean;
  order: number;
};
function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [message, setMessage] = useState("");
  const load = useCallback(
    () =>
      api("/admin/testimonials")
        .then(setItems)
        .catch((e) => setMessage(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    try {
      await api("/admin/testimonials", {
        method: "POST",
        body: JSON.stringify({
          name: d.get("name"),
          company: d.get("company") || undefined,
          rating: Number(d.get("rating")),
          review: d.get("review"),
          published: true,
          order: items.length,
        }),
      });
      form.reset();
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    }
  }
  async function update(id: string, body: Partial<Testimonial>) {
    await api(`/admin/testimonials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await api(`/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }
  return (
    <>
      <Heading
        title="Testimonials"
        description="Add reviews and control which ones appear on the website."
      />
      <form
        onSubmit={add}
        className="mt-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2"
      >
        <input
          required
          name="name"
          placeholder="Customer name"
          className="rounded-lg border px-4 py-3"
        />
        <input
          name="company"
          placeholder="Company"
          className="rounded-lg border px-4 py-3"
        />
        <select
          name="rating"
          defaultValue="5"
          className="rounded-lg border px-4 py-3"
        >
          {[5, 4, 3, 2, 1].map((x) => (
            <option key={x} value={x}>
              {x} stars
            </option>
          ))}
        </select>
        <textarea
          required
          minLength={10}
          name="review"
          placeholder="Customer review"
          className="rounded-lg border px-4 py-3 sm:col-span-2"
        />
        <button className="rounded-lg bg-navy px-4 py-3 font-bold text-white sm:col-span-2">
          Add testimonial
        </button>
      </form>
      <Notice text={message} />
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border bg-white p-5">
            <div className="flex justify-between gap-4">
              <div>
                <b>{item.name}</b>
                <p className="text-sm text-slate-500">
                  {item.company} · {"★".repeat(item.rating)}
                </p>
              </div>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={item.published}
                  onChange={(e) =>
                    update(item._id, { published: e.target.checked })
                  }
                />{" "}
                Published
              </label>
            </div>
            <p className="mt-3 text-sm leading-6">{item.review}</p>
            <button
              onClick={() => remove(item._id)}
              className="mt-3 text-sm text-red-600"
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

type SettingsData = {
  settings: { _id: string; key: string; value: string | boolean | number }[];
  redirects: { _id: string; from: string; to: string; permanent: boolean }[];
};
function SettingsManager() {
  const [data, setData] = useState<SettingsData>({
    settings: [],
    redirects: [],
  });
  const [message, setMessage] = useState("");
  const load = useCallback(
    () =>
      api("/admin/settings")
        .then(setData)
        .catch((e) => setMessage(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  const value = (key: string) =>
    String(data.settings.find((x) => x.key === key)?.value || "");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    await api("/admin/settings", { method: "PUT", body: JSON.stringify(d) });
    setMessage("SEO settings saved.");
    load();
  }
  async function redirect(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget,
      d = new FormData(f);
    await api("/admin/redirects", {
      method: "POST",
      body: JSON.stringify({
        from: d.get("from"),
        to: d.get("to"),
        permanent: true,
        active: true,
      }),
    });
    f.reset();
    load();
  }
  return (
    <>
      <Heading
        title="SEO & redirects"
        description="Manage global search and social metadata plus URL redirects."
      />
      <form
        onSubmit={save}
        className="mt-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2"
      >
        <input
          name="siteTitle"
          defaultValue={value("siteTitle")}
          placeholder="Default site title"
          className="rounded-lg border px-4 py-3"
        />
        <input
          name="ogImage"
          defaultValue={value("ogImage")}
          placeholder="Social image URL"
          className="rounded-lg border px-4 py-3"
        />
        <textarea
          name="siteDescription"
          defaultValue={value("siteDescription")}
          placeholder="Default site description"
          className="rounded-lg border px-4 py-3 sm:col-span-2"
        />
        <button className="rounded-lg bg-navy px-4 py-3 font-bold text-white sm:col-span-2">
          Save SEO settings
        </button>
      </form>
      <Notice text={message} />
      <form
        onSubmit={redirect}
        className="mt-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          required
          name="from"
          placeholder="/old-page"
          className="rounded-lg border px-4 py-3"
        />
        <input
          required
          name="to"
          placeholder="/new-page or URL"
          className="rounded-lg border px-4 py-3"
        />
        <button className="rounded-lg border px-4 font-bold">
          Add redirect
        </button>
      </form>
      <div className="mt-4 rounded-xl border bg-white">
        {data.redirects.map((x) => (
          <div key={x._id} className="flex gap-3 border-b p-4 text-sm">
            <code>{x.from}</code>
            <span>→</span>
            <code>{x.to}</code>
            <button
              onClick={async () => {
                await api(`/admin/redirects/${x._id}`, { method: "DELETE" });
                load();
              }}
              className="ml-auto text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

type SecurityData = {
  users: {
    _id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    twoFactorEnabled: boolean;
    lastLoginAt?: string;
  }[];
  audit: { _id: string; email?: string; action: string; createdAt: string }[];
};
function SecurityManager() {
  const [data, setData] = useState<SecurityData>({ users: [], audit: [] });
  const [msg, setMsg] = useState("");
  const load = useCallback(
    () =>
      api("/admin/users")
        .then(setData)
        .catch((e) => setMsg(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget,
      d = Object.fromEntries(new FormData(f));
    try {
      await api("/admin/users", { method: "POST", body: JSON.stringify(d) });
      f.reset();
      load();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Failed");
    }
  }
  async function password(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/admin/change-password", {
        method: "POST",
        body: JSON.stringify(d),
      });
      location.reload();
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Failed");
    }
  }
  return (
    <>
      <Heading
        title="Admin security"
        description="Manage accounts, two-step verification, passwords and login activity."
      />
      <form
        onSubmit={add}
        className="mt-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <input
          required
          name="name"
          placeholder="Name"
          className="rounded-lg border px-4 py-3"
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          className="rounded-lg border px-4 py-3"
        />
        <input
          required
          minLength={12}
          type="password"
          name="password"
          placeholder="Temporary password"
          className="rounded-lg border px-4 py-3"
        />
        <select name="role" className="rounded-lg border px-4">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button className="rounded-lg bg-navy px-4 py-3 font-bold text-white xl:col-span-4">
          Create account
        </button>
      </form>
      <Notice text={msg} />
      <div className="mt-6 grid gap-4">
        {data.users.map((user) => (
          <article
            key={user._id}
            className="flex flex-col gap-3 rounded-xl border bg-white p-5 sm:flex-row sm:items-center"
          >
            <div>
              <b>{user.name}</b>
              <p className="text-sm text-slate-500">
                {user.email} · {user.role}
              </p>
            </div>
            <label className="sm:ml-auto text-sm">
              <input
                type="checkbox"
                checked={user.twoFactorEnabled}
                onChange={async (e) => {
                  await api(`/admin/users/${user._id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                      twoFactorEnabled: e.target.checked,
                    }),
                  });
                  load();
                }}
              />{" "}
              Email 2FA
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={user.active}
                onChange={async (e) => {
                  await api(`/admin/users/${user._id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ active: e.target.checked }),
                  });
                  load();
                }}
              />{" "}
              Active
            </label>
          </article>
        ))}
      </div>
      <form
        onSubmit={password}
        className="mt-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-extrabold sm:col-span-2">Change my password</h3>
        <input
          required
          type="password"
          name="currentPassword"
          placeholder="Current password"
          className="rounded-lg border px-4 py-3"
        />
        <input
          required
          minLength={12}
          type="password"
          name="newPassword"
          placeholder="New password"
          className="rounded-lg border px-4 py-3"
        />
        <button className="rounded-lg border px-4 py-3 font-bold sm:col-span-2">
          Change password and sign out
        </button>
      </form>
      <section className="mt-6 rounded-xl border bg-white p-5">
        <h3 className="font-extrabold">Recent login activity</h3>
        {data.audit.map((x) => (
          <div
            key={x._id}
            className="flex justify-between gap-3 border-b py-3 text-sm"
          >
            <span>
              {x.email} · {x.action.replaceAll("_", " ")}
            </span>
            <time className="text-slate-400">
              {new Date(x.createdAt).toLocaleString()}
            </time>
          </div>
        ))}
      </section>
    </>
  );
}

type GovernmentEntity = { _id: string; name: string; nameAr?: string; imageData: string; website?: string; order: number; active: boolean };
function GovernmentManager() {
  const [items, setItems] = useState<GovernmentEntity[]>([]);
  const [message, setMessage] = useState("");
  const load = useCallback(() => api("/admin/government-entities").then(setItems).catch((error) => setMessage(error.message)), []);
  useEffect(() => { load(); }, [load]);
  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("logo");
    if (!(file instanceof File) || !file.size) return;
    if (file.size > 2_000_000) return setMessage("Logo must be smaller than 2 MB.");
    try {
      await api("/admin/government-entities", { method: "POST", body: JSON.stringify({ name: data.get("name"), nameAr: data.get("nameAr") || undefined, website: data.get("website") || undefined, imageData: await readFile(file), order: items.length, active: true }) });
      form.reset(); setMessage("Authority added. Confirm that the logo is official and current before publishing."); load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed"); }
  }
  async function update(id: string, changes: Partial<GovernmentEntity>) { await api(`/admin/government-entities/${id}`, { method: "PATCH", body: JSON.stringify(changes) }); load(); }
  async function remove(id: string) { if (!confirm("Delete this authority logo?")) return; await api(`/admin/government-entities/${id}`, { method: "DELETE" }); load(); }
  return <><Heading title="Government entities" description="Publish only authorities and official service channels Raneem genuinely handles. Logos do not imply endorsement or partnership."/><form onSubmit={add} className="mt-6 grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2"><input required name="name" placeholder="Official English name" className="rounded-lg border px-4 py-3"/><input name="nameAr" dir="rtl" placeholder="الاسم الرسمي بالعربية" className="rounded-lg border px-4 py-3"/><input type="url" name="website" placeholder="Official website URL" className="rounded-lg border px-4 py-3"/><input required type="file" name="logo" accept="image/png,image/jpeg,image/webp" className="rounded-lg border px-3 py-2"/><button className="rounded-lg bg-navy px-4 py-3 font-bold text-white sm:col-span-2">Add authority</button></form><Notice text={message}/><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item=><article key={item._id} className="rounded-xl border bg-white p-5"><div className="flex h-28 items-center justify-center rounded-lg bg-mist p-4"><img src={item.imageData} alt={`${item.name} logo`} className="h-full w-full object-contain"/></div><b className="mt-4 block">{item.name}</b>{item.nameAr&&<span dir="rtl" className="block text-sm text-slate-500">{item.nameAr}</span>}<div className="mt-4 flex justify-between border-t pt-3"><label className="text-sm"><input type="checkbox" checked={item.active} onChange={(event)=>update(item._id,{active:event.target.checked})}/> Visible</label><button onClick={()=>remove(item._id)} className="text-sm text-red-600">Delete</button></div></article>)}</div></>;
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
