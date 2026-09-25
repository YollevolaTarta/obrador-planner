import { sb } from "@/lib/supabase";
import { fmtFecha } from "@/lib/obrador";
import { Button } from "@/components/ui/button";
import { useDatos, type Row } from "./comun";

export function Cabecera({ email }: { email: string }) {
  const tanda = useDatos("cab_tanda", () =>
    sb().from("tandas").select("cerrada_at, usuario_email").order("cerrada_at", { ascending: false }).limit(1),
  );
  const resumen = useDatos("cab_resumen", () => sb().from("v_obrador_resumen_ventas").select("*"));
  const sinEnlazar = useDatos("cab_sin_enlazar", () => sb().from("v_obrador_ventas_sin_enlazar").select("*"));
  const ultima = (tanda.data as Row[] | undefined)?.[0];

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-sm font-semibold text-foreground before:mr-2 before:inline-block before:h-2.5 before:w-2.5 before:rounded-full before:bg-brand before:content-['']">Yo Llevo la Tarta</span>
          <h1 className="text-sm font-normal text-muted-foreground">Dashboard obrador</h1>
        </div>
        <p className="text-sm">
          {tanda.isLoading
            ? "Cargando…"
            : ultima
              ? `Último cierre: ${fmtFecha(ultima.cerrada_at)} por ${ultima.usuario_email ?? "—"}`
              : "Aún no hay ningún cierre"}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{email}</span>
          <Button variant="outline" className="h-11 rounded-lg px-5 shadow-none" onClick={() => sb().auth.signOut()}>
            Salir
          </Button>
        </div>
      </div>
      <div className="mt-2 space-y-1 text-sm sm:text-sm">
        {(resumen.data ?? []).map((r: Row, i: number) => (
          <p key={i}>
            <span className="font-semibold text-foreground">{r.tienda}</span> · Tienda {r.tartas_tienda} · Web{" "}
            {r.tartas_web} (por entregar: {r.envios_por_entregar}) · Decoraciones sorpresa {r.decoraciones_sorpresa}
          </p>
        ))}
      </div>
      {(sinEnlazar.data ?? []).length > 0 ? (
        <div className="mt-2 rounded-xl border border-warning/40 bg-card px-4 py-3 text-sm font-medium text-warning">
          Hay ventas con sabores que no se reconocen:{" "}
          {(sinEnlazar.data as Row[]).map((r) => `${r.nombre_menu} (${r.veces})`).join(", ")}
        </div>
      ) : null}
    </header>
  );
}
