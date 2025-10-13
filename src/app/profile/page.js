"use client";
import React, { useEffect, useState } from "react";
import { InlineLoader } from "@/components/ui/Loader";
import { useLoader } from "@/components/ui/LoaderContext";
import { apiProfile } from "@/api";
import { apiAuth } from "@/api";
import { ROUTE_LOGIN } from "@/lib/paths";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { show, hide } = useLoader();

  useEffect(() => {
    show({
      variant: "profile",
      label: "Loading profile…",
      subtext: "Fetching your account details",
    });
    async function load() {
      const res = await apiProfile.getProfile();
      if (res.ok) setUser(res.data?.user || null);
      else setMsg(res.error?.message || "Not authenticated");
      hide();
    }
    load();
  }, [show, hide]);

  if (msg) return <div className="p-6 max-w-md mx-auto text-center">{msg}</div>;
  if (!user) return null; // Overlay loader is active

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-slate-800">
          <div className="p-6 sm:flex sm:items-center">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "U"}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {user.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {user.email}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Joined: {new Date(user.createdAt).toLocaleString()}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 text-sm font-medium rounded-md"
                  onClick={() => router.push("/")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
