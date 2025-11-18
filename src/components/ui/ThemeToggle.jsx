"use client";
import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

function getInitialTheme() {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "system";
}

function applyTheme(theme) {
  const root = document.documentElement; // <html>
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  root.classList.toggle("dark", isDark);
}

export default function ThemeToggle({ className = "" }) {
  const pathname = usePathname();
  const hideOnAuth = useMemo(() => pathname === "/login" || pathname === "/register", [pathname]);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // On mount, apply and listen for system changes if in system mode
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [theme]);

  if (hideOnAuth) return null;

  const cycle = () => {
    setTheme((t) => (t === "system" ? "light" : t === "light" ? "dark" : "system"));
  };

  const label = theme === "system" ? "System" : theme === "light" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}`}
      title={`Theme: ${label}`}
      style={{
        background: "transparent",
        color: "inherit",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "6px 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
      className={className}
    >
      {/* simple icon glyphs: sun/moon/auto */}
      <span aria-hidden>
        {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🖥️"}
      </span>
      <span style={{ fontSize: 12, opacity: 0.85 }}>{label}</span>
    </button>
  );
}
