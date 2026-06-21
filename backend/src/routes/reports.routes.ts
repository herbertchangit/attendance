import { Router } from "express";
import { attendees, events, venues } from "../data/mockStore.js";
import { authenticate, authorize } from "../middleware/auth.js";

export const reportsRouter = Router();

reportsRouter.use(authenticate, authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"));

reportsRouter.get("/attendance", (_req, res) => {
  const attended = attendees.filter((item) => ["Present", "Late", "Checked Out"].includes(item.attendanceStatus)).length;
  res.json({ data: { totalRegistered: attendees.length, totalAttended: attended, totalAbsent: attendees.length - attended } });
});

reportsRouter.get("/events", (_req, res) => {
  res.json({ data: events.map((event) => ({ ...event, registrationConversion: Math.min(100, Math.round(event.registrations / 20)) })) });
});

reportsRouter.get("/venues", (_req, res) => {
  res.json({ data: venues.map((venue) => ({ ...venue, usageCount: events.filter((event) => event.venueId === venue.id).length })) });
});
