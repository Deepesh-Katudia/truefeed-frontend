"use client";

import { useEffect, useState } from "react";
import { Users, FileText, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { toAbsoluteUrl } from "@/lib/api";
import { motion } from "framer-motion";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("News Feed");
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!path) return;
    if (path.startsWith("/people")) setActiveItem("People");
    else if (path.startsWith("/profile")) setActiveItem("Profile");
    else setActiveItem("News Feed");
  }, [path]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNavigation = (label: string) => {
    setActiveItem(label);
    if (label === "Profile") router.push("/profile");
    else if (label === "News Feed") router.push("/dashboard");
    else if (label === "People") router.push("/people");
  };

  const menuItems = [
    { icon: Users, label: "People" },
    { icon: FileText, label: "News Feed" },
    { icon: User, label: "Profile" },
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 p-6">
      {/* Glass container */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="h-full rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl shadow-xl shadow-black/5 flex flex-col overflow-hidden"
      >
        {/* Top brand strip */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white text-lg font-bold">T</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-neutral-900">TrueFeed</div>
              <div className="text-xs text-neutral-500">AI-powered social</div>
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400" />

        {/* User card */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/profile")}
          className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-3 text-left shadow-md shadow-black/5"
        >
          <img
            src={
              toAbsoluteUrl(user?.picture) ||
              `https://i.pravatar.cc/150?u=${user?.email || "default"}`
            }
            alt={user?.name || user?.email || "User"}
            className="w-12 h-12 rounded-xl object-cover border border-black/10"
          />
          <div className="min-w-0">
            <div className="font-semibold text-neutral-900 truncate">
              {user?.name || "Anonymous User"}
            </div>
            <div className="text-sm text-neutral-600 truncate">
              @{user?.email?.split("@")[0] || "user"}
            </div>
          </div>
        </motion.button>

        {/* Nav */}
        <nav className="mt-6 flex-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <motion.button
                key={item.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item.label)}
                className={[
                  "group relative w-full flex items-center gap-3 rounded-2xl px-4 py-3 mb-2 transition",
                  isActive
                    ? "bg-white/80 border border-black/10 shadow-sm"
                    : "hover:bg-white/60",
                ].join(" ")}
              >
                {/* Active gradient bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-blue-600 to-indigo-600" />
                )}

                <div
                  className={[
                    "w-9 h-9 rounded-xl flex items-center justify-center border border-black/10 transition",
                    isActive
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "bg-white/70 text-neutral-700 group-hover:bg-white",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 text-left">
                  <div
                    className={[
                      "font-semibold transition",
                      isActive ? "text-neutral-900" : "text-neutral-700",
                    ].join(" ")}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {item.label === "News Feed"
                      ? "See latest posts"
                      : item.label === "People"
                      ? "Find friends"
                      : "Your profile"}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-5 pt-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-700 hover:bg-red-500/15 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-white/70 border border-red-500/20 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold">Logout</span>
          </motion.button>

          <div className="mt-4 text-[11px] text-neutral-500 px-1">
            Tip: Use the Create button to post with AI fact-checking.
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
