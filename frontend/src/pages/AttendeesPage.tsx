import { Upload } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/DataTable";
import { attendees } from "../data/mockData";

export function AttendeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendee Management</h1>
          <p className="text-sm text-slate-500">CSV/Excel import, duplicate email checks, and validation-ready records.</p>
        </div>
        <Button><Upload className="h-4 w-4" /> Bulk Import</Button>
      </div>
      <DataTable
        title="Attendee List"
        rows={attendees as unknown as Record<string, unknown>[]}
        searchKeys={["registrationId", "name", "email", "mobile"]}
        columns={[
          { key: "registrationId", header: "Registration ID" },
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "mobile", header: "Mobile" },
          { key: "organization", header: "Company / School" },
          { key: "registrationDate", header: "Registration Date" },
          { key: "attendanceStatus", header: "Attendance Status", render: (row) => <Badge label={String(row.attendanceStatus)} tone={row.attendanceStatus === "Present" ? "green" : row.attendanceStatus === "Late" ? "amber" : "red"} /> }
        ]}
      />
    </div>
  );
}
