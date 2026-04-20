import { Sidebar } from "./Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toAbsoluteUrl } from "@/lib/api";
import { StoryBar } from "../stories/StoryBar";
import { Feed } from "../posts/Feed";
import { Requests } from "../right-panel/Requests";
import { Contacts } from "../right-panel/Contacts";
import { MobileNav } from "./MobileNav";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pb-24 text-[#302c28] lg:pb-0">
      {/* Warm editorial background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#edede9_0%,#f5ebe0_54%,#d6ccc2_100%)]" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(48,44,40,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(48,44,40,0.55) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="mx-auto flex max-w-[1920px] gap-6 px-3 sm:px-4 lg:px-0">
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="hidden shrink-0 lg:block"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 justify-center">
          <motion.main
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full max-w-3xl py-4 sm:py-6"
          >
            {/* Top glass card */}
            <motion.div
              variants={fadeUp}
              className="mb-6 rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl"
            >
              <div className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-[#756b62]">Welcome back</p>
                    <h2 className="text-lg font-semibold text-[#302c28]">
                      {user?.name || user?.email || "User"}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-create-post"))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#6f6258] px-4 py-2 text-sm font-semibold text-[#fffaf4] shadow-md shadow-[#6f6258]/20 transition hover:bg-[#5f554d]"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create
                    </motion.button>

                    <Link href="/profile">
                      <motion.img
                        whileHover={{ y: -2, rotate: 1 }}
                        whileTap={{ scale: 0.98 }}
                        src={
                          toAbsoluteUrl(user?.picture) ||
                          `https://i.pravatar.cc/150?u=${user?.email || "user"}`
                        }
                        alt={user?.name || user?.email || "Profile"}
                        className="h-10 w-10 cursor-pointer rounded-full border-2 border-[#d6ccc2] shadow-sm transition hover:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Soft accent strip */}
              <div className="h-1 w-full rounded-b-2xl bg-[#d6ccc2]" />
            </motion.div>

            {/* StoryBar */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_14px_42px_rgba(48,44,40,0.08)] backdrop-blur-xl">
                <StoryBar />
              </div>
            </motion.div>

            {/* Feed */}
            <motion.div variants={fadeUp}>
              <div className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl">
                <Feed />
              </div>
            </motion.div>
          </motion.main>
        </div>

        {/* Right Panel */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="hidden w-80 shrink-0 py-6 xl:block"
        >
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 shadow-[0_18px_55px_rgba(48,44,40,0.10)] backdrop-blur-xl">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#302c28]">
                    Right Panel
                  </p>
                  <span className="rounded-full bg-[#d6ccc2] px-2 py-1 text-xs font-semibold text-[#4d453e]">
                    Live
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#756b62]">
                  Requests and contacts update here.
                </p>
              </div>
              <div className="h-1 w-full rounded-b-2xl bg-[#d6ccc2]" />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeUp} className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_14px_42px_rgba(48,44,40,0.08)] backdrop-blur-xl">
                <Requests />
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-2xl border border-[#302c28]/10 bg-[#fffaf4]/75 p-4 shadow-[0_14px_42px_rgba(48,44,40,0.08)] backdrop-blur-xl">
                <Contacts />
              </motion.div>
            </motion.div>
          </div>
        </motion.aside>
      </div>
      <MobileNav />
    </div>
  );
}
