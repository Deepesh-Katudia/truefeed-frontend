import { Sidebar } from "./Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toAbsoluteUrl } from "@/lib/api";
import { StoryBar } from "../stories/StoryBar";
import { Feed } from "../posts/Feed";
import { Requests } from "../right-panel/Requests";
import { Contacts } from "../right-panel/Contacts";
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
    <div className="min-h-screen text-neutral-900">
      {/* Background: colorful gradient + subtle pattern */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-100 via-pink-100 to-sky-100" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.35) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="mx-auto flex max-w-[1920px]">
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="shrink-0"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex justify-center">
          <motion.main
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full max-w-3xl px-6 py-6"
          >
            {/* Top glass card */}
            <motion.div
              variants={fadeUp}
              className="mb-5 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Welcome back</p>
                    <h2 className="text-lg font-semibold">
                      {user?.name || user?.email || "User"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-create-post"))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition"
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
                        className="h-10 w-10 cursor-pointer rounded-full border-2 border-indigo-500 shadow-sm"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Soft accent strip */}
              <div className="h-1 w-full rounded-b-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-sky-400" />
            </motion.div>

            {/* StoryBar */}
            <motion.div variants={fadeUp} className="mb-5">
              <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-md shadow-black/5 p-4">
                <StoryBar />
              </div>
            </motion.div>

            {/* Feed */}
            <motion.div variants={fadeUp}>
              <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5 p-4">
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
          className="w-80 px-6 py-6"
        >
          <div className="sticky top-6 space-y-5">
            <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-800">
                    Right Panel
                  </p>
                  <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 text-xs font-semibold text-white">
                    Live
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  Requests and contacts update here.
                </p>
              </div>
              <div className="h-1 w-full rounded-b-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              <motion.div variants={fadeUp} className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-md shadow-black/5 p-4">
                <Requests />
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-md shadow-black/5 p-4">
                <Contacts />
              </motion.div>
            </motion.div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
