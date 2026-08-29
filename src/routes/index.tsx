import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  STOCK_MP_INICIAL,
  STOCK_PT_INICIAL,
  VENTAS_SEMANA_PASADA,
  calcularProduccion,
} from "@/lib/obrador";
import {
  IngredientesSection,
  ProduccionSection,
  StockSection,
  TendenciaSection,
  VentasSection,
} from "@/components/obrador/Secciones";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Obrador · Yo Llevo la Tarta" },
      {
        name: "description",
        content:
          "Panel de producción y stock del obrador: ventas, producción semanal, ingredientes, compras y control de desviación de receta.",
      },
      { property: "og:title", content: "Dashboard Obrador · Yo Llevo la Tarta" },
      {
        property: "og:description",
        content:
          "Gestión semanal de producción, materias primas y desviación de receta para el obrador.",
      },
    ],
  }),
  component: Dashboard,
});

const KEY = "yllt_obrador_v1";

type Estado = {
  stockMp: Record<string, number>;
  stockPt: Record<string, number>;
  actualizado: Record<string, string>;
};

const inicial: Estado = {
  stockMp: STOCK_MP_INICIAL,
  stockPt: STOCK_PT_INICIAL,
  actualizado: {},
};

function hoy() {
  return new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Dashboard() {
  const [estado, setEstado] = useState<Estado>(inicial);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Estado;
        setEstado({ ...inicial, ...parsed });
      } catch {
        /* datos corruptos: se usan los iniciales */
      }
    }
  }, []);

  function guardar(next: Estado) {
    setEstado(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const totalKg = calcularProduccion(VENTAS_SEMANA_PASADA).reduce((a, b) => a + b.kg, 0);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Yo Llevo la Tarta
          </span>
          <h1 className="text-lg font-bold sm:text-xl">Dashboard obrador</h1>
          <span className="text-sm text-muted-foreground">
            Jornada semanal · 7 h · {totalKg.toFixed(1)} kg a producir

          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1600px] flex-col gap-5 px-3 py-5 sm:px-6">
        <VentasSection />
        <ProduccionSection />
        <IngredientesSection />
        <StockSection
          stockMp={estado.stockMp}
          stockPt={estado.stockPt}
          actualizado={estado.actualizado}
          onEntradaMp={(id, cantidad) =>
            guardar({
              ...estado,
              stockMp: { ...estado.stockMp, [id]: (estado.stockMp[id] ?? 0) + cantidad },
              actualizado: { ...estado.actualizado, [id]: hoy() },
            })
          }
          onProduccionPt={(id, cantidad) =>
            guardar({
              ...estado,
              stockPt: { ...estado.stockPt, [id]: cantidad },
              actualizado: { ...estado.actualizado, [`pt_${id}`]: hoy() },
            })
          }
        />
        <TendenciaSection stockMp={estado.stockMp} />
      </main>
    </div>
  );
}
