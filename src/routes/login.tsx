import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can now sign in.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-red-900 p-4" dir="ltr">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to site</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">{mode === "login" ? "Admin Sign In" : "Create Account"}</h1>
        <p className="text-sm text-muted-foreground mb-6">Noor Academy management portal</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-primary hover:bg-primary/90">
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="block w-full text-center text-sm text-primary mt-4 hover:underline">
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground text-center">
          New accounts have no admin privileges. Ask an existing admin to grant access (or run an SQL insert into <code>user_roles</code>).
        </p>
      </div>
    </div>
  );
}
