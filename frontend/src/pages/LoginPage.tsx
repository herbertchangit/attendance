import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CalendarDays, ClipboardCheck, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { LanguageSelector } from "../components/LanguageSelector";
import { authApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const demoAccounts = [
  { label: "Admin", email: "admin@eventflow.test", icon: ShieldCheck },
  { label: "Organizer", email: "organizer@eventflow.test", icon: CalendarDays },
  { label: "Attendee", email: "attendee@eventflow.test", icon: UserRound }
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@eventflow.test", password: "password123", remember: true }
  });
  const selectedEmail = watch("email");

  async function onSubmit(values: FormValues) {
    setServerError("");
    try {
      const session = await authApi.login(values.email, values.password);
      login(session.user, session.token, values.remember);
      const destination = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setServerError(axios.isAxiosError(error) && error.response?.status === 401
        ? "Email or password is incorrect."
        : "Unable to sign in. Check that the API is running and try again.");
    }
  }

  function selectDemoAccount(email: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "password123", { shouldValidate: true });
    setServerError("");
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-background p-4 pt-16">
      <LanguageSelector className="absolute right-4 top-4" />
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Sign in to EventFlow</h1>
              <p className="text-sm text-slate-500">Use your assigned account to continue.</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Demo account</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => selectDemoAccount(account.email)}
                  className={`flex h-16 flex-col items-center justify-center gap-1 rounded-md border text-xs font-medium transition ${selectedEmail === account.email ? "border-primary bg-primary/10 text-primary" : "border-border bg-white hover:bg-muted"}`}
                >
                  <account.icon className="h-4 w-4" />
                  {account.label}
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Email</span>
              <Input type="email" autoComplete="email" {...register("email")} />
              {errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">Password</span>
              <Input type="password" autoComplete="current-password" {...register("password")} />
              {errors.password && <span className="text-xs text-rose-600">{errors.password.message}</span>}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input className="h-4 w-4 accent-primary" type="checkbox" {...register("remember")} />
              Keep me signed in
            </label>
            {serverError && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500">
            New attendee? <Link className="font-medium text-primary" to="/register">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
