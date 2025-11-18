"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiProfile } from "@/api";
import * as postsApi from "@/api/posts";
import { ROUTE_LOGIN } from "@/lib/paths";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardContent } from "@/components/ui/Card";
import Image from "next/image";
import { buildUrl } from "@/lib/api";
import {
  LikeIcon,
  CommentIcon,
  ShareIcon,
  RefreshIcon,
  ImageIcon,
  VideoIcon,
} from "@/components/ui/Icons";

function Avatar({ name, picture, size = 40 }) {
  const initials = useMemo(() => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);
  if (picture) {
    return (
      <Image
        src={buildUrl(picture)}
        alt={name || "Avatar"}
        width={size}
        height={size}
        unoptimized
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

function timeAgo(date) {
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

function PostItem({ post, user }) {
  const [mediaKind, setMediaKind] = useState(null); // image | video | null
  useEffect(() => {
    let aborted = false;
    async function detect() {
      if (!post.mediaUrl) return;
      try {
        const res = await fetch(buildUrl(post.mediaUrl), { method: "HEAD" });
        const ct = res.headers.get("content-type") || "";
        if (aborted) return;
        if (ct.startsWith("image/")) setMediaKind("image");
        else if (ct.startsWith("video/")) setMediaKind("video");
        else setMediaKind(null);
      } catch (_) {
        if (!aborted) setMediaKind(null);
      }
    }
    detect();
    return () => {
      aborted = true;
    };
  }, [post.mediaUrl]);

  return (
    <div className="py-5 border-b border-border">
      <div className="flex items-start gap-5 md:gap-6">
        <Avatar name={user?.name} picture={user?.picture} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-text truncate">
              {user?.name || "You"}
            </span>
            <span className="text-muted">•</span>
            <span className="text-muted">{timeAgo(post.createdAt)}</span>
          </div>
          {post.content && (
            <p className="mt-2 text-text whitespace-pre-wrap">{post.content}</p>
          )}
        </div>
      </div>
      {post.mediaUrl && (
        <div className="mt-3 ml-16 md:ml-[4.25rem]">
          {mediaKind === "image" ? (
            <Image
              src={buildUrl(post.mediaUrl)}
              alt="Post media"
              width={800}
              height={600}
              unoptimized
              className="rounded-md max-h-[480px] w-auto object-contain"
            />
          ) : mediaKind === "video" ? (
            <video
              src={buildUrl(post.mediaUrl)}
              controls
              className="rounded-md max-h-[480px] w-full"
            />
          ) : (
            <a
              href={buildUrl(post.mediaUrl)}
              className="text-accent hover:underline text-sm"
              target="_blank"
              rel="noreferrer"
            >
              View attachment
            </a>
          )}
        </div>
      )}
      <div className="mt-3 flex items-center gap-6 text-sm text-muted">
        <button className="inline-flex items-center gap-2 hover:text-text">
          <LikeIcon /> <span>Like</span>
        </button>
        <button className="inline-flex items-center gap-2 hover:text-text">
          <CommentIcon /> <span>Comment</span>
        </button>
        <button className="inline-flex items-center gap-2 hover:text-text">
          <ShareIcon /> <span>Share</span>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const maxLen = 2000;

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const res = await apiProfile.getProfile();
        if (!mounted) return;
        if (res.ok) {
          setUser(res.data?.user || null);
          await refreshPosts();
        } else {
          router.replace(ROUTE_LOGIN);
        }
      } catch (e) {
        if (!mounted) return;
        router.replace(ROUTE_LOGIN);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function refreshPosts() {
    setLoadingPosts(true);
    const res = await postsApi.listMyPosts();
    if (res.ok) setPosts(res.data?.posts || []);
    setLoadingPosts(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!content && !file) {
      setError("Write something or attach a file");
      return;
    }
    setCreating(true);
    const res = await postsApi.createWithMedia({ content, file });
    setCreating(false);
    if (!res.ok) {
      setError(res.data?.error || "Failed to post");
      return;
    }
    setContent("");
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    await refreshPosts();
  }

  if (checking) return null; // header + loader overlay suffice
  if (!user) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-x-6 -top-4 h-24 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-purple-500/10 blur-2xl rounded-xl" />
            <Card>
              <CardHeader>
                <div className="flex items-center gap-5 md:gap-6">
                  <Avatar name={user?.name} picture={user?.picture} size={40} />
                  <div className="min-w-0">
                    <div className="text-text font-semibold truncate">
                      {user?.name}
                    </div>
                    <div className="text-sm text-muted">Create a post</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-3 text-sm text-red-600">{error}</div>
                )}
                <form onSubmit={handleCreate} className="space-y-3">
                  <textarea
                    className="w-full min-h-[120px] p-3 rounded-md border border-border bg-surface text-text"
                    placeholder="What's on your mind?"
                    value={content}
                    maxLength={2000}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                        if (filePreview) URL.revokeObjectURL(filePreview);
                        setFilePreview(f ? URL.createObjectURL(f) : null);
                      }}
                    />
                    {file && (
                      <span className="chip">
                        {file?.type?.startsWith("image/") ? (
                          <ImageIcon />
                        ) : (
                          <VideoIcon />
                        )}
                        {file.name}
                      </span>
                    )}
                    <div className="text-xs text-muted ml-auto">
                      {content.length}/2000
                    </div>
                    <Button
                      type="submit"
                      loading={creating}
                      loadingLabel="Posting…"
                      disabled={creating || (!content && !file)}
                    >
                      Post
                    </Button>
                  </div>
                  {filePreview && (
                    <div className="mt-2">
                      {file?.type?.startsWith("image/") ? (
                        <Image
                          src={filePreview}
                          alt="Preview"
                          width={800}
                          height={600}
                          unoptimized
                          className="rounded-md max-h-[320px] w-auto object-contain"
                        />
                      ) : file?.type?.startsWith("video/") ? (
                        <video
                          src={filePreview}
                          controls
                          className="rounded-md max-h-[320px] w-full"
                        />
                      ) : null}
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setFile(null);
                            if (filePreview) URL.revokeObjectURL(filePreview);
                            setFilePreview(null);
                          }}
                        >
                          Remove attachment
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">Your posts</h2>
                <Button
                  variant="secondary"
                  onClick={refreshPosts}
                  disabled={loadingPosts}
                >
                  <span className="inline-flex items-center gap-2">
                    <RefreshIcon /> Refresh
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPosts ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-surface-soft" />
                        <div className="flex-1">
                          <div className="h-4 bg-surface-soft rounded w-1/3" />
                          <div className="h-3 bg-surface-soft rounded w-1/5 mt-1" />
                        </div>
                      </div>
                      <div className="h-3 bg-surface-soft rounded w-2/3" />
                      <div className="h-48 bg-surface-soft rounded" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-sm text-muted">
                  You haven’t posted anything yet. Share your first update
                  above!
                </div>
              ) : (
                posts.map((p) => <PostItem key={p._id} post={p} user={user} />)
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-text">
                Your profile
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <Avatar name={user?.name} picture={user?.picture} size={48} />
                <div className="min-w-0">
                  <div className="font-semibold text-text truncate">
                    {user?.name}
                  </div>
                  <div className="text-sm text-muted truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-3 text-center">
                  <div className="text-xs text-muted">Posts</div>
                  <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-border text-muted">
                    {posts.length} total
                  </div>
                </div>
                <div className="rounded-md border border-border p-3 text-center">
                  <div className="text-xs text-muted">Since</div>
                  <div className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
