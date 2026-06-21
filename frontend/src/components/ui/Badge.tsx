import { cn } from "../../lib/cn";

export function Badge({ label, tone = "neutral" }: { label: string; tone?: "green" | "amber" | "red" | "blue" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "green" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
        tone === "amber" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
        tone === "red" && "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
        tone === "blue" && "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
        tone === "neutral" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      )}
    >
      {label}
    </span>
  );
}
