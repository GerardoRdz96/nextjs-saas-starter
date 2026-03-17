"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getURL } from "@/lib/utils";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${getURL()}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleGitHubLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${getURL()}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-brand-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Get started with your free account"}
          </CardDescription>
        </CardHeader>

        {/* GitHub OAuth */}
        <Button
          variant="secondary"
          className="w-full mb-4"
          onClick={handleGitHubLogin}
          disabled={loading}
        >
          <Github className="h-5 w-5" />
          Continue with GitHub
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <Input
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error ?? undefined}
          />

          {message && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
