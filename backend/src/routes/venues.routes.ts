import { Router } from "express";
import { z } from "zod";
import { auditLogs, createId, events, venues } from "../data/mockStore.js";
import { authenticate, authorize } from "../middleware/auth.js";

export const venuesRouter = Router();

venuesRouter.use(authenticate, authorize("SYSTEM_ADMIN", "EVENT_ORGANIZER"));

const venueSchema = z.object({
  name: z.string().trim().min(2),
  address: z.string().trim().min(2),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  country: z.string().trim().min(2),
  postalCode: z.string().trim().min(2),
  contactPerson: z.string().trim().min(2),
  contactNumber: z.string().trim().min(5),
  email: z.string().email(),
  capacity: z.number().int().positive(),
  status: z.enum(["Active", "Inactive"])
});

function recordAction(action: string, userId: string, venueId: string) {
  auditLogs.push({
    id: createId("audit"),
    userId,
    action,
    module: "Venues",
    entityId: venueId,
    createdAt: new Date().toISOString()
  });
}

venuesRouter.get("/", (_req, res) => res.json({ data: venues }));

venuesRouter.post("/", (req, res) => {
  const body = venueSchema.parse(req.body);
  if (venues.some((venue) => venue.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(409).json({ message: "A venue with this name already exists" });
  }
  const venue = { id: createId("ven"), ...body };
  venues.push(venue);
  recordAction("CREATE", req.user!.id, venue.id);
  return res.status(201).json({ data: venue });
});

venuesRouter.put("/:id", (req, res) => {
  const body = venueSchema.partial().parse(req.body);
  const index = venues.findIndex((venue) => venue.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Venue not found" });
  if (body.name && venues.some((venue) => venue.id !== req.params.id && venue.name.toLowerCase() === body.name!.toLowerCase())) {
    return res.status(409).json({ message: "A venue with this name already exists" });
  }
  venues[index] = { ...venues[index], ...body };
  recordAction("UPDATE", req.user!.id, venues[index].id);
  return res.json({ data: venues[index] });
});

venuesRouter.delete("/:id", (req, res) => {
  const index = venues.findIndex((venue) => venue.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Venue not found" });
  if (events.some((event) => event.venueId === req.params.id)) {
    return res.status(409).json({ message: "This venue is assigned to an event and cannot be deleted" });
  }
  const [deleted] = venues.splice(index, 1);
  recordAction("DELETE", req.user!.id, deleted.id);
  return res.status(204).send();
});
