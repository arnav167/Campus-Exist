import type { ReactNode } from "react";
import { Database, Search, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="page-header mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">CampusExist</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl leading-6 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

/** Honest banner: marks a feature that still needs the database connected. */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="mb-6 flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
      <Database className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
      <p><strong>Not connected yet:</strong> {children}</p>
    </div>
  );
}

export function SearchBar({ placeholder, filters }: { placeholder: string; filters?: string[] }) {
  return (
    <div className="mb-6 space-y-3">
      <label className="relative block">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input placeholder={placeholder} className="h-11 rounded-xl bg-card pl-9 shadow-sm shadow-slate-900/[0.02]" disabled />
      </label>
      {filters && (
        <div className="flex flex-wrap gap-2">
          {filters.map((f, i) => (
            <span key={f} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold", i === 0 ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="empty-state flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

const STATUS_STYLES = {
  available: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  lost: "bg-rose-100 text-rose-800 ring-rose-200",
  found: "bg-sky-100 text-sky-800 ring-sky-200",
  returned: "bg-violet-100 text-violet-800 ring-violet-200",
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS_STYLES }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset", STATUS_STYLES[status])}>{status}</span>;
}
