import { DataTable } from "../components/DataTable";

const logs = [
  { id: "log_001", user: "Nadia Chong", action: "Login", module: "Authentication", timestamp: "2026-06-19 09:05:12", ipAddress: "10.10.1.25" },
  { id: "log_002", user: "Daniel Ho", action: "Update", module: "Events", timestamp: "2026-06-19 09:42:50", ipAddress: "10.10.1.32" },
  { id: "log_003", user: "Hannah Lee", action: "Attendance Check-in", module: "Attendance", timestamp: "2026-06-19 10:01:06", ipAddress: "10.10.2.11" },
  { id: "log_004", user: "Nadia Chong", action: "Delete", module: "Venues", timestamp: "2026-06-19 11:18:44", ipAddress: "10.10.1.25" }
];

export function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Trail</h1>
        <p className="text-sm text-slate-500">Track logins, CRUD activity, attendance check-ins, module actions, timestamps, and IP addresses.</p>
      </div>
      <DataTable
        title="System Activity"
        rows={logs}
        searchKeys={["user", "action", "module"]}
        columns={[
          { key: "user", header: "User" },
          { key: "action", header: "Action" },
          { key: "module", header: "Module" },
          { key: "timestamp", header: "Timestamp" },
          { key: "ipAddress", header: "IP Address" }
        ]}
      />
    </div>
  );
}
