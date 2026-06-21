import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";

const demoAccounts = [
  ["admin@eventflow.test", "SYSTEM_ADMIN"],
  ["organizer@eventflow.test", "EVENT_ORGANIZER"],
  ["attendee@eventflow.test", "ATTENDEE"]
] as const;

async function login(email: string) {
  return request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ email, password: "password123" }));
}

describe("EventFlow API", () => {
  it("responds to health checks", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it.each(demoAccounts)("authenticates %s as %s", async (email, role) => {
    const response = await login(email);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect((response.body.user as { role: string }).role).toBe(role);
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ email: "admin@eventflow.test", password: "incorrect-password" }));
    expect(response.status).toBe(401);
  });

  it("prevents attendees from accessing venue management", async () => {
    const session = await login("attendee@eventflow.test");
    const response = await request(app)
      .post("/api/venues")
      .set("Authorization", `Bearer ${String(session.body.token)}`)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({}));
    expect(response.status).toBe(403);
  });

  it("allows organizers to create, edit, and delete venues", async () => {
    const session = await login("organizer@eventflow.test");
    const authorization = `Bearer ${String(session.body.token)}`;
    const venue = {
      name: "Lifecycle Convention Hall",
      address: "45 Jalan Lifecycle",
      city: "Shah Alam",
      state: "Selangor",
      country: "Malaysia",
      postalCode: "40100",
      contactPerson: "Venue Manager",
      contactNumber: "+60 12-888 7711",
      email: "lifecycle.venue@example.com",
      capacity: 800,
      status: "Active"
    };
    const created = await request(app)
      .post("/api/venues")
      .set("Authorization", authorization)
      .set("Content-Type", "application/json")
      .send(JSON.stringify(venue));
    expect(created.status).toBe(201);
    const venueId = String((created.body.data as { id: string }).id);

    const updated = await request(app)
      .put(`/api/venues/${venueId}`)
      .set("Authorization", authorization)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ capacity: 950, status: "Inactive" }));
    expect(updated.status).toBe(200);
    expect((updated.body.data as { capacity: number }).capacity).toBe(950);

    const deleted = await request(app)
      .delete(`/api/venues/${venueId}`)
      .set("Authorization", authorization);
    expect(deleted.status).toBe(204);
  });

  it("allows administrators to manage users and reset passwords", async () => {
    const session = await login("admin@eventflow.test");
    const authorization = `Bearer ${String(session.body.token)}`;
    const created = await request(app)
      .post("/api/users")
      .set("Authorization", authorization)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({
        name: "Lifecycle User",
        email: "lifecycle.user@eventflow.test",
        mobile: "+60 12-999 8899",
        role: "ATTENDEE",
        status: "Active",
        password: "temporary123"
      }));
    expect(created.status).toBe(201);
    const userId = String((created.body.data as { id: string }).id);

    const updated = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", authorization)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ role: "EVENT_ORGANIZER", status: "Inactive" }));
    expect(updated.status).toBe(200);
    expect((updated.body.data as { role: string }).role).toBe("EVENT_ORGANIZER");

    const reset = await request(app)
      .post(`/api/users/${userId}/reset-password`)
      .set("Authorization", authorization)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ newPassword: "replacement123" }));
    expect(reset.status).toBe(200);

    const deleted = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", authorization);
    expect(deleted.status).toBe(204);
  });
});
