import { useState } from "react";
import { sb } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    const { error } = await sb().auth.signInWithPassword({ email, password: pass });
    if (error) setError(error.message);
    setCargando(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-none">
        <p className="text-sm font-semibold text-foreground before:mb-4 before:block before:h-1 before:w-10 before:rounded-full before:bg-brand before:content-['']">Yo Llevo la Tarta</p>
        <h1 className="mt-2 text-lg font-semibold tracking-tight">Dashboard obrador</h1>
        <form onSubmit={entrar} className="mt-4 space-y-3">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-lg text-sm" />
          <Input type="password" required placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} className="h-11 rounded-lg text-sm" />
          {error ? <p className="text-sm font-medium text-alert">{error}</p> : null}
          <Button type="submit" disabled={cargando} className="h-11 w-full rounded-lg text-sm">
            {cargando ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
