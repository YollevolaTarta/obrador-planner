import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
  if (q.isLoading) return <p className="py-6 text-lg text-muted-foreground">Cargando…</p>;
  if (q.error)
    return <p className="py-6 text-lg font-semibold text-brand-red">Error: {q.error.message}</p>;
  if (vacio && Array.isArray(q.data) && q.data.length === 0)
    return <p className="py-6 text-lg text-muted-foreground">{vacio}</p>;
  return <>{children}</>;
}

export function Panel({ titulo, nota, children }: { titulo: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <Card className="gap-0 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-xl font-bold text-primary sm:text-2xl">{titulo}</h2>
        {nota ? <span className="text-sm text-muted-foreground">{nota}</span> : null}
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
      className={`h-12 w-32 text-right text-lg tabular-nums ${className}`}
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
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-28 text-primary">
      <polyline points={puntos} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
