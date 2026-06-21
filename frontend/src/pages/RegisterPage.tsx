import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { LanguageSelector } from "../components/LanguageSelector";
import { authApi } from "../services/api";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(8),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});

export function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    setServerError("");
    try {
      const session = await authApi.register({
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        password: values.password
      });
      login(session.user, session.token, true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(axios.isAxiosError(error) && error.response?.status === 409
        ? "An account with this email already exists."
        : "Unable to create your account. Please try again.");
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center bg-background p-4 pt-16">
      <LanguageSelector className="absolute right-4 top-4" />
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-5 p-8">
          <div>
            <h1 className="text-xl font-semibold">Create attendee account</h1>
            <p className="text-sm text-slate-500">Register and manage your event participation.</p>
          </div>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm font-medium">Full Name</span>
              <Input {...register("fullName")} />
              {errors.fullName && <span className="text-xs text-rose-600">{errors.fullName.message}</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Email</span>
              <Input type="email" {...register("email")} />
              {errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Mobile Number</span>
              <Input {...register("mobile")} />
              {errors.mobile && <span className="text-xs text-rose-600">{errors.mobile.message}</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Password</span>
              <Input type="password" {...register("password")} />
              {errors.password && <span className="text-xs text-rose-600">{errors.password.message}</span>}
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Confirm Password</span>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <span className="text-xs text-rose-600">{errors.confirmPassword.message}</span>}
            </label>
            {serverError && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">{serverError}</p>}
            <Button className="sm:col-span-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create attendee account"}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500">
            Already registered? <Link className="font-medium text-primary" to="/login">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
