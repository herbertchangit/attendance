import axios from "axios";
import { Edit3, KeyRound, Plus, Search, Trash2, UserRoundCheck, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { usersApi, type UserMutation } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { AdminUser, Role } from "../types/domain";

const roleLabels: Record<Role, string> = {
  SYSTEM_ADMIN: "Administrator",
  EVENT_ORGANIZER: "Organizer",
  ATTENDEE: "Attendee"
};

const emptyForm: UserMutation & { password: string } = {
  name: "",
  email: "",
  mobile: "",
  role: "ATTENDEE",
  status: "Active",
  password: ""
};

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message ?? "The request could not be completed.");
  }
  return "The request could not be completed.";
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation">
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-white shadow-xl dark:bg-background" role="dialog" aria-modal="true" aria-label={title}>
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

export function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<AdminUser | "create" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    usersApi.list()
      .then(setUsers)
      .catch((requestError) => setError(errorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) =>
      [user.name, user.email, user.mobile, roleLabels[user.role], user.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, users]);

  const counts = {
    total: users.length,
    admins: users.filter((user) => user.role === "SYSTEM_ADMIN").length,
    organizers: users.filter((user) => user.role === "EVENT_ORGANIZER").length,
    attendees: users.filter((user) => user.role === "ATTENDEE").length
  };

  function openCreate() {
    setForm(emptyForm);
    setEditing("create");
    setError("");
  }

  function openEdit(user: AdminUser) {
    setForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile ?? "",
      role: user.role,
      status: user.status,
      password: ""
    });
    setEditing(user);
    setError("");
  }

  async function saveUser(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "create") {
        const created = await usersApi.create({ ...form, password: form.password });
        setUsers((current) => [...current, created]);
        setNotice(`${created.name} was created.`);
      } else if (editing) {
        const updated = await usersApi.update(editing.id, form);
        setUsers((current) => current.map((user) => user.id === updated.id ? updated : user));
        setNotice(`${updated.name} was updated.`);
      }
      setEditing(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function resetPassword(event: FormEvent) {
    event.preventDefault();
    if (!resetTarget) return;
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await usersApi.resetPassword(resetTarget.id, newPassword);
      setNotice(`Password reset for ${resetTarget.name}.`);
      setResetTarget(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser() {
    if (!deleteTarget) return;
    setSaving(true);
    setError("");
    try {
      await usersApi.remove(deleteTarget.id);
      setUsers((current) => current.filter((user) => user.id !== deleteTarget.id));
      setNotice(`${deleteTarget.name} was deleted.`);
      setDeleteTarget(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  const editingSelf = typeof editing === "object" && editing?.id === currentUser?.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-slate-500">Manage administrators, organizers, attendees, and account access.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create User</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="User summary">
        {[
          ["Total Users", counts.total],
          ["Administrators", counts.admins],
          ["Organizers", counts.organizers],
          ["Attendees", counts.attendees]
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
      {error && !editing && !resetTarget && !deleteTarget && <div role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <section className="rounded-lg border border-border bg-white shadow-soft dark:bg-muted">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Users</h2>
            <p className="text-xs text-slate-500">{filteredUsers.length} of {users.length} accounts</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, role..." className="pl-9 sm:w-80" aria-label="Search users" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-muted/70">
              <tr>
                {["User", "Role", "Mobile", "Status", "Last Login", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-200">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading users...</td></tr>}
              {!loading && filteredUsers.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No users match this search.</td></tr>}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{user.name.slice(0, 1).toUpperCase()}</span>
                      <div><p className="font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge label={roleLabels[user.role]} tone={user.role === "SYSTEM_ADMIN" ? "blue" : "neutral"} /></td>
                  <td className="px-4 py-3 text-slate-600">{user.mobile || "Not provided"}</td>
                  <td className="px-4 py-3"><Badge label={user.status} tone={user.status === "Active" ? "green" : "red"} /></td>
                  <td className="px-4 py-3 text-slate-600">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(user)} aria-label={`Edit ${user.name}`} title="Edit user"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setResetTarget(user); setError(""); }} aria-label={`Reset password for ${user.name}`} title="Reset password"><KeyRound className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" disabled={user.id === currentUser?.id} onClick={() => { setDeleteTarget(user); setError(""); }} aria-label={`Delete ${user.name}`} title={user.id === currentUser?.id ? "You cannot delete your own account" : "Delete user"}><Trash2 className="h-4 w-4 text-rose-600" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <Modal title={editing === "create" ? "Create user" : "Edit user"} onClose={() => setEditing(null)}>
          <form className="space-y-4" onSubmit={saveUser}>
            <label className="block space-y-1"><span className="text-sm font-medium">Full name</span><Input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="block space-y-1"><span className="text-sm font-medium">Email</span><Input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label className="block space-y-1"><span className="text-sm font-medium">Mobile</span><Input minLength={8} value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1"><span className="text-sm font-medium">Role</span><select className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm" value={form.role} disabled={editingSelf} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}><option value="SYSTEM_ADMIN">Administrator</option><option value="EVENT_ORGANIZER">Organizer</option><option value="ATTENDEE">Attendee</option></select></label>
              <label className="space-y-1"><span className="text-sm font-medium">Status</span><select className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm" value={form.status} disabled={editingSelf} onChange={(event) => setForm({ ...form, status: event.target.value as AdminUser["status"] })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
            </div>
            {editing === "create" && <label className="block space-y-1"><span className="text-sm font-medium">Temporary password</span><Input required type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>}
            {editingSelf && <p className="text-xs text-slate-500">Your own administrator role and active status cannot be changed.</p>}
            {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save user"}</Button></div>
          </form>
        </Modal>
      )}

      {resetTarget && (
        <Modal title="Reset password" onClose={() => setResetTarget(null)}>
          <form className="space-y-4" onSubmit={resetPassword}>
            <div className="flex items-center gap-3 rounded-md bg-muted p-3"><UserRoundCheck className="h-5 w-5 text-primary" /><div><p className="text-sm font-medium">{resetTarget.name}</p><p className="text-xs text-slate-500">{resetTarget.email}</p></div></div>
            <label className="block space-y-1"><span className="text-sm font-medium">New password</span><Input required type="password" minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
            <label className="block space-y-1"><span className="text-sm font-medium">Confirm password</span><Input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setResetTarget(null)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Resetting..." : "Reset password"}</Button></div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete user" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-slate-600">Delete <strong>{deleteTarget.name}</strong>? This removes their access immediately and cannot be undone.</p>
          {error && <p role="alert" className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" onClick={deleteUser} disabled={saving}>{saving ? "Deleting..." : "Delete user"}</Button></div>
        </Modal>
      )}
    </div>
  );
}
