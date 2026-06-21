import { CalendarDays, List, Plus } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { DataTable } from "../components/DataTable";
import { events } from "../data/mockData";

function eventTone(status: string) {
  if (["Open", "Ongoing", "Completed"].includes(status)) return "green";
  if (["Draft", "Published"].includes(status)) return "blue";
  if (["Closed"].includes(status)) return "amber";
  return "red";
}

export function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Event Management</h1>
          <p className="text-sm text-slate-500">Manage listings, sessions, registration windows, and publication status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><CalendarDays className="h-4 w-4" /> Calendar</Button>
          <Button variant="secondary"><List className="h-4 w-4" /> List</Button>
          <Button><Plus className="h-4 w-4" /> Create Event</Button>
        </div>
      </div>
      <DataTable
        title="Event Listing"
        rows={events as unknown as Record<string, unknown>[]}
        searchKeys={["name", "venueName", "organizer", "status"]}
        columns={[
          { key: "name", header: "Event Name" },
          { key: "venueName", header: "Venue" },
          { key: "startDate", header: "Start Date" },
          { key: "endDate", header: "End Date" },
          { key: "organizer", header: "Organizer" },
          { key: "registrations", header: "Registrations" },
          { key: "status", header: "Status", render: (row) => <Badge label={String(row.status)} tone={eventTone(String(row.status))} /> }
        ]}
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {events[0].sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader><CardTitle>{session.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-500">{session.description}</p>
              <p><strong>Speaker:</strong> {session.speaker}</p>
              <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
              <p><strong>Room:</strong> {session.room}</p>
              <p><strong>Session Attendance:</strong> {session.attendanceRate}%</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
