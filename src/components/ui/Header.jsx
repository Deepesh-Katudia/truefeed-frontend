"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTE_PROFILE } from "@/lib/paths";
import { getProfile } from "@/api/profile";
import { apiAuth } from "@/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const hideOn = new Set(["/login", "/register"]);
  if (hideOn.has(pathname)) return null;

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await getProfile();
      if (!mounted) return;
      if (r.ok && r.data?.user?.role === "admin") setIsAdmin(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-tight">TrueFeed</div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-slate-600 dark:text-slate-300 hover:underline">
            Home
          </Link>
          <Link href={ROUTE_PROFILE} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">
            Profile
          </Link>
          {isAdmin && (
            <Link href="/admin/logs" className="text-sm text-slate-600 dark:text-slate-300 hover:underline">
              Admin Logs
            </Link>
          )}
          <button
            className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
            onClick={async () => {
              const r = await apiAuth.logout();
              if (r.ok) router.replace("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
