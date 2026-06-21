import axios from "axios";
import { Building2, Edit3, MapPin, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { venuesApi, type VenueMutation } from "../services/api";
import type { Venue } from "../types/domain";

const emptyVenue: VenueMutation = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "Malaysia",
  postalCode: "",
  contactPerson: "",
  contactNumber: "",
  email: "",
  capacity: 0,
  status: "Active"
};

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message ?? "The request could not be completed.");
  }
  return "The request could not be completed.";
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation">
      <section className={`max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-lg border border-border bg-white shadow-xl dark:bg-background ${wide ? "max-w-2xl" : "max-w-lg"}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog"><X className="h-4 w-4" /></Button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

export function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Venue | "create" | null>(null);
  const [form, setForm] = useState<VenueMutation>(emptyVenue);
  const [deleteTarget, setDeleteTarget] = useState<Venue | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    venuesApi.list()
      .then(setVenues)
      .catch((requestError) => setError(errorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filteredVenues = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return venues;
    return venues.filter((venue) =>
      [venue.name, venue.city, venue.state, venue.country, venue.contactPerson, venue.email, venue.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, venues]);

  const activeCount = venues.filter((venue) => venue.status === "Active").length;
  const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0);
  const cityCount = new Set(venues.map((venue) => venue.city)).size;

  function openCreate() {
    setForm(emptyVenue);
    setEditing("create");
    setError("");
  }

  function openEdit(venue: Venue) {
    const { id: _id, ...details } = venue;
    setForm(details);
    setEditing(venue);
    setError("");
  }

  async function saveVenue(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "create") {
        const created = await venuesApi.create(form);
        setVenues((current) => [...current, created]);
        setNotice(`${created.name} was created.`);
      } else if (editing) {
        const updated = await venuesApi.update(editing.id, form);
        setVenues((current) => current.map((venue) => venue.id === updated.id ? updated : venue));
        setNotice(`${updated.name} was updated.`);
      }
      setEditing(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteVenue() {
    if (!deleteTarget) return;
    setSaving(true);
    setError("");
    try {
      await venuesApi.remove(deleteTarget.id);
      setVenues((current) => current.filter((venue) => venue.id !== deleteTarget.id));
      setNotice(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Venue Management</h1>
          <p className="text-sm text-slate-500">Manage event locations, capacity, contacts, and availability.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Venue</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Venue summary">
        {[
          ["Total Venues", venues.length],
          ["Active Venues", activeCount],
          ["Total Capacity", totalCapacity.toLocaleString()],
          ["Cities Covered", cityCount]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {notice && <div role="status" className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notification"><X className="h-4 w-4" /></button></div>}
      {error && !editing && !deleteTarget && <div role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <section className="rounded-lg border border-border bg-white shadow-soft dark:bg-muted">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Venues</h2>
            <p className="text-xs text-slate-500">{filteredVenues.length} of {venues.length} locations</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search venue, city, contact..." className="pl-9 sm:w-80" aria-label="Search venues" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-muted/70">
              <tr>{["Venue", "Location", "Capacity", "Contact", "Status", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-200">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading venues...</td></tr>}
              {!loading && filteredVenues.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No venues match this search.</td></tr>}
              {filteredVenues.map((venue) => (
                <tr key={venue.id} className="border-t border-border">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Building2 className="h-4 w-4" /></span><div><p className="font-medium">{venue.name}</p><p className="text-xs text-slate-500">{venue.address}</p></div></div></td>
                  <td className="px-4 py-3"><div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><span>{venue.city}, {venue.state}<br /><span className="text-xs text-slate-500">{venue.country} {venue.postalCode}</span></span></div></td>
                  <td className="px-4 py-3 font-medium">{venue.capacity.toLocaleString()}</td>
                  <td className="px-4 py-3"><p>{venue.contactPerson}</p><p className="text-xs text-slate-500">{venue.contactNumber}</p><p className="text-xs text-slate-500">{venue.email}</p></td>
                  <td className="px-4 py-3"><Badge label={venue.status} tone={venue.status === "Active" ? "green" : "red"} /></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(venue)} aria-label={`Edit ${venue.name}`} title="Edit venue"><Edit3 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => { setDeleteTarget(venue); setError(""); }} aria-label={`Delete ${venue.name}`} title="Delete venue"><Trash2 className="h-4 w-4 text-rose-600" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <Modal title={editing === "create" ? "Create venue" : "Edit venue"} onClose={() => setEditing(null)} wide>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveVenue}>
            <label className="space-y-1 sm:col-span-2"><span className="text-sm font-medium">Venue name</span><Input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="space-y-1 sm:col-span-2"><span className="text-sm font-medium">Address</span><Input required minLength={2} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">City</span><Input required minLength={2} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">State</span><Input required minLength={2} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Country</span><Input required minLength={2} value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Postal code</span><Input required minLength={2} value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Contact person</span><Input required minLength={2} value={form.contactPerson} onChange={(event) => setForm({ ...form, contactPerson: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Contact number</span><Input required minLength={5} value={form.contactNumber} onChange={(event) => setForm({ ...form, contactNumber: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Email</span><Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Capacity</span><Input required type="number" min={1} value={form.capacity || ""} onChange={(event) => setForm({ ...form, capacity: Number(event.target.value) })} /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Status</span><select className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Venue["status"] })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
            {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">{error}</p>}
            <div className="flex justify-end gap-2 sm:col-span-2"><Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save venue"}</Button></div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete venue" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-slate-600">Delete <strong>{deleteTarget.name}</strong>? Venues assigned to an event are protected and cannot be removed.</p>
          {error && <p role="alert" className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={deleteVenue} disabled={saving}>{saving ? "Deleting..." : "Delete venue"}</Button></div>
        </Modal>
      )}
    </div>
  );
}
