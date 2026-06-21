import { Router } from "express";
import { z } from "zod";
import { createId, events } from "../data/mockStore.js";
import { authenticate, authorize } from "../middleware/auth.js";

export const eventsRouter = Router();

eventsRouter.use(authenticate);

eventsRouter.get("/", (_req, res) => res.json({ data: events }));

eventsRouter.post("/", authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"), (req, res) => {
  const body = z.object({
    name: z.string().min(2),
    venueId: z.string().min(2),
    startDate: z.string(),
    endDate: z.string(),
    organizerId: z.string().min(2),
    registrations: z.number().int().nonnegative().default(0),
    status: z.enum(["Draft", "Published", "Open", "Closed", "Ongoing", "Completed", "Cancelled"])
  }).parse(req.body);
  const event = { id: createId("evt"), ...body };
  events.push(event);
  return res.status(201).json({ data: event });
});

eventsRouter.put("/:id", authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"), (req, res) => {
  const index = events.findIndex((event) => event.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });
  events[index] = { ...events[index], ...req.body };
  return res.json({ data: events[index] });
});

eventsRouter.delete("/:id", authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"), (req, res) => {
  const index = events.findIndex((event) => event.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });
  events.splice(index, 1);
  return res.status(204).send();
});
