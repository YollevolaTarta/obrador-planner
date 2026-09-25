import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Row = any;

export function useDatos<T = Row[]>(key: string, fn: () => PromiseLike<{ data: any; error: any }>) {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const { data, error } = await fn();
      if (error) throw new Error(error.message);
      return (data ?? []) as T;
    },
  });
}

export function Estado({
  q,
  vacio,
  children,
}: {
  q: { isLoading: boolean; error: Error | null; data?: unknown };
  vacio?: string;
  children: ReactNode;
}) {
  if (q.isLoading) return <div className="space-y-3 py-2"><Skeleton className="h-11 w-full rounded-lg bg-muted" /><Skeleton className="h-11 w-full rounded-lg bg-muted" /><Skeleton className="h-11 w-3/4 rounded-lg bg-muted" /></div>;
  if (q.error)
    return <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-alert">Error: {q.error.message}</p>;
  if (vacio && Array.isArray(q.data) && q.data.length === 0)
    return <p className="py-8 text-center text-sm text-muted-foreground">{vacio}</p>;
  return <>{children}</>;
}

export function Panel({ titulo, nota, children }: { titulo: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <Card className="gap-0 rounded-2xl border border-border bg-card p-5 shadow-none sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{titulo}</h2>
        {nota ? <span className="text-xs text-muted-foreground">{nota}</span> : null}
      </div>
      {children}
    </Card>
  );
}

export function NumInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <Input
      inputMode="decimal"
      value={value}
      placeholder="0,00"
      onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
      className={`h-11 w-28 rounded-lg border-input text-right text-sm tabular-nums ${className}`}
    />
  );
}

export function Sparkline({ valores }: { valores: number[] }) {
  if (valores.length < 2) return <span className="text-xs text-muted-foreground">—</span>;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const puntos = valores
    .map((v, i) => `${(i / (valores.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-28 text-brand">
      <polyline points={puntos} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
