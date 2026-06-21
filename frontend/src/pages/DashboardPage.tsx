import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { activities, eventPerformance, metrics, trendData } from "../data/mockData";
import { events } from "../data/mockData";
import { useAuthStore } from "../store/authStore";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "ATTENDEE") {
    const attendeeMetrics = [
      { label: "My Registrations", value: "3", delta: "2 upcoming" },
      { label: "Events Attended", value: "8", delta: "89% attendance" },
      { label: "Certificates", value: "6", delta: "2 newly issued" }
    ];

    return (
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold">My attendance</h2>
          <p className="mt-1 text-sm text-slate-500">Your registrations, attendance history, and certificates.</p>
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          {attendeeMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="p-5">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
                <p className="mt-2 text-sm font-medium text-primary">{metric.delta}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <Card>
          <CardHeader><CardTitle>Upcoming registrations</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <article key={event.id} className="rounded-md border border-border p-4">
                <p className="font-semibold">{event.name}</p>
                <p className="mt-1 text-sm text-slate-500">{event.venueName}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>{event.startDate}</span>
                  <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">Registered</span>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold">{metric.value}</p>
                <p className="text-sm font-medium text-primary">{metric.delta}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_.9fr]">
        <Card>
          <CardHeader><CardTitle>Attendance Trend</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#0f9f8f" strokeWidth={3} />
                <Line type="monotone" dataKey="registrations" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Event Performance</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#0f9f8f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversion" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{activity.label}</p>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
