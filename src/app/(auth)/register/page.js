"use client";
import React, { useState } from "react";
import { apiAuth } from "@/api";
import { ROUTE_PROFILE, ROUTE_LOGIN } from "@/lib/paths";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Loader, { InlineLoader } from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import MainContainer from "@/components/ui/MainContainer";
import Card, { CardHeader, CardContent } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValidating, setEmailValidating] = useState(false);

  function validateEmail(v) {
    setEmail(v);
    setEmailValidating(true);
    setTimeout(() => setEmailValidating(false), 400);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const r = await apiAuth.register({ name, email, password });
      if (r.ok) router.replace(ROUTE_PROFILE);
      else setError(r.error?.message || "Registration failed");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainContainer className="bg-slate-950 text-slate-100 px-4">
      <Card className="max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold tracking-tight">
            TrueFeed — Auth
          </h1>
          <p className="mt-1 text-sm text-slate-400">Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="rounded-md border border-red-700/50 bg-red-900/30 px-3 py-2 text-sm text-red-200"
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm mb-1" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                validating={emailValidating}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                loadingLabel="Creating..."
              >
                Register
              </Button>
              <a
                href={ROUTE_LOGIN}
                className="text-sm text-indigo-300 hover:underline"
              >
                Already have an account?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
