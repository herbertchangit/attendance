import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import type { Role } from "../types.js";

interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  mobile?: string;
  status: "Active" | "Inactive";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

const demoPasswordHash = bcrypt.hashSync("password123", 10);
const seededAt = "2026-01-15T08:00:00.000Z";

export const users: MockUser[] = [
  { id: "usr_admin", name: "Nadia Chong", email: "admin@eventflow.test", passwordHash: demoPasswordHash, role: "SYSTEM_ADMIN", mobile: "+60 12-300 1101", status: "Active", createdAt: seededAt, updatedAt: seededAt },
  { id: "usr_org", name: "Daniel Ho", email: "organizer@eventflow.test", passwordHash: demoPasswordHash, role: "EVENT_ORGANIZER", mobile: "+60 12-300 1102", status: "Active", createdAt: seededAt, updatedAt: seededAt },
  { id: "usr_att", name: "Hannah Lee", email: "attendee@eventflow.test", passwordHash: demoPasswordHash, role: "ATTENDEE", mobile: "+60 12-300 1103", status: "Active", createdAt: seededAt, updatedAt: seededAt }
];

export const venues = [
  { id: "ven_001", name: "Grand Meridian Hall", address: "12 Persiaran Sentral", city: "Kuala Lumpur", state: "WP Kuala Lumpur", country: "Malaysia", postalCode: "50470", contactPerson: "Aisha Rahman", contactNumber: "+60 12-345 6601", email: "aisha@meridian.example", capacity: 1200, status: "Active" },
  { id: "ven_002", name: "Nexus Convention Centre", address: "88 Jalan Inovasi", city: "Petaling Jaya", state: "Selangor", country: "Malaysia", postalCode: "47810", contactPerson: "Marcus Lim", contactNumber: "+60 16-220 4490", email: "events@nexus.example", capacity: 2500, status: "Active" }
];

export const events = [
  { id: "evt_001", name: "Malaysia Digital Leadership Summit", venueId: "ven_001", startDate: "2026-07-08", endDate: "2026-07-09", organizerId: "usr_org", registrations: 742, status: "Open" },
  { id: "evt_002", name: "Regional Career Expo", venueId: "ven_002", startDate: "2026-08-14", endDate: "2026-08-14", organizerId: "usr_org", registrations: 1840, status: "Published" }
];

export const attendees = [
  { id: "att_001", registrationId: "REG-2026-0001", eventId: "evt_001", name: "Hannah Lee", email: "hannah.lee@example.com", mobile: "+60 12-456 8890", attendanceStatus: "Present", qrToken: "ATTEND|REG-2026-0001|evt_001" },
  { id: "att_002", registrationId: "REG-2026-0002", eventId: "evt_001", name: "Raymond Ng", email: "raymond.ng@example.com", mobile: "+60 13-890 1120", attendanceStatus: "Late", qrToken: "ATTEND|REG-2026-0002|evt_001" }
];

export const auditLogs: unknown[] = [];

export function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`;
}
