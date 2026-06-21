export type Role = "SYSTEM_ADMIN" | "EVENT_ORGANIZER" | "ATTENDEE";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
