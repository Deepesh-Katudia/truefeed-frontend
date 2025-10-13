"use client";
import React, { useState } from "react";
import { apiAuth } from "@/api";
import { ROUTE_PROFILE, ROUTE_REGISTER } from "@/lib/paths";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Loader, { InlineLoader } from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import MainContainer from "@/components/ui/MainContainer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidating, setEmailValidating] = useState(false);

  function validateEmail(v) {
    setEmail(v);
    setEmailValidating(true);
    // Simulate async validation
    setTimeout(() => setEmailValidating(false), 400);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const r = await apiAuth.login({ email, password });
      if (r.ok) router.replace(ROUTE_PROFILE);
      else setError(r.error?.message || "Login failed");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainContainer className="bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            TrueFeed — Auth
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue</p>
        </div>

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
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="pr-10"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 my-auto px-2 text-slate-400 hover:text-slate-200 text-xs"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              loadingLabel="Signing in..."
            >
              Login
            </Button>

            <a
              href={ROUTE_REGISTER}
              className="text-sm text-indigo-300 hover:underline"
            >
              Create account
            </a>
          </div>
        </form>
      </div>
    </MainContainer>
  );
}
