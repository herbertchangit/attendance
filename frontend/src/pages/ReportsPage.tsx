import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { eventPerformance } from "../data/mockData";

const reportCards = [
  ["Total Registered", "3,194"],
  ["Total Attended", "2,795"],
  ["Total Absent", "399"],
  ["Attendance Percentage", "87.5%"],
  ["Registration Conversion", "78.2%"],
  ["Capacity Utilization", "82.1%"]
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reporting</h1>
          <p className="text-sm text-slate-500">Attendance, event, and venue reports with Excel, CSV, and PDF export flows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Download className="h-4 w-4" /> CSV</Button>
          <Button variant="secondary"><Download className="h-4 w-4" /> Excel</Button>
          <Button><Download className="h-4 w-4" /> PDF</Button>
        </div>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportCards.map(([label, value]) => (
          <Card key={label}><CardContent className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></CardContent></Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle>Top Performing Events</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#0f9f8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
