// Utilidades de formato (es-ES). Todos los cálculos los hace la base de datos.

export function fmt(n: number | null | undefined, dec = 2) {
  const v = Number(n ?? 0);
  return v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function fmtFecha(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDia(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Acepta coma o punto. Devuelve null si no es un número. */
export function parseNum(s: string): number | null {
  const t = s.trim().replace(",", ".");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function agrupar<T>(rows: T[], key: (r: T) => string) {
  const m = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r) || "Sin categoría";
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(r);
  }
  return [...m.entries()];
}

export const TIPO_LABEL: Record<string, string> = {
  crumble: "Crumble",
  crema: "Cremas",
  frutos_secos: "Frutos secos",
  mermelada: "Mermeladas",
  mousse: "Mousses",
};
