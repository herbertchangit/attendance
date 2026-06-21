import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { attendees, events } from "../data/mockData";

export function CertificatesPage() {
  const attendee = attendees[0];
  const event = events.find((item) => item.id === attendee.eventId)!;
  const certificateNo = "CERT-2026-0001";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Certificates</h1>
          <p className="text-sm text-slate-500">Auto-generated attendance certificates with QR verification.</p>
        </div>
        <Button><Download className="h-4 w-4" /> Download PDF</Button>
      </div>
      <Card>
        <CardContent className="p-8">
          <div className="mx-auto max-w-3xl rounded-lg border-4 border-primary/30 bg-white p-8 text-center text-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-primary">Certificate of Attendance</p>
            <h2 className="mt-8 text-3xl font-semibold">{attendee.name}</h2>
            <p className="mt-4 text-slate-600">has successfully attended</p>
            <p className="mt-2 text-2xl font-semibold">{event.name}</p>
            <p className="mt-4 text-slate-600">Attendance Date: {event.startDate}</p>
            <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="text-left text-sm text-slate-500">
                <p>Certificate Number</p>
                <p className="font-semibold text-slate-900">{certificateNo}</p>
              </div>
              <QRCodeSVG value={`VERIFY|${certificateNo}|${attendee.registrationId}`} size={92} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
