import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { createId, users } from "../data/mockStore.js";
import { authenticate } from "../middleware/auth.js";
import type { Role } from "../types.js";

export const authRouter = Router();
const tokenOptions: jwt.SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
};

authRouter.post("/login", async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body);
  const user = users.find((item) => item.email === body.email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.status !== "Active") return res.status(403).json({ message: "Account is inactive" });

  const passwordOk = await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordOk) return res.status(401).json({ message: "Invalid credentials" });

  user.lastLoginAt = new Date().toISOString();
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = jwt.sign(payload, env.JWT_SECRET, tokenOptions);
  return res.json({ token, user: payload });
});

authRouter.post("/register", async (req, res) => {
  const body = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().min(8),
    password: z.string().min(8)
  }).parse(req.body);

  if (users.some((item) => item.email.toLowerCase() === body.email.toLowerCase())) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const user = {
    id: createId("usr"),
    name: body.fullName,
    email: body.email.toLowerCase(),
    role: "ATTENDEE" as Role,
    mobile: body.mobile,
    passwordHash: await bcrypt.hash(body.password, 10),
    status: "Active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(user);
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = jwt.sign(payload, env.JWT_SECRET, tokenOptions);
  return res.status(201).json({ token, user: payload });
});

authRouter.get("/me", authenticate, (req, res) => res.json({ user: req.user }));
