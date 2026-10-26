import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signUp } from "@/services/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — CampusExist" }, { name: "description", content: "Sign in or create your CampusExist student account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(mode: "signin" | "signup") {
    setBusy(true); setError(""); setMessage("");
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Enter your full name.");
        const result = await signUp({ fullName: name, email, password });
        if (!result.session) {
          setMessage("Account created. Check your email to confirm your account, then sign in.");
        } else {
          await navigate({ to: "/" });
        }
      } else {
        await signIn({ email, password });
        await navigate({ to: "/" });
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Authentication failed."); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-md">
    <h1 className="mb-1 text-3xl font-semibold">Welcome to CampusExist</h1>
    <p className="mb-6 text-muted-foreground">Use your college email to join.</p>
    {error && <p role="alert" className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
    {message && <p role="status" className="mb-4 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">{message}</p>}
    <Tabs defaultValue="signin" className="rounded-xl border bg-card p-5">
      <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
      <TabsContent value="signin" className="mt-4 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="si-email">College email</Label><Input id="si-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu" autoComplete="email" /></div>
        <div className="space-y-1.5"><Label htmlFor="si-pass">Password</Label><Input id="si-pass" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></div>
        <Button className="w-full" disabled={busy || !email || !password} onClick={()=>submit("signin")}>{busy ? "Please wait…" : "Sign in"}</Button>
      </TabsContent>
      <TabsContent value="signup" className="mt-4 space-y-4">
        <div className="space-y-1.5"><Label htmlFor="su-name">Full name</Label><Input id="su-name" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" /></div>
        <div className="space-y-1.5"><Label htmlFor="su-email">College email</Label><Input id="su-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@college.edu" autoComplete="email" /></div>
        <div className="space-y-1.5"><Label htmlFor="su-pass">Password (at least 6 characters)</Label><Input id="su-pass" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" /></div>
        <Button className="w-full" disabled={busy || !name.trim() || !email || password.length < 6} onClick={()=>submit("signup")}>{busy ? "Please wait…" : "Create account"}</Button>
      </TabsContent>
    </Tabs>
    <p className="mt-4 text-center text-sm text-muted-foreground"><Link to="/" className="underline">Back to CampusExist</Link></p>
  </div>;
}
