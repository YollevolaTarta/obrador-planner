import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { sb } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Login } from "@/components/obrador/Login";
import { Cabecera } from "@/components/obrador/Cabecera";
import {
  ComprasTab,
  DesviacionTab,
  EnviarTab,
  ProduccionTab,
  RecuentoTab,
  StockTab,
} from "@/components/obrador/Pestanas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Obrador · Yo Llevo la Tarta" },
      {
        name: "description",
        content: "Recuento, producción, envíos a tienda, stock, compras y desviación de receta del obrador.",
      },
      { property: "og:title", content: "Dashboard Obrador · Yo Llevo la Tarta" },
      { property: "og:description", content: "Gestión diaria del obrador de Yo Llevo la Tarta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  const [listo, setListo] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const cliente = sb();
    cliente.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setListo(true);
    });
    const { data } = cliente.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        qc.clear();
      }
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, [qc]);

  if (!listo) return <div className="min-h-screen bg-background p-6 text-muted-foreground">Cargando…</div>;
  if (!session) return <Login />;
  return <Dashboard email={session.user.email ?? ""} />;
}

const PESTANAS = [
  ["recuento", "Recuento"],
  ["produccion", "Producción"],
  ["enviar", "Enviar a tienda"],
  ["stock", "Stock"],
  ["compras", "Compras"],
  ["desviacion", "Desviación"],
] as const;

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const permiso = useQuery({
    queryKey: ["permiso"],
    queryFn: async () => {
      const { data, error } = await sb().from("v_stock_mp").select("materia_prima_id").limit(1);
      return !error && (data ?? []).length > 0;
    },
  });

  if (permiso.isLoading) return <div className="min-h-screen bg-background p-6 text-muted-foreground">Cargando…</div>;
  if (!permiso.data)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="max-w-md text-xl font-semibold">
          Tu usuario no tiene permiso para el obrador. Habla con administración.
        </p>
        <Button variant="outline" className="h-11 rounded-lg px-6 shadow-none" onClick={() => sb().auth.signOut()}>
          Salir
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Cabecera email={email} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Tabs defaultValue="recuento" onValueChange={() => qc.invalidateQueries()}>
          <TabsList className="mb-5 flex h-auto w-full flex-wrap gap-1 rounded-xl bg-muted p-1">
            {PESTANAS.map(([v, l]) => (
              <TabsTrigger key={v} value={v} className="min-h-11 flex-1 rounded-lg border border-transparent text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none">
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="recuento"><RecuentoTab /></TabsContent>
          <TabsContent value="produccion"><ProduccionTab /></TabsContent>
          <TabsContent value="enviar"><EnviarTab /></TabsContent>
          <TabsContent value="stock"><StockTab /></TabsContent>
          <TabsContent value="compras"><ComprasTab /></TabsContent>
          <TabsContent value="desviacion"><DesviacionTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
