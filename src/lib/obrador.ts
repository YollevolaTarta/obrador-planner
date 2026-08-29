// Datos maestros, recetas y cálculos del obrador "Yo Llevo la Tarta".

export type Categoria = "Lácteos" | "Secos y harinas" | "Chocolates y saborizantes" | "Otros";

export type Ingrediente = {
  id: string;
  nombre: string;
  categoria: Categoria;
  unidad: "kg" | "L";
};

export const INGREDIENTES: Ingrediente[] = [
  { id: "leche", nombre: "Leche entera", categoria: "Lácteos", unidad: "kg" },
  { id: "nata", nombre: "Nata", categoria: "Lácteos", unidad: "kg" },
  { id: "yemas", nombre: "Yemas", categoria: "Lácteos", unidad: "kg" },
  { id: "queso_crema", nombre: "Queso crema", categoria: "Lácteos", unidad: "kg" },
  { id: "gorgonzola", nombre: "Gorgonzola", categoria: "Lácteos", unidad: "kg" },
  { id: "mantequilla", nombre: "Mantequilla", categoria: "Lácteos", unidad: "kg" },
  { id: "azucar", nombre: "Azúcar", categoria: "Secos y harinas", unidad: "kg" },
  { id: "azucar_glas", nombre: "Azúcar glas", categoria: "Secos y harinas", unidad: "kg" },
  { id: "maizena", nombre: "Maizena", categoria: "Secos y harinas", unidad: "kg" },
  { id: "galleta", nombre: "Galleta", categoria: "Secos y harinas", unidad: "kg" },
  {
    id: "choco_fundir",
    nombre: "Chocolate para fundir",
    categoria: "Chocolates y saborizantes",
    unidad: "kg",
  },
  {
    id: "choco_blanco",
    nombre: "Chocolate blanco",
    categoria: "Chocolates y saborizantes",
    unidad: "kg",
  },
  {
    id: "vainilla",
    nombre: "Vainilla en polvo",
    categoria: "Chocolates y saborizantes",
    unidad: "kg",
  },
  {
    id: "limon_liof",
    nombre: "Limón liofilizado",
    categoria: "Chocolates y saborizantes",
    unidad: "kg",
  },
  {
    id: "fruta_liof",
    nombre: "Fruta liofilizada",
    categoria: "Chocolates y saborizantes",
    unidad: "kg",
  },
  { id: "cafe", nombre: "Café soluble", categoria: "Chocolates y saborizantes", unidad: "kg" },
  { id: "matcha", nombre: "Matcha", categoria: "Chocolates y saborizantes", unidad: "kg" },
  { id: "fruta_fresca", nombre: "Fruta fresca", categoria: "Otros", unidad: "kg" },
  { id: "fruto_seco", nombre: "Fruto seco genérico", categoria: "Otros", unidad: "kg" },
  { id: "pistacho", nombre: "Pistacho", categoria: "Otros", unidad: "kg" },
  { id: "anacardo", nombre: "Anacardo", categoria: "Otros", unidad: "kg" },
  { id: "aceite_girasol", nombre: "Aceite de girasol", categoria: "Otros", unidad: "L" },
  { id: "bebida_vegetal", nombre: "Leche/bebida vegetal", categoria: "Otros", unidad: "L" },
];

export const INGREDIENTE_POR_ID = Object.fromEntries(INGREDIENTES.map((i) => [i.id, i]));

export const CATEGORIAS: Categoria[] = [
  "Lácteos",
  "Secos y harinas",
  "Chocolates y saborizantes",
  "Otros",
];

/** Receta: fracción de cada ingrediente sobre el peso total (suma 1). */
export type Receta = Record<string, number>;

export const RECETAS: Record<string, { nombre: string; receta: Receta }> = {
  crumble: {
    nombre: "Crumble",
    receta: { galleta: 0.65, mantequilla: 0.35 },
  },
  crema_vainilla: {
    nombre: "Crema vainilla",
    receta: { leche: 0.76, yemas: 0.12, azucar: 0.02, maizena: 0.07, vainilla: 0.03 },
  },
  crema_lemon: {
    nombre: "Crema lemon curd",
    receta: { leche: 0.76, yemas: 0.12, azucar: 0.02, maizena: 0.07, limon_liof: 0.03 },
  },
  crema_coulant: {
    nombre: "Crema coulant chocolate",
    receta: { leche: 0.7, yemas: 0.1, azucar: 0.01, maizena: 0.06, choco_fundir: 0.13 },
  },
  crema_basque: {
    nombre: "Crema basque cheesecake",
    receta: { leche: 0.7, yemas: 0.1, azucar: 0.01, maizena: 0.06, gorgonzola: 0.13 },
  },
  crema_ny: {
    nombre: "Crema NY cheesecake",
    receta: { queso_crema: 0.4, nata: 0.4, azucar: 0.2 },
  },
  mermelada: {
    nombre: "Mermelada (todos los sabores)",
    receta: { fruta_fresca: 0.65, azucar: 0.35 },
  },
  crema_frutos_secos: {
    nombre: "Crema de frutos secos",
    receta: { fruto_seco: 0.7, aceite_girasol: 0.2, azucar: 0.1 },
  },
  crema_pistacho: {
    nombre: "Crema de pistacho",
    receta: { pistacho: 0.5, anacardo: 0.2, aceite_girasol: 0.2, azucar: 0.1 },
  },
  ganache_frutas: {
    nombre: "Ganache de frutas",
    receta: { nata: 0.6, leche: 0.3, choco_blanco: 0.05, fruta_liof: 0.03, azucar_glas: 0.02 },
  },
  ganache_cafe: {
    nombre: "Ganache de café",
    receta: { nata: 0.85, choco_blanco: 0.1, cafe: 0.03, azucar_glas: 0.02 },
  },
  ganache_matcha: {
    nombre: "Ganache de matcha",
    receta: { nata: 0.85, choco_blanco: 0.1, matcha: 0.03, azucar_glas: 0.02 },
  },
};

export type FormatoId = "abierta" | "lata" | "shake";

export const FORMATOS: Record<
  FormatoId,
  { nombre: string; crumble_g: number; crema_g: number; topping_g: number; extras: Receta }
> = {
  abierta: {
    nombre: "Tarta abierta pequeña",
    crumble_g: 20,
    crema_g: 100,
    topping_g: 30,
    extras: {},
  },
  lata: { nombre: "Tarta en lata pequeña", crumble_g: 40, crema_g: 100, topping_g: 30, extras: {} },
  shake: {
    nombre: "Cake shake",
    crumble_g: 0,
    crema_g: 100,
    topping_g: 45,
    extras: { bebida_vegetal: 60 },
  },
};

/** Líneas de venta: crema base + formato + topping (elaboración) opcional. */
export type Venta = {
  cremaId: string;
  formato: FormatoId;
  toppingId?: string;
  unidades: number;
};

export const VENTAS_SEMANA_PASADA: Venta[] = [
  { cremaId: "crema_vainilla", formato: "abierta", toppingId: "ganache_cafe", unidades: 87 },
  { cremaId: "crema_coulant", formato: "abierta", toppingId: "crema_frutos_secos", unidades: 74 },
  { cremaId: "crema_lemon", formato: "abierta", toppingId: "mermelada", unidades: 63 },
  { cremaId: "crema_ny", formato: "abierta", toppingId: "ganache_frutas", unidades: 58 },
  { cremaId: "crema_basque", formato: "abierta", toppingId: "crema_pistacho", unidades: 41 },
  { cremaId: "crema_vainilla", formato: "lata", toppingId: "mermelada", unidades: 34 },
  { cremaId: "crema_coulant", formato: "lata", toppingId: "crema_pistacho", unidades: 28 },
  { cremaId: "crema_vainilla", formato: "shake", toppingId: "ganache_matcha", unidades: 31 },
  { cremaId: "crema_coulant", formato: "shake", toppingId: "ganache_cafe", unidades: 27 },
  { cremaId: "crema_vainilla", formato: "shake", toppingId: "ganache_matcha", unidades: 19 },
];

export function nombreProducto(cremaId: string) {
  const n = RECETAS[cremaId]?.nombre.replace("Crema ", "") ?? cremaId;
  return n.charAt(0).toUpperCase() + n.slice(1);
}

export function nombreElaboracion(id: string) {
  return RECETAS[id]?.nombre ?? id;
}


export const TENDENCIA: { cremaId: string; semanas: number[] }[] = [
  { cremaId: "crema_vainilla", semanas: [70, 75, 81, 87] },
  { cremaId: "crema_coulant", semanas: [80, 78, 74, 74] },
  { cremaId: "crema_lemon", semanas: [55, 58, 61, 63] },
  { cremaId: "crema_ny", semanas: [62, 60, 59, 58] },
  { cremaId: "crema_basque", semanas: [30, 34, 38, 41] },
];

export const STOCK_MP_INICIAL: Record<string, number> = {
  leche: 12,
  nata: 8,
  yemas: 1.2,
  queso_crema: 3,
  gorgonzola: 1,
  azucar: 4,
  azucar_glas: 0.5,
  maizena: 0.8,
  galleta: 6,
  mantequilla: 3,
  choco_fundir: 2,
  choco_blanco: 1.5,
  vainilla: 0.2,
  limon_liof: 0.15,
  fruta_liof: 0.3,
  fruta_fresca: 2,
  fruto_seco: 3,
  pistacho: 0.8,
  anacardo: 0.5,
  aceite_girasol: 1,
  cafe: 0.2,
  matcha: 0.3,
  bebida_vegetal: 3,
};

/** Stock anterior (antes de la última elaboración) para el control de desviación. */
export const STOCK_MP_ANTERIOR: Record<string, number> = {
  leche: 42,
  nata: 12,
  yemas: 5.4,
  queso_crema: 4,
  gorgonzola: 1.3,
  azucar: 5.2,
  azucar_glas: 0.6,
  maizena: 2.8,
  galleta: 9.2,
  mantequilla: 4.6,
  choco_fundir: 2.4,
  choco_blanco: 1.6,
  vainilla: 0.33,
  limon_liof: 0.24,
  fruta_liof: 0.32,
  fruta_fresca: 2,
  fruto_seco: 3,
  pistacho: 0.8,
  anacardo: 0.5,
  aceite_girasol: 1,
  cafe: 0.2,
  matcha: 0.35,
  bebida_vegetal: 4,
};

/** Kg producidos en la última elaboración (base teórica de la desviación). */
export const PRODUCIDO_ULTIMA_ELABORACION: Record<string, number> = {
  crema_vainilla: 15.2,
  crema_coulant: 12.9,
  crema_lemon: 6.3,
  crema_ny: 5.8,
  crema_basque: 4.1,
  crumble: 3.5,
};

export const PRODUCTOS_TERMINADOS = [
  "crema_vainilla",
  "crema_coulant",
  "crema_lemon",
  "crema_ny",
  "crema_basque",
  "crumble",
] as const;

export const STOCK_PT_INICIAL: Record<string, number> = {
  crema_vainilla: 3.5,
  crema_coulant: 2.8,
  crema_lemon: 2.1,
  crema_ny: 2.3,
  crema_basque: 1.4,
  crumble: 4.2,
};

/* ---------------- Cálculos ---------------- */

/** Producción de esta semana = ventas de los últimos 7 días. */
export function calcularProduccion(ventas: Venta[]) {
  return [...ventas].sort((a, b) => b.unidades - a.unidades);
}

/** Kg de producto semielaborado (cremas + crumble) necesarios. */
export function calcularSemielaborados(ventas: Venta[]) {
  const kg: Record<string, number> = {};
  for (const v of ventas) {
    const f = FORMATOS[v.formato];
    const cremaId = v.cremaId === "matcha_shake" ? "crema_vainilla" : v.cremaId;
    kg[cremaId] = (kg[cremaId] ?? 0) + (v.unidades * f.crema_g) / 1000;
    if (f.crumble_g > 0) kg['crumble'] = (kg['crumble'] ?? 0) + (v.unidades * f.crumble_g) / 1000;
  }
  return kg;
}

/** Kg de materia prima necesarios para la producción de la semana. */
export function calcularIngredientes(ventas: Venta[]) {
  const necesario: Record<string, number> = {};
  const semi = calcularSemielaborados(ventas);
  for (const [id, kg] of Object.entries(semi)) {
    const receta = RECETAS[id]?.receta ?? {};
    for (const [ing, pct] of Object.entries(receta)) {
      necesario[ing] = (necesario[ing] ?? 0) + kg * pct;
    }
  }
  // Extras del cake shake
  for (const v of ventas) {
    const f = FORMATOS[v.formato];
    for (const [ing, gramos] of Object.entries(f.extras)) {
      necesario[ing] = (necesario[ing] ?? 0) + (v.unidades * gramos) / 1000;
    }
    if (v.cremaId === "matcha_shake") {
      necesario['matcha'] = (necesario['matcha'] ?? 0) + (v.unidades * 2) / 1000;
    }
  }
  return necesario;
}

export function calcularDesviacion(
  stockAnterior: Record<string, number>,
  stockActual: Record<string, number>,
  producido: Record<string, number>,
) {
  const teorico: Record<string, number> = {};
  for (const [id, kg] of Object.entries(producido)) {
    for (const [ing, pct] of Object.entries(RECETAS[id]?.receta ?? {})) {
      teorico[ing] = (teorico[ing] ?? 0) + kg * pct;
    }
  }
  return Object.entries(teorico)
    .map(([ing, t]) => {
      const real = (stockAnterior[ing] ?? 0) - (stockActual[ing] ?? 0);
      const desv = t > 0 ? ((real - t) / t) * 100 : 0;
      return { ing, teorico: t, real, desv };
    })
    .sort((a, b) => Math.abs(b.desv) - Math.abs(a.desv));
}

export function tendenciaEstado(semanas: number[]) {
  const previa = semanas[semanas.length - 2] ?? 0;
  const ultima = semanas[semanas.length - 1] ?? 0;
  const delta = previa === 0 ? 0 : ((ultima - previa) / previa) * 100;
  if (delta > 2) return "sube" as const;
  if (delta < -2) return "baja" as const;
  return "estable" as const;
}

export function fmt(n: number, dec = 2) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
