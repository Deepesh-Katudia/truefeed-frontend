"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useLoader } from "@/components/ui/LoaderContext";
import { apiProfile } from "@/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ROUTE_SETTINGS } from "@/lib/paths";
import { buildUrl } from "@/lib/api";
import Card, { CardHeader, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  LikeIcon,
  CommentIcon,
  ShareIcon,
  GearIcon,
  ArrowLeftIcon,
} from "@/components/ui/Icons";

function timeAgo(date) {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const { show, hide } = useLoader();

  useEffect(() => {
    show({
      variant: "profile",
      label: "Loading profile…",
      subtext: "Fetching your account details",
    });
    (async () => {
      const res = await apiProfile.getProfile();
      if (res.ok) setUser(res.data?.user || null);
      else setMsg(res.error?.message || "Not authenticated");
      hide();
    })();
  }, [show, hide]);

  if (msg) return <div className="p-6 max-w-md mx-auto text-center">{msg}</div>;
  if (!user) return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-x-6 -top-4 h-24 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-purple-500/10 blur-2xl rounded-xl" />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6 md:gap-8">
                {user.picture ? (
                  <Image
                    src={buildUrl(user.picture)}
                    alt="Profile"
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                      : "U"}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-text truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted truncate">{user.email}</p>
                  <p className="mt-1 text-xs text-muted">
                    Joined {timeAgo(user.createdAt)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(user.description || user.phone) && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.description && (
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted mb-1">
                        About
                      </div>
                      <p className="text-sm text-text whitespace-pre-wrap">
                        {user.description}
                      </p>
                    </div>
                  )}
                  {user.phone && (
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted mb-1">
                        Phone
                      </div>
                      <p className="text-sm text-text">{user.phone}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={() => router.push(ROUTE_SETTINGS)}>
                  <span className="inline-flex items-center gap-2">
                    <GearIcon /> Edit settings
                  </span>
                </Button>
                <Button variant="secondary" onClick={() => router.push("/")}>
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeftIcon /> Back to Home
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h4 className="text-base font-semibold text-text">Quick actions</h4>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <LikeIcon /> Like something
              </span>
              <span className="inline-flex items-center gap-2">
                <CommentIcon /> Leave a comment
              </span>
              <span className="inline-flex items-center gap-2">
                <ShareIcon /> Share a post
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
