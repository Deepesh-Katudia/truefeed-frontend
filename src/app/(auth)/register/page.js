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
import authStyles from "../auth.module.css";
import Brand from "@/components/ui/Brand";

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
    <MainContainer className={authStyles.authRoot}>
      <Card className={authStyles.card}>
        <CardHeader className={authStyles.header}>
          <Brand as="h1" className={authStyles.brandTitle}>
            TrueFeed
          </Brand>
          <p className={authStyles.subtitle}>Create your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className={authStyles.form} noValidate>
            {error && (
              <div role="alert" className={authStyles.alert}>
                {error}
              </div>
            )}

            <div>
              <label className={authStyles.label} htmlFor="name">
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
              <label className={authStyles.label} htmlFor="email">
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
              <label className={authStyles.label} htmlFor="password">
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

            <div className={authStyles.actionsRow}>
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                loadingLabel="Creating..."
              >
                Register
              </Button>
              <a href={ROUTE_LOGIN} className={authStyles.link}>
                Already have an account?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
