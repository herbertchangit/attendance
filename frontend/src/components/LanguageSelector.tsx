import { Languages } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useLanguageStore, type Language } from "../store/languageStore";
import { cn } from "../lib/cn";

export function LanguageSelector({ className }: { className?: string }) {
  const user = useAuthStore((state) => state.user);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <label className={cn("flex h-10 items-center gap-2 rounded-md border border-border bg-white px-2 dark:bg-muted", className)}>
      <Languages className="h-4 w-4 text-slate-500" />
      <span className="sr-only">Language</span>
      <select
        className="min-w-0 bg-transparent text-sm font-medium outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language, user?.id)}
        aria-label="Language"
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </label>
  );
}
