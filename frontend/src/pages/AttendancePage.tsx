import { QRCodeSVG } from "qrcode.react";
import { Check, Clock, LogOut, Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { attendees } from "../data/mockData";

export function AttendancePage() {
  const [query, setQuery] = useState("");
  const filtered = attendees.filter((attendee) => [attendee.registrationId, attendee.name, attendee.email].join(" ").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-slate-500">QR check-in, check-out, manual marking, and session attendance tracking.</p>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by Registration ID, name, or email" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" />
          </div>
          <Button variant="secondary">Session Attendance</Button>
        </CardContent>
      </Card>
      <section className="grid gap-4 lg:grid-cols-3">
        {filtered.map((attendee) => (
          <Card key={attendee.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{attendee.name}</CardTitle>
                <Badge label={attendee.attendanceStatus} tone={attendee.attendanceStatus === "Present" ? "green" : attendee.attendanceStatus === "Late" ? "amber" : "red"} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center rounded-md border border-border bg-white p-4">
                <QRCodeSVG value={attendee.qrToken} size={132} />
              </div>
              <div className="text-sm text-slate-500">
                <p>{attendee.registrationId}</p>
                <p>{attendee.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm"><Check className="h-4 w-4" /> Present</Button>
                <Button size="sm" variant="secondary"><Clock className="h-4 w-4" /> Late</Button>
                <Button size="sm" variant="secondary"><X className="h-4 w-4" /> Absent</Button>
                <Button size="sm" variant="secondary"><LogOut className="h-4 w-4" /> Check Out</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
