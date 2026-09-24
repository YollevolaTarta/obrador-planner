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
      <Card className="w-full max-w-md p-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Yo Llevo la Tarta</p>
        <h1 className="text-2xl font-bold">Dashboard obrador</h1>
        <form onSubmit={entrar} className="mt-4 space-y-3">
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-lg" />
          <Input type="password" required placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} className="h-12 text-lg" />
          {error ? <p className="font-semibold text-brand-red">{error}</p> : null}
          <Button type="submit" disabled={cargando} className="h-12 w-full text-lg">
            {cargando ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
