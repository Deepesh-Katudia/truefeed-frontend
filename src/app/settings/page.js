"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/components/ui/LoaderContext";
import { apiProfile } from "@/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardContent } from "@/components/ui/Card";
import Image from "next/image";
import { buildUrl } from "@/lib/api";
import { ArrowLeftIcon, CheckIcon, ImageIcon } from "@/components/ui/Icons";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(null); // null | true | false
  const { show, hide } = useLoader();
  const router = useRouter();

  useEffect(() => {
    show({ variant: "profile", label: "Loading settings…" });
    (async () => {
      const res = await apiProfile.getProfile();
      if (res.ok) {
        const u = res.data?.user || null;
        setUser(u);
        setDescription(u?.description || "");
        setPhone(u?.phone || "");
      } else {
        setMsg(res.error?.message || "Not authenticated");
      }
      hide();
    })();
  }, [show, hide]);

  // Build preview URL for selected image and clean it up on change/unmount
  useEffect(() => {
    if (!pictureFile) {
      if (picturePreview) URL.revokeObjectURL(picturePreview);
      setPicturePreview(null);
      return;
    }
    const url = URL.createObjectURL(pictureFile);
    setPicturePreview(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pictureFile]);

  if (msg) return <div className="p-6 max-w-md mx-auto text-center">{msg}</div>;
  if (!user) return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-x-6 -top-4 h-24 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-purple-500/10 blur-2xl rounded-xl" />
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Profile settings
                </h2>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => router.push("/profile")}
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeftIcon /> Back to Profile
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const res = await apiProfile.updateWithPicture({
                      file: pictureFile,
                      description,
                      phone,
                    });
                    if (res.ok) {
                      setMsg("Settings saved");
                      setSaved(true);
                    } else {
                      setMsg(res.data?.error || "Update failed");
                      setSaved(false);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Optional. Visible on your profile.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    About you
                  </label>
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    placeholder="Tell others about yourself"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500">
                      Max 1000 characters.
                    </p>
                    <p className="text-xs text-slate-500">
                      {description.length}/1000
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Profile picture
                  </label>
                  {user?.picture && (
                    <div className="mb-2">
                      <div className="text-xs text-slate-500 mb-1">Current</div>
                      <Image
                        src={buildUrl(user.picture)}
                        alt="Current picture"
                        width={96}
                        height={96}
                        unoptimized
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="picture-input"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 cursor-pointer"
                    >
                      <ImageIcon /> Choose image
                    </label>
                    <input
                      id="picture-input"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) =>
                        setPictureFile(e.target.files?.[0] || null)
                      }
                    />
                    {pictureFile && (
                      <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {pictureFile.name}
                        <button
                          type="button"
                          className="ml-1 underline"
                          onClick={() => setPictureFile(null)}
                        >
                          Remove
                        </button>
                      </span>
                    )}
                  </div>
                  {picturePreview && (
                    <div className="mt-2">
                      <div className="text-xs text-slate-500 mb-1">Preview</div>
                      <Image
                        src={picturePreview}
                        alt="Preview"
                        width={96}
                        height={96}
                        unoptimized
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="pt-1">
                  <Button
                    type="submit"
                    loading={loading}
                    loadingLabel="Saving…"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
              {msg ? (
                <div
                  className={`mt-4 text-sm inline-flex items-center gap-2 px-3 py-2 rounded-md ${
                    saved
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {saved ? <CheckIcon /> : null}
                  <span>{msg}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
