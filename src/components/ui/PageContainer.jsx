"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function PageContainer({ children }) {
  const pathname = usePathname();
  const authRoutes = new Set(["/login", "/register"]);
  const isAuth = authRoutes.has(pathname);
  const cls = isAuth
    ? "max-w-6xl mx-auto px-0 py-0"
    : "max-w-6xl mx-auto px-4 py-6";
  return <main className={cls}>{children}</main>;
}
