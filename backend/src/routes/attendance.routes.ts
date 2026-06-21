import { Router } from "express";
import { z } from "zod";
import { attendees } from "../data/mockStore.js";
import { authenticate, authorize } from "../middleware/auth.js";

export const attendanceRouter = Router();

attendanceRouter.use(authenticate);

attendanceRouter.post("/checkin", authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"), (req, res) => {
  const body = z.object({ qrToken: z.string().min(5), sessionId: z.string().optional() }).parse(req.body);
  const attendee = attendees.find((item) => item.qrToken === body.qrToken);
  if (!attendee) return res.status(404).json({ message: "Attendee registration not found" });
  attendee.attendanceStatus = "Present";
  return res.json({ data: { ...attendee, checkedInAt: new Date().toISOString(), sessionId: body.sessionId } });
});

attendanceRouter.post("/checkout", authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"), (req, res) => {
  const body = z.object({ registrationId: z.string().min(3) }).parse(req.body);
  const attendee = attendees.find((item) => item.registrationId === body.registrationId);
  if (!attendee) return res.status(404).json({ message: "Attendee registration not found" });
  attendee.attendanceStatus = "Checked Out";
  return res.json({ data: { ...attendee, checkedOutAt: new Date().toISOString() } });
});

attendanceRouter.get("/report", (_req, res) => {
  const total = attendees.length;
  const attended = attendees.filter((item) => ["Present", "Late", "Checked Out"].includes(item.attendanceStatus)).length;
  return res.json({
    data: {
      totalRegistered: total,
      totalAttended: attended,
      totalAbsent: total - attended,
      attendancePercentage: total ? Math.round((attended / total) * 10000) / 100 : 0
    }
  });
});
