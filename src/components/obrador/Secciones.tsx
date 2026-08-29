import { useMemo, useState } from "react";
import {
  CATEGORIAS,
  FORMATOS,
  INGREDIENTES,
  INGREDIENTE_POR_ID,
  PRODUCTOS_TERMINADOS,
  PRODUCIDO_ULTIMA_ELABORACION,
  RECETAS,
  STOCK_MP_ANTERIOR,
  TENDENCIA,
  VENTAS_SEMANA_PASADA,
  calcularDesviacion,
  calcularIngredientes,
  calcularProduccion,
  calcularSemielaborados,
  fmt,
  nombreProducto,
  tendenciaEstado,
} from "@/lib/obrador";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SectionTitle({ n, title, note }: { n: number; title: string; note?: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="rounded-md bg-primary px-2 py-0.5 text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <h2 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">{title}</h2>
      {note ? <span className="text-sm text-muted-foreground">{note}</span> : null}
    </div>
  );
}

export function VentasSection() {
  const ventas = [...VENTAS_SEMANA_PASADA].sort((a, b) => b.unidades - a.unidades);
  const max = Math.max(...ventas.map((v) => v.unidades));
  return (
    <Card className="gap-0 p-4 sm:p-6">
      <SectionTitle n={1} title="Ventas semana pasada" />
      <div className="space-y-2">
        {ventas.map((v, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-base font-semibold sm:text-lg">
                  {nombreProducto(v.cremaId)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {FORMATOS[v.formato].nombre}
                  </span>
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(v.unidades / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-14 text-right text-xl font-bold tabular-nums">{v.unidades}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProduccionSection() {
  const produccion = calcularProduccion(VENTAS_SEMANA_PASADA);
  const semi = calcularSemielaborados(VENTAS_SEMANA_PASADA);
  return (
    <Card className="gap-0 p-4 sm:p-6">
      <SectionTitle
        n={2}
        title="Producción esta semana"
        note="Basado en ventas de los últimos 7 días"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <table className="w-full text-left">
            <thead className="text-sm uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-2">Qué producir</th>
                <th className="pb-2 text-right">Unidades</th>
              </tr>
            </thead>
            <tbody>
              {produccion.map((p, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 text-base font-medium sm:text-lg">
                    {nombreProducto(p.cremaId)}{" "}
                    <span className="text-sm text-muted-foreground">
                      · {FORMATOS[p.formato].nombre}
                    </span>
                  </td>
                  <td className="py-2 text-right text-lg font-bold tabular-nums">{p.unidades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">
            Elaboraciones a preparar
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(semi).map(([id, kg]) => (
              <div key={id} className="rounded-lg bg-secondary p-3">
                <p className="text-sm text-muted-foreground">{RECETAS[id]?.nombre ?? id}</p>
                <p className="text-xl font-bold tabular-nums">{fmt(kg)} kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function IngredientesSection() {
  const necesario = calcularIngredientes(VENTAS_SEMANA_PASADA);
  return (
    <Card className="gap-0 p-4 sm:p-6">
      <SectionTitle
        n={3}
        title="Ingredientes necesarios"
        note="Unidades a producir × receta × gramaje"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CATEGORIAS.map((cat) => {
          const items = INGREDIENTES.filter((i) => i.categoria === cat && (necesario[i.id] ?? 0) > 0);
          if (!items.length) return null;
          return (
            <div key={cat} className="rounded-lg bg-secondary/60 p-3">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {cat}
              </p>
              <ul className="space-y-1">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-2 text-base">
                    <span>{i.nombre}</span>
                    <span className="font-bold tabular-nums">
                      {(necesario[i.id] ?? 0) < 1
                        ? `${fmt((necesario[i.id] ?? 0) * 1000, 0)} g`
                        : `${fmt(necesario[i.id] ?? 0)} ${i.unidad}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function EntradaDialog({
  open,
  onOpenChange,
  titulo,
  etiqueta,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  titulo: string;
  etiqueta: string;
  onConfirm: (cantidad: number) => void;
}) {
  const [valor, setValor] = useState("");
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setValor("");
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <label className="text-sm text-muted-foreground">{etiqueta}</label>
        <Input
          autoFocus
          inputMode="decimal"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          className="h-14 text-2xl"
        />
        <DialogFooter>
          <Button
            className="h-12 w-full text-lg"
            onClick={() => {
              const n = parseFloat(valor.replace(",", "."));
              if (!isNaN(n)) onConfirm(n);
              setValor("");
              onOpenChange(false);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StockSection({
  stockMp,
  stockPt,
  actualizado,
  onEntradaMp,
  onProduccionPt,
}: {
  stockMp: Record<string, number>;
  stockPt: Record<string, number>;
  actualizado: Record<string, string>;
  onEntradaMp: (id: string, cantidad: number) => void;
  onProduccionPt: (id: string, cantidad: number) => void;
}) {
  const [dialogo, setDialogo] = useState<{ tipo: "mp" | "pt"; id: string } | null>(null);
  const necesario = useMemo(() => calcularIngredientes(VENTAS_SEMANA_PASADA), []);

  return (
    <Card className="gap-0 p-4 sm:p-6">
      <SectionTitle n={4} title="Stock y compras" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">4A · Stock actual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Ingrediente</th>
                  <th className="pb-2 text-right">Stock</th>
                  <th className="pb-2 text-right">Actualizado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {INGREDIENTES.map((i) => (
                  <tr key={i.id} className="border-t border-border">
                    <td className="py-2 text-base">{i.nombre}</td>
                    <td className="py-2 text-right font-bold tabular-nums">
                      {fmt(stockMp[i.id] ?? 0)} {i.unidad}
                    </td>
                    <td className="py-2 text-right text-sm text-muted-foreground">
                      {actualizado[i.id] ?? "—"}
                    </td>
                    <td className="py-2 pl-2 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setDialogo({ tipo: "mp", id: i.id })}
                      >
                        + Entrada
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-2 mt-6 text-lg font-semibold">Producto terminado</h3>
          <table className="w-full text-left">
            <tbody>
              {PRODUCTOS_TERMINADOS.map((id) => (
                <tr key={id} className="border-t border-border">
                  <td className="py-2 text-base">{RECETAS[id]?.nombre}</td>
                  <td className="py-2 text-right font-bold tabular-nums">
                    {fmt(stockPt[id] ?? 0)} kg
                  </td>
                  <td className="py-2 text-right text-sm text-muted-foreground">
                    {actualizado[`pt_${id}`] ?? "—"}
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setDialogo({ tipo: "pt", id })}
                    >
                      + Producción
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">
            4B · Qué comprar esta semana{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (informativo, decide el encargado)
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Ingrediente</th>
                  <th className="pb-2 text-right">Necesario</th>
                  <th className="pb-2 text-right">Stock</th>
                  <th className="pb-2 text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {INGREDIENTES.filter((i) => (necesario[i.id] ?? 0) > 0).map((i) => {
                  const nec = necesario[i.id] ?? 0;
                  const stock = stockMp[i.id] ?? 0;
                  const dif = stock - nec;
                  const falta = dif < 0;
                  return (
                    <tr key={i.id} className="border-t border-border">
                      <td className="py-2 text-base">{i.nombre}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(nec)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(stock)}</td>
                      <td
                        className={`py-2 text-right font-bold tabular-nums ${
                          falta ? "text-brand-red" : "text-ok"
                        }`}
                      >
                        {falta ? `Faltan ${fmt(-dif)} ${i.unidad}` : "OK"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EntradaDialog
        open={dialogo !== null}
        onOpenChange={(v) => !v && setDialogo(null)}
        titulo={
          dialogo?.tipo === "pt"
            ? `Registrar producción · ${dialogo ? RECETAS[dialogo.id]?.nombre : ""}`
            : `Registrar entrada · ${dialogo ? INGREDIENTE_POR_ID[dialogo.id]?.nombre : ""}`
        }
        etiqueta={
          dialogo?.tipo === "pt"
            ? "Peso producido (kg)"
            : `Cantidad recibida (${dialogo ? INGREDIENTE_POR_ID[dialogo.id]?.unidad : "kg"})`
        }
        onConfirm={(cantidad) => {
          if (!dialogo) return;
          if (dialogo.tipo === "mp") onEntradaMp(dialogo.id, cantidad);
          else onProduccionPt(dialogo.id, cantidad);
        }}
      />
    </Card>
  );
}

function Sparkline({ valores }: { valores: number[] }) {
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const puntos = valores
    .map((v, i) => {
      const x = (i / (valores.length - 1)) * 100;
      const y = 30 - ((v - min) / (max - min || 1)) * 26 - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-10 w-full">
      <polyline
        points={puntos}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TendenciaSection({ stockMp }: { stockMp: Record<string, number> }) {
  const desviaciones = calcularDesviacion(
    STOCK_MP_ANTERIOR,
    stockMp,
    PRODUCIDO_ULTIMA_ELABORACION,
  ).slice(0, 10);

  return (
    <Card className="gap-0 p-4 sm:p-6">
      <SectionTitle n={5} title="Tendencia y control" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">5A · Tendencia últimas 4 semanas</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {TENDENCIA.map((t) => {
              const estado = tendenciaEstado(t.semanas);
              const color =
                estado === "sube" ? "text-ok" : estado === "baja" ? "text-brand-red" : "text-warn";
              const flecha = estado === "sube" ? "↑" : estado === "baja" ? "↓" : "→";
              return (
                <div key={t.cremaId} className="rounded-lg bg-secondary/60 p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-semibold">{nombreProducto(t.cremaId)}</span>
                    <span className={`text-xl font-bold ${color}`}>
                      {flecha} {t.semanas[t.semanas.length - 1]}
                    </span>
                  </div>
                  <div className={color}>
                    <Sparkline valores={t.semanas} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {t.semanas.map((v, i) => (
                      <span key={i}>{v}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-lg font-semibold">5B · Control de desviación de receta</h3>
          <p className="mb-2 text-sm text-muted-foreground">
            Teórico (receta × producido) vs real (stock anterior − stock actual)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Ingrediente</th>
                  <th className="pb-2 text-right">Teórico</th>
                  <th className="pb-2 text-right">Real</th>
                  <th className="pb-2 text-right">Desviación</th>
                </tr>
              </thead>
              <tbody>
                {desviaciones.map((d) => {
                  const abs = Math.abs(d.desv);
                  const color =
                    abs < 5 ? "text-ok" : abs <= 15 ? "text-warn" : "text-brand-red";
                  return (
                    <tr key={d.ing} className="border-t border-border">
                      <td className="py-2 text-base">{INGREDIENTE_POR_ID[d.ing]?.nombre}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(d.teorico)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(d.real)}</td>
                      <td className={`py-2 text-right font-bold tabular-nums ${color}`}>
                        {d.desv > 0 ? "+" : ""}
                        {fmt(d.desv, 1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
