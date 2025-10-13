"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTE_PROFILE } from "@/lib/paths";
import { getProfile } from "@/api/profile";
import { apiAuth } from "@/api";
import styles from "@/styles/header.module.css";

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
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.brand}>TrueFeed</div>
        <div className={styles.actions}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href={ROUTE_PROFILE} className={styles.link}>
            Profile
          </Link>
          {isAdmin && (
            <Link href="/admin/logs" className={styles.link}>
              Admin Logs
            </Link>
          )}
          <button
            className={`${styles.link} ${styles.buttonLink}`}
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
