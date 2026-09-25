import { Fragment, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sb } from "@/lib/supabase";
import { TIPO_LABEL, agrupar, fmt, fmtDia, fmtFecha, parseNum } from "@/lib/obrador";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Estado, NumInput, Panel, Sparkline, useDatos, type Row } from "./comun";

function useRefrescar() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

const useStockMp = () => useDatos("v_stock_mp", () => sb().from("v_stock_mp").select("*").order("nombre"));
const useStockPt = () => useDatos("v_stock_pt", () => sb().from("v_stock_pt").select("*").order("nombre"));

/** Convierte kilos a gramos enteros con separador de miles (es-ES). */
const fmtG = (kg: number | null | undefined) => Math.round(Number(kg ?? 0) * 1000).toLocaleString("es-ES");

function Mensaje({ m }: { m: { ok: boolean; texto: string } | null }) {
  if (!m) return null;
  return <p className={`text-lg font-semibold ${m.ok ? "text-ok" : "text-brand-red"}`}>{m.texto}</p>;
}

/* ---------------- 1. Recuento ---------------- */
export function RecuentoTab() {
  const mp = useStockMp();
  const pt = useStockPt();
  const refrescar = useRefrescar();
  const [vMp, setVMp] = useState<Record<string, string>>({});
  const [vPt, setVPt] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (mp.data) setVMp(Object.fromEntries(mp.data.map((r) => [r.materia_prima_id, fmt(r.cantidad, 2)])));
  }, [mp.data]);
  useEffect(() => {
    if (pt.data) setVPt(Object.fromEntries(pt.data.map((r) => [r.elaboracion_id, fmt(r.kg, 2)])));
  }, [pt.data]);

  async function guardar() {
    setMsg(null);
    const p_mp: Record<string, number> = {};
    const p_pt: Record<string, number> = {};
    for (const r of mp.data ?? []) {
      const n = parseNum((vMp[r.materia_prima_id] ?? "").replace(/\./g, (m, o, s) => (s.includes(",") ? "" : m)));
      if (n === null) return setMsg({ ok: false, texto: `Falta un valor válido para ${r.nombre}` });
      p_mp[r.materia_prima_id] = n;
    }
    for (const r of pt.data ?? []) {
      const n = parseNum((vPt[r.elaboracion_id] ?? "").replace(/\./g, (m, o, s) => (s.includes(",") ? "" : m)));
      if (n === null) return setMsg({ ok: false, texto: `Falta un valor válido para ${r.nombre}` });
      p_pt[r.elaboracion_id] = n;
    }
    setGuardando(true);
    const { error } = await sb().rpc("obrador_registrar_recuento", { p_mp, p_pt });
    setGuardando(false);
    if (error) return setMsg({ ok: false, texto: error.message });
    setMsg({ ok: true, texto: "Recuento guardado" });
    refrescar();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel titulo="Materias primas" nota="Corrige el valor estimado con lo que cuentes">
          <Estado q={mp} vacio="No hay materias primas">
            {[...(mp.data ?? [])]
              .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), "es"))
              .map((r) => (
                <div key={r.materia_prima_id} className="flex items-center justify-between gap-2 border-t border-border py-2">
                  <div>
                    <p className="text-base font-medium">{r.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Actualizado {fmtFecha(r.ultimo_recuento_at)} por {r.ultimo_recuento_por ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumInput value={vMp[r.materia_prima_id] ?? ""} onChange={(v) => setVMp({ ...vMp, [r.materia_prima_id]: v })} />
                    <span className="w-8 text-sm text-muted-foreground">{r.unidad}</span>
                  </div>
                </div>
              ))}
          </Estado>
        </Panel>
        <Panel titulo="Producto terminado" nota="Kg en el obrador">
          <Estado q={pt} vacio="No hay producto terminado">
            {[...(pt.data ?? [])]
              .sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), "es"))
              .map((r) => (
                <div key={r.elaboracion_id} className="flex items-center justify-between gap-2 border-t border-border py-2">
                  <div>
                    <p className="text-base font-medium">{r.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Actualizado {fmtFecha(r.ultimo_recuento_at)} por {r.ultimo_recuento_por ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumInput value={vPt[r.elaboracion_id] ?? ""} onChange={(v) => setVPt({ ...vPt, [r.elaboracion_id]: v })} />
                    <span className="w-8 text-sm text-muted-foreground">kg</span>
                  </div>
                </div>
              ))}
          </Estado>
        </Panel>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button className="h-14 px-10 text-xl" disabled={guardando || !mp.data || !pt.data} onClick={guardar}>
          {guardando ? "Guardando…" : "Guardar recuento"}
        </Button>
        <Mensaje m={msg} />
      </div>
    </div>
  );
}

/* ---------------- 2. Producción ---------------- */
export function ProduccionTab() {
  const sug = useDatos("v_obrador_sugerencia", () => sb().from("v_obrador_sugerencia").select("*").order("nombre"));
  const hist = useDatos("v_obrador_historial", () => sb().from("v_obrador_historial").select("*").order("semana"));
  const periodo = useDatos("v_obrador_ventas_periodo", () => sb().from("v_obrador_ventas_periodo").select("*"));
  const refrescar = useRefrescar();
  const [prod, setProd] = useState<Record<string, string>>({});
  const [abierta, setAbierta] = useState<string | null>(null);
  const [confirmar, setConfirmar] = useState(false);
  const [notas, setNotas] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const historial = useMemo(() => {
    const m: Record<string, number[]> = {};
    for (const h of hist.data ?? []) (m[h.elaboracion_id] ??= []).push(Number(h.kg));
    for (const k in m) m[k] = m[k]!.slice(-8);
    return m;
  }, [hist.data]);

  const lineas = useMemo(
    () =>
      (sug.data ?? [])
        .map((r) => ({ id: r.elaboracion_id as string, nombre: r.nombre as string, kg: parseNum(prod[r.elaboracion_id] ?? "") ?? 0 }))
        .filter((l) => l.kg > 0),
    [sug.data, prod],
  );

  async function cerrar() {
    setGuardando(true);
    const p_produccion = Object.fromEntries(lineas.map((l) => [l.id, l.kg]));
    const { error } = await sb().rpc("obrador_cerrar_tanda", { p_produccion, p_notas: notas.trim() || null });
    setGuardando(false);
    setConfirmar(false);
    if (error) return setMsg({ ok: false, texto: error.message });
    setMsg({ ok: true, texto: "Tanda cerrada" });
    setProd({});
    setNotas("");
    refrescar();
  }

  return (
    <Panel titulo="Producción" nota="Pulsa una fila para ver el detalle por tienda">
      <Estado q={sug} vacio="No hay sugerencias de producción">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-2">Elaboración</th>
                <th className="pb-2 text-right">Vendido desde último cierre (kg)</th>
                <th className="pb-2 text-right">Stock obrador (kg)</th>
                <th className="pb-2 text-right">Stock tiendas (kg)</th>
                <th className="pb-2 text-right">Sugerido (kg)</th>
                <th className="pb-2 pl-3">Historial</th>
                <th className="pb-2 text-right">Producido (kg)</th>
              </tr>
            </thead>
            <tbody>
              {agrupar(sug.data ?? [], (r) => r.tipo).map(([tipo, rows]) => (
                <Fragment key={tipo}>
                  <tr>
                    <td colSpan={7} className="pt-4 pb-1 text-sm font-semibold uppercase tracking-wide text-primary">
                      {TIPO_LABEL[tipo] ?? tipo}
                    </td>
                  </tr>
                  {rows.map((r) => {
                    const destacar = Number(r.kg_sugeridos) > 0;
                    const detalle = (periodo.data ?? []).filter((p) => p.elaboracion_id === r.elaboracion_id);
                    return (
                      <Fragment key={r.elaboracion_id}>
                        <tr
                          onClick={() => setAbierta(abierta === r.elaboracion_id ? null : r.elaboracion_id)}
                          className={`cursor-pointer border-t border-border ${destacar ? "bg-primary/15" : ""}`}
                        >
                          <td className="py-2 pl-2 text-base font-medium">
                            {abierta === r.elaboracion_id ? "▾ " : "▸ "}
                            {r.nombre}
                          </td>
                          <td className="py-2 text-right tabular-nums">{fmt(r.kg_vendidos)}</td>
                          <td className="py-2 text-right tabular-nums">{fmt(r.kg_stock_obrador)}</td>
                          <td className="py-2 text-right tabular-nums">{fmt(r.kg_stock_tiendas)}</td>
                          <td className={`py-2 text-right text-lg font-bold tabular-nums ${destacar ? "text-primary" : ""}`}>
                            {fmt(r.kg_sugeridos)}
                          </td>
                          <td className="py-2 pl-3">
                            <Sparkline valores={historial[r.elaboracion_id] ?? []} />
                          </td>
                          <td className="py-2 pr-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <NumInput
                              value={prod[r.elaboracion_id] ?? ""}
                              onChange={(v) => setProd({ ...prod, [r.elaboracion_id]: v })}
                              className="ml-auto"
                            />
                          </td>
                        </tr>
                        {abierta === r.elaboracion_id ? (
                          <tr className="bg-secondary/50">
                            <td colSpan={7} className="px-4 py-3">
                              {detalle.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin ventas por tienda en este periodo</p>
                              ) : (
                                <table className="w-full text-sm">
                                  <thead className="text-muted-foreground">
                                    <tr>
                                      <th className="text-left">Tienda</th>
                                      <th className="text-right">Tienda (kg)</th>
                                      <th className="text-right">Web (kg)</th>
                                      <th className="text-right">Por entregar (kg)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {detalle.map((d) => (
                                      <tr key={d.store_id}>
                                        <td>{d.tienda}</td>
                                        <td className="text-right tabular-nums">{fmt(d.kg_tienda)}</td>
                                        <td className="text-right tabular-nums">{fmt(d.kg_web)}</td>
                                        <td className="text-right tabular-nums">{fmt(d.kg_por_entregar)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button className="h-14 px-10 text-xl" onClick={() => { setMsg(null); setConfirmar(true); }}>
            Cerrar tanda
          </Button>
          <Mensaje m={msg} />
        </div>
      </Estado>

      <Dialog open={confirmar} onOpenChange={setConfirmar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cerrar la tanda?</DialogTitle>
          </DialogHeader>
          {lineas.length === 0 ? (
            <p className="text-muted-foreground">No has anotado producción. Se cerrará la tanda sin producción.</p>
          ) : (
            <ul className="space-y-1">
              {lineas.map((l) => (
                <li key={l.id} className="flex justify-between text-base">
                  <span>{l.nombre}</span>
                  <span className="font-bold tabular-nums">{fmt(l.kg)} kg</span>
                </li>
              ))}
            </ul>
          )}
          <Textarea placeholder="Notas (opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} />
          <DialogFooter>
            <Button className="h-12 w-full text-lg" disabled={guardando} onClick={cerrar}>
              {guardando ? "Cerrando…" : "Confirmar cierre"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

/* ---------------- 3. Enviar a tienda ---------------- */
export function EnviarTab() {
  const tiendas = useDatos("tiendas", () => sb().from("tiendas").select("id, nombre").order("nombre"));
  const pt = useStockPt();
  const envios = useDatos("envios", async () => {
    const t = await sb()
      .from("traspasos")
      .select("id, store_id, estado, created_at, enviado_email, recibido_at, recibido_email, nota")
      .order("created_at", { ascending: false })
      .limit(20);
    if (t.error) return t;
    const ids = (t.data ?? []).map((x) => x.id);
    const [l, e] = await Promise.all([
      ids.length
        ? sb().from("traspaso_lineas").select("traspaso_id, elaboracion_id, kg_enviados, kg_recibidos").in("traspaso_id", ids)
        : Promise.resolve({ data: [], error: null }),
      sb().from("elaboraciones").select("id, nombre"),
    ]);
    if (l.error) return l;
    if (e.error) return e;
    const nombres = Object.fromEntries((e.data ?? []).map((x: Row) => [x.id, x.nombre]));
    return {
      data: (t.data ?? []).map((x) => ({
        ...x,
        lineas: (l.data ?? []).filter((y: Row) => y.traspaso_id === x.id).map((y: Row) => ({ ...y, nombre: nombres[y.elaboracion_id] ?? y.elaboracion_id })),
      })),
      error: null,
    };
  });
  const refrescar = useRefrescar();
  const [tienda, setTienda] = useState<string>("");
  const [gr, setGr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const nombreTienda = Object.fromEntries((tiendas.data ?? []).map((t) => [String(t.id), t.nombre]));

  async function enviar() {
    setMsg(null);
    if (!tienda) return setMsg({ ok: false, texto: "Elige una tienda" });
    const p_lineas: Record<string, number> = {};
    for (const [id, v] of Object.entries(gr)) {
      const sinPuntos = v.trim().replace(/\./g, "");
      if (sinPuntos === "") continue;
      if (!/^\d+$/.test(sinPuntos)) return setMsg({ ok: false, texto: "Escribe los gramos sin decimales" });
      const g = Number(sinPuntos);
      if (g > 0) p_lineas[id] = g / 1000;
    }
    if (!Object.keys(p_lineas).length) return setMsg({ ok: false, texto: "Escribe los gramos a enviar" });
    setGuardando(true);
    const store = (tiendas.data ?? []).find((t) => String(t.id) === tienda)?.id ?? tienda;
    const { error } = await sb().rpc("obrador_enviar_a_tienda", { p_store_id: store, p_lineas });
    setGuardando(false);
    if (error) return setMsg({ ok: false, texto: error.message });
    setMsg({ ok: true, texto: "Envío registrado" });
    setGr({});
    refrescar();
  }

  const badge = (e: string) =>
    e === "recibido" ? "bg-ok text-background" : e === "incidencia" ? "bg-brand-red text-foreground" : "bg-warn text-background";

  return (
    <div className="space-y-5">
      <Panel titulo="Enviar a tienda">
        <Estado q={tiendas} vacio="No hay tiendas">
          <Select value={tienda} onValueChange={setTienda}>
            <SelectTrigger className="h-12 w-72 text-lg">
              <SelectValue placeholder="Elige tienda" />
            </SelectTrigger>
            <SelectContent>
              {(tiendas.data ?? []).map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>{t.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Estado>
        <div className="mt-4">
          <Estado q={pt} vacio="No hay elaboraciones">
            <div className="grid gap-x-8 lg:grid-cols-2">
              {(pt.data ?? []).map((r) => (
                <div key={r.elaboracion_id} className="flex items-center justify-between gap-2 border-t border-border py-2">
                  <div>
                    <p className="text-base font-medium">{r.nombre}</p>
                    <p className="text-sm text-muted-foreground">En obrador: {fmtG(r.kg)} g</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      inputMode="numeric"
                      value={gr[r.elaboracion_id] ?? ""}
                      placeholder="0"
                      onChange={(e) => setGr({ ...gr, [r.elaboracion_id]: e.target.value.replace(/[^\d.,]/g, "") })}
                      className="h-12 w-32 text-right text-lg tabular-nums"
                    />
                    <span className="w-6 text-sm text-muted-foreground">g</span>
                  </div>
                </div>
              ))}
            </div>
          </Estado>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button className="h-14 px-10 text-xl" disabled={guardando} onClick={enviar}>
            {guardando ? "Registrando…" : "Registrar envío"}
          </Button>
          <Mensaje m={msg} />
        </div>
      </Panel>

      <Panel titulo="Últimos envíos">
        <Estado q={envios} vacio="Aún no hay envíos">
          <div className="space-y-3">
            {(envios.data ?? []).map((t) => (
              <div key={t.id} className="rounded-lg bg-secondary/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-semibold">
                    {nombreTienda[String(t.store_id)] ?? t.store_id} · {fmtFecha(t.created_at)} · {t.enviado_email ?? "—"}
                  </span>
                  <Badge className={badge(t.estado)}>{t.estado}</Badge>
                </div>
                {t.recibido_at ? (
                  <p className="text-sm text-muted-foreground">Recibido {fmtFecha(t.recibido_at)} por {t.recibido_email ?? "—"}</p>
                ) : null}
                {t.nota ? <p className="text-sm italic text-muted-foreground">{t.nota}</p> : null}
                <ul className="mt-1 text-sm">
                  {(t.lineas as Row[]).map((l, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{l.nombre}</span>
                      <span className="tabular-nums">
                        {fmtG(l.kg_enviados)} g{l.kg_recibidos != null ? ` · recibidos ${fmtG(l.kg_recibidos)} g` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Estado>
      </Panel>
    </div>
  );
}

/* ---------------- 4. Stock ---------------- */
export function StockTab() {
  const mp = useStockMp();
  const pt = useStockPt();
  const st = useDatos("v_stock_tiendas", () => sb().from("v_stock_tiendas").select("*").order("nombre"));
  const refrescar = useRefrescar();
  const [dialogo, setDialogo] = useState<Row | null>(null);
  const [valor, setValor] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function guardarEntrada() {
    const n = parseNum(valor);
    if (n === null || n <= 0) return setError("Cantidad no válida");
    const { error } = await sb().from("stock_mp").insert({ materia_prima_id: dialogo!.materia_prima_id, tipo: "entrada", cantidad: n });
    if (error) return setError(error.message);
    setDialogo(null);
    setValor("");
    refrescar();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel titulo="Obrador · materia prima">
          <Estado q={mp} vacio="Sin datos">
            {(mp.data ?? []).map((r) => (
              <div key={r.materia_prima_id} className="flex items-center justify-between gap-2 border-t border-border py-2">
                <div>
                  <p className="text-base font-medium">{r.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    Actualizado {fmtFecha(r.ultimo_recuento_at)} por {r.ultimo_recuento_por ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tabular-nums">{fmt(r.cantidad)} {r.unidad}</span>
                  <Button variant="secondary" className="h-11" onClick={() => { setError(null); setValor(""); setDialogo(r); }}>
                    + Entrada
                  </Button>
                </div>
              </div>
            ))}
          </Estado>
        </Panel>
        <Panel titulo="Obrador · producto terminado">
          <Estado q={pt} vacio="Sin datos">
            {(pt.data ?? []).map((r) => (
              <div key={r.elaboracion_id} className="flex items-center justify-between border-t border-border py-2">
                <div>
                  <p className="text-base font-medium">{r.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    Actualizado {fmtFecha(r.ultimo_recuento_at)} por {r.ultimo_recuento_por ?? "—"}
                  </p>
                </div>
                <span className="text-lg font-bold tabular-nums">{fmt(r.kg)} kg</span>
              </div>
            ))}
          </Estado>
        </Panel>
      </div>
      <Panel titulo="Tiendas" nota="Stock estimado = recibido + en camino − gastado">
        <Estado q={st} vacio="Sin datos de tiendas">
          <div className="grid gap-4 lg:grid-cols-2">
            {agrupar(st.data ?? [], (r) => r.tienda).map(([tienda, rows]) => (
              <div key={tienda} className="rounded-lg bg-secondary/60 p-3">
                <p className="mb-2 text-lg font-semibold text-primary">{tienda}</p>
                {rows.map((r) => {
                  const est = Number(r.kg_recibidos) + Number(r.kg_en_camino) - Number(r.kg_gastados);
                  return (
                    <div key={r.elaboracion_id} className="flex justify-between border-t border-border py-1.5">
                      <span>{r.nombre}</span>
                      <span className={`font-bold tabular-nums ${est <= 0 ? "text-brand-red" : ""}`}>{fmt(est)} kg</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Estado>
      </Panel>

      <Dialog open={dialogo !== null} onOpenChange={(v) => !v && setDialogo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar entrada · {dialogo?.nombre}</DialogTitle>
          </DialogHeader>
          <label className="text-sm text-muted-foreground">Cantidad recibida ({dialogo?.unidad})</label>
          <input
            autoFocus
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            className="h-14 rounded-md border border-input bg-transparent px-3 text-2xl"
          />
          {error ? <p className="font-semibold text-brand-red">{error}</p> : null}
          <DialogFooter>
            <Button className="h-12 w-full text-lg" onClick={guardarEntrada}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- 5. Compras ---------------- */
export function ComprasTab() {
  const q = useDatos("v_obrador_compras", () => sb().from("v_obrador_compras").select("*").order("nombre"));
  const faltan = (q.data ?? []).filter((r) => Number(r.faltan) > 0);
  const cubiertas = (q.data ?? []).filter((r) => !(Number(r.faltan) > 0));
  return (
    <Panel titulo="Compras" nota="Informativo: decide el encargado">
      <Estado q={q} vacio="Sin datos de compras">
        {faltan.length === 0 ? <p className="text-lg text-ok">Todo cubierto</p> : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {faltan.map((r) => (
            <div key={r.materia_prima_id} className="rounded-lg border border-brand-red/60 bg-brand-red/10 p-3">
              <p className="text-base font-semibold">{r.nombre}</p>
              <p className="text-xl font-bold text-brand-red">Faltan {fmt(r.faltan)} {r.unidad}</p>
              <p className="text-sm text-muted-foreground">
                Necesario {fmt(r.necesario)} · Stock {fmt(r.stock)} {r.unidad}
              </p>
            </div>
          ))}
        </div>
        {cubiertas.length ? (
          <Collapsible className="mt-5">
            <CollapsibleTrigger asChild>
              <Button variant="secondary" className="h-11">Cubiertas ({cubiertas.length}) ▾</Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {cubiertas.map((r) => (
                <div key={r.materia_prima_id} className="flex justify-between border-t border-border py-1.5">
                  <span>{r.nombre}</span>
                  <span className="tabular-nums text-muted-foreground">
                    Necesario {fmt(r.necesario)} · Stock {fmt(r.stock)} {r.unidad} · <span className="text-ok">OK</span>
                  </span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </Estado>
    </Panel>
  );
}

/* ---------------- 6. Desviación ---------------- */
export function DesviacionTab() {
  const q = useDatos("v_obrador_desviacion", () => sb().from("v_obrador_desviacion").select("*").order("nombre"));
  const filas = (q.data ?? []).filter((r) => !(Number(r.teorico) === 0 && Number(r.real) === 0));
  const primera = filas[0];
  return (
    <Panel
      titulo="Desviación de receta"
      nota={primera ? `Periodo ${fmtDia(primera.desde)} – ${fmtDia(primera.hasta)}` : undefined}
    >
      <Estado q={q}>
        {filas.length === 0 ? (
          <p className="py-6 text-lg text-muted-foreground">Hacen falta al menos dos recuentos para calcular la desviación</p>
        ) : (
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
              {filas.map((r) => {
                const t = Number(r.teorico);
                const desv = t === 0 ? null : ((Number(r.real) - t) / t) * 100;
                const abs = desv === null ? Infinity : Math.abs(desv);
                const color = abs < 5 ? "text-ok" : abs <= 15 ? "text-warn" : "text-brand-red";
                return (
                  <tr key={r.materia_prima_id} className="border-t border-border">
                    <td className="py-2 text-base">{r.nombre}</td>
                    <td className="py-2 text-right tabular-nums">{fmt(r.teorico)} {r.unidad}</td>
                    <td className="py-2 text-right tabular-nums">{fmt(r.real)} {r.unidad}</td>
                    <td className={`py-2 text-right text-lg font-bold tabular-nums ${color}`}>
                      {desv === null ? "sin teórico" : `${desv > 0 ? "+" : ""}${fmt(desv, 1)} %`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Estado>
    </Panel>
  );
}
