"use client";
import React, { useState } from "react";
import { apiAuth } from "@/api";
import { ROUTE_PROFILE, ROUTE_REGISTER } from "@/lib/paths";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Loader, { InlineLoader } from "@/components/ui/Loader";
import Input from "@/components/ui/Input";
import MainContainer from "@/components/ui/MainContainer";
import headerStyles from "@/styles/header.module.css";
import authStyles from "../auth.module.css";
import Brand from "@/components/ui/Brand";

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
    <MainContainer className={authStyles.authRoot}>
      <div className={authStyles.card}>
        <div className={authStyles.header}>
          <Brand as="h1" className={authStyles.brandTitle}>
            TrueFeed
          </Brand>
          <p className={authStyles.subtitle}>Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className={authStyles.form} noValidate>
          {error && (
            <div role="alert" className={authStyles.alert}>
              {error}
            </div>
          )}

          <div>
            <label className={authStyles.label} htmlFor="email">
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
            <label className={authStyles.label} htmlFor="password">
              Password
            </label>
            <div className={authStyles.passwordField}>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className={authStyles.hasToggle}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={authStyles.togglePassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={authStyles.actionsRow}>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              loadingLabel="Signing in..."
            >
              Login
            </Button>

            <a href={ROUTE_REGISTER} className={authStyles.link}>
              Create account
            </a>
          </div>
        </form>
      </div>
    </MainContainer>
  );
}
