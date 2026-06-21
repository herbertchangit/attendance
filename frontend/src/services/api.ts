import axios from "axios";
import { attendees, events, metrics, venues } from "../data/mockData";
import { useAuthStore } from "../store/authStore";
import type { AdminUser, Role, User, Venue } from "../types/domain";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:4000/api" : "/api"),
  timeout: 8000
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    return response.data;
  },
  async register(payload: { fullName: string; email: string; mobile: string; password: string }) {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  }
};

export interface UserMutation {
  name: string;
  email: string;
  mobile?: string;
  role: Role;
  status: AdminUser["status"];
  password?: string;
}

export const usersApi = {
  async list() {
    const response = await api.get<{ data: AdminUser[] }>("/users");
    return response.data.data;
  },
  async create(payload: UserMutation & { password: string }) {
    const response = await api.post<{ data: AdminUser }>("/users", payload);
    return response.data.data;
  },
  async update(id: string, payload: UserMutation) {
    const { password: _password, ...details } = payload;
    const response = await api.put<{ data: AdminUser }>(`/users/${id}`, details);
    return response.data.data;
  },
  async remove(id: string) {
    await api.delete(`/users/${id}`);
  },
  async resetPassword(id: string, newPassword: string) {
    await api.post(`/users/${id}/reset-password`, { newPassword });
  }
};

export type VenueMutation = Omit<Venue, "id">;

export const venuesApi = {
  async list() {
    const response = await api.get<{ data: Venue[] }>("/venues");
    return response.data.data;
  },
  async create(payload: VenueMutation) {
    const response = await api.post<{ data: Venue }>("/venues", payload);
    return response.data.data;
  },
  async update(id: string, payload: VenueMutation) {
    const response = await api.put<{ data: Venue }>(`/venues/${id}`, payload);
    return response.data.data;
  },
  async remove(id: string) {
    await api.delete(`/venues/${id}`);
  }
};

export const attendanceApi = {
  async dashboard() {
    return { metrics, events, venues, attendees };
  },
  async checkIn(qrToken: string) {
    const attendee = attendees.find((item) => item.qrToken === qrToken);
    if (!attendee) {
      throw new Error("QR code is invalid or registration is not active.");
    }
    return { ...attendee, attendanceStatus: "Present" as const, timestamp: new Date().toISOString() };
  },
  async checkOut(registrationId: string) {
    return { registrationId, status: "Checked Out", timestamp: new Date().toISOString() };
  }
};
