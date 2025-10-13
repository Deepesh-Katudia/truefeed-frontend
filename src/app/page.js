"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// envConfig is server-only; do not import it into client components.
import { apiProfile } from "@/api";
import { ROUTE_PROFILE, ROUTE_LOGIN } from "@/lib/paths";
import { useLoader } from "@/components/ui/LoaderContext";

export default function Home() {
  const router = useRouter();
  const { show, hide } = useLoader();

  useEffect(() => {
    let mounted = true;
    // Show global overlay loader to avoid page scrollbars with header
    show({
      variant: "auth",
      label: "Redirecting…",
      subtext: "Checking your session and sending you to the right page",
    });
    async function check() {
      try {
        const res = await apiProfile.getProfile();
        if (!mounted) return;
        if (res.ok) router.replace(ROUTE_PROFILE);
        else router.replace(ROUTE_LOGIN);
      } catch (err) {
        if (!mounted) return;
        router.replace(ROUTE_LOGIN);
      }
    }
    check();
    return () => {
      mounted = false;
      hide();
    };
  }, [router, show, hide]);

  // Overlay loader is shown globally; no page content needed
  return null;
}
