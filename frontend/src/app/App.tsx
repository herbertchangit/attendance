import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { VenuesPage } from "../pages/VenuesPage";
import { EventsPage } from "../pages/EventsPage";
import { AttendeesPage } from "../pages/AttendeesPage";
import { AttendancePage } from "../pages/AttendancePage";
import { ScannerPage } from "../pages/ScannerPage";
import { ReportsPage } from "../pages/ReportsPage";
import { CertificatesPage } from "../pages/CertificatesPage";
import { AuditPage } from "../pages/AuditPage";
import { UsersPage } from "../pages/UsersPage";
import { PublicOnly, RequireAuth, RequireRole } from "./AuthGuard";
import { AutoTranslator } from "../i18n/AutoTranslator";

export function App() {
  return (
    <>
      <AutoTranslator />
      <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route element={<RequireRole roles={["SYSTEM_ADMIN"]} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/audit" element={<AuditPage />} />
          </Route>
          <Route element={<RequireRole roles={["SYSTEM_ADMIN", "EVENT_ORGANIZER"]} />}>
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/attendees" element={<AttendeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
