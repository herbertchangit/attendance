import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { auditLogs, createId, users } from "../data/mockStore.js";
import { authenticate, authorize } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.use(authenticate, authorize("SYSTEM_ADMIN"));

const roleSchema = z.enum(["SYSTEM_ADMIN", "EVENT_ORGANIZER", "ATTENDEE"]);
const statusSchema = z.enum(["Active", "Inactive"]);

function publicUser(user: (typeof users)[number]) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function recordAction(action: string, userId: string, targetId: string) {
  auditLogs.push({
    id: createId("audit"),
    userId,
    action,
    module: "Users",
    entityId: targetId,
    createdAt: new Date().toISOString()
  });
}

usersRouter.get("/", (_req, res) => {
  return res.json({ data: users.map(publicUser) });
});

usersRouter.post("/", async (req, res) => {
  const body = z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    mobile: z.string().trim().min(8).optional().or(z.literal("")),
    role: roleSchema,
    status: statusSchema.default("Active"),
    password: z.string().min(8)
  }).parse(req.body);
  const email = body.email.toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const now = new Date().toISOString();
  const user = {
    id: createId("usr"),
    name: body.name,
    email,
    mobile: body.mobile || undefined,
    role: body.role,
    status: body.status,
    passwordHash: await bcrypt.hash(body.password, 10),
    createdAt: now,
    updatedAt: now
  };
  users.push(user);
  recordAction("CREATE", req.user!.id, user.id);
  return res.status(201).json({ data: publicUser(user) });
});

usersRouter.put("/:id", (req, res) => {
  const body = z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().email().optional(),
    mobile: z.string().trim().min(8).optional().or(z.literal("")),
    role: roleSchema.optional(),
    status: statusSchema.optional()
  }).parse(req.body);
  const user = users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (body.email && users.some((item) => item.id !== user.id && item.email.toLowerCase() === body.email!.toLowerCase())) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  if (user.id === req.user!.id && (body.status === "Inactive" || (body.role && body.role !== "SYSTEM_ADMIN"))) {
    return res.status(400).json({ message: "You cannot remove your own administrator access" });
  }

  Object.assign(user, {
    ...body,
    email: body.email?.toLowerCase() ?? user.email,
    mobile: body.mobile === "" ? undefined : body.mobile ?? user.mobile,
    updatedAt: new Date().toISOString()
  });
  recordAction("UPDATE", req.user!.id, user.id);
  return res.json({ data: publicUser(user) });
});

usersRouter.delete("/:id", (req, res) => {
  const index = users.findIndex((user) => user.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "User not found" });
  if (users[index].id === req.user!.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }
  const [deleted] = users.splice(index, 1);
  recordAction("DELETE", req.user!.id, deleted.id);
  return res.status(204).send();
});

usersRouter.post("/:id/reset-password", async (req, res) => {
  const body = z.object({ newPassword: z.string().min(8) }).parse(req.body);
  const user = users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.passwordHash = await bcrypt.hash(body.newPassword, 10);
  user.updatedAt = new Date().toISOString();
  recordAction("RESET_PASSWORD", req.user!.id, user.id);
  return res.json({ message: "Password reset successfully" });
});
