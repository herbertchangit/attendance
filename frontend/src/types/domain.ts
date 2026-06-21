export type Role = "SYSTEM_ADMIN" | "EVENT_ORGANIZER" | "ATTENDEE";
export type EventStatus = "Draft" | "Published" | "Open" | "Closed" | "Ongoing" | "Completed" | "Cancelled";
export type AttendanceStatus = "Present" | "Late" | "Absent" | "Checked Out";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AdminUser extends User {
  mobile?: string;
  status: "Active" | "Inactive";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  capacity: number;
  status: "Active" | "Inactive";
}

export interface Session {
  id: string;
  eventId: string;
  name: string;
  speaker: string;
  description: string;
  startTime: string;
  endTime: string;
  room: string;
  attendanceRate: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  venueId: string;
  venueName: string;
  organizer: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  capacity: number;
  registrations: number;
  status: EventStatus;
  bannerUrl: string;
  sessions: Session[];
}

export interface Attendee {
  id: string;
  registrationId: string;
  eventId: string;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  registrationDate: string;
  attendanceStatus: AttendanceStatus;
  qrToken: string;
}

export interface MetricCard {
  label: string;
  value: string;
  delta: string;
}

export interface Activity {
  id: string;
  label: string;
  detail: string;
  time: string;
}
