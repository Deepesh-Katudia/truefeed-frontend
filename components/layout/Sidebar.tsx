"use client";

import { Users, FileText, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { toAbsoluteUrl } from "@/lib/api";
import { motion } from "framer-motion";

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const activeItem = path?.startsWith("/people")
    ? "People"
    : path?.startsWith("/profile")
    ? "Profile"
    : "News Feed";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNavigation = (label: string) => {
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
    <aside className="hidden h-screen w-80 p-5 lg:sticky lg:top-0 lg:block xl:w-[21rem] xl:p-6">
      {/* Glass container */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#302c28]/10 bg-[#fffaf4]/70 shadow-[0_20px_60px_rgba(48,44,40,0.10)] backdrop-blur-xl"
      >
        {/* Top brand strip */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#302c28]/10 bg-[#d6ccc2] shadow-md shadow-[#6f6258]/10">
              <span className="text-lg font-bold text-[#302c28]">T</span>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-[#302c28]">TrueFeed</div>
              <div className="text-xs text-[#756b62]">AI-powered social</div>
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-[3px] w-full bg-[#d6ccc2]" />

        {/* User card */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/profile")}
          className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-[#302c28]/10 bg-[#f5ebe0]/80 px-3 py-3 text-left shadow-md shadow-[#302c28]/5 transition hover:bg-[#fffaf4]"
        >
          <img
            src={
              toAbsoluteUrl(user?.picture) ||
              `https://i.pravatar.cc/150?u=${user?.email || "default"}`
            }
            alt={user?.name || user?.email || "User"}
            className="h-12 w-12 rounded-xl border border-[#302c28]/10 object-cover"
          />
          <div className="min-w-0">
            <div className="truncate font-semibold text-[#302c28]">
              {user?.name || "Anonymous User"}
            </div>
            <div className="truncate text-sm text-[#756b62]">
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
                  "group relative mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? "border border-[#302c28]/10 bg-[#d6ccc2]/80 shadow-sm"
                    : "hover:bg-[#f5ebe0]/80",
                ].join(" ")}
              >
                {/* Active gradient bar */}
                {isActive && (
                  <div className="absolute bottom-2 left-0 top-2 w-1.5 rounded-r-full bg-[#8a7b70]" />
                )}

                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl border border-[#302c28]/10 transition",
                    isActive
                      ? "bg-[#8a7b70] text-[#fffaf4] shadow-md shadow-[#6f6258]/15"
                      : "bg-[#fffaf4]/70 text-[#5f554d] group-hover:bg-[#fffaf4]",
                  ].join(" ")}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 text-left">
                  <div
                    className={[
                      "font-semibold transition",
                      isActive ? "text-[#302c28]" : "text-[#5f554d]",
                    ].join(" ")}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs text-[#756b62]">
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
            className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-700 transition hover:bg-red-500/15"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-[#fffaf4]/70">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold">Logout</span>
          </motion.button>

          <div className="mt-4 px-1 text-[11px] text-[#756b62]">
            Tip: Use the Create button to post with AI fact-checking.
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
