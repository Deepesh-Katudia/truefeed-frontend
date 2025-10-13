"use client";
import React from "react";

function cx(cls = "", className = "") {
  return [cls, className].filter(Boolean).join(" ");
}

export const LikeIcon = ({ className = "", size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={cx("", className)}
    fill="currentColor"
  >
    <path d="M12.001 4.529c2.349-2.532 6.305-2.532 8.654 0a6.334 6.334 0 0 1 0 8.695l-6.42 6.915a1.643 1.643 0 0 1-2.468 0l-6.42-6.915a6.334 6.334 0 0 1 0-8.695c2.349-2.532 6.305-2.532 8.654 0Z" />
  </svg>
);

export const CommentIcon = ({ className = "", size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={cx("", className)}
    fill="currentColor"
  >
    <path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v9A2.25 2.25 0 0 1 18.75 16.5H8.309l-3.77 3.77A.75.75 0 0 1 3 19.56V5.25Z" />
  </svg>
);

export const ShareIcon = ({ className = "", size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={cx("", className)}
    fill="currentColor"
  >
    <path d="M15 8.25v-3a.75.75 0 0 1 1.28-.53l5.47 5.25a.75.75 0 0 1 0 1.06l-5.47 5.25A.75.75 0 0 1 15 12.75v-3h-1.5a9 9 0 1 0 0 18v-1.5a7.5 7.5 0 1 1 0-15H15Z" transform="translate(-3 -8.25)" />
  </svg>
);

export const RefreshIcon = ({ className = "", size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={cx("", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12a9 9 0 1 0 9-9"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l3-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l3 3" />
  </svg>
);

export const ImageIcon = ({ className = "", size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={cx("", className)} fill="currentColor">
    <path d="M5.25 4.5A2.25 2.25 0 0 0 3 6.75v10.5A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25Zm1.5 3A1.5 1.5 0 1 1 9 9a1.5 1.5 0 0 1-2.25-1.5Zm4.5 3.75a.75.75 0 0 1 1.06 0l4.69 4.69a.75.75 0 0 1-.53 1.28H7.53a.75.75 0 0 1-.53-1.28l3-3a.75.75 0 0 1 1.06 0l.69.69 1.06-1.06Z"/>
  </svg>
);

export const VideoIcon = ({ className = "", size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={cx("", className)} fill="currentColor">
    <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h8.25A2.25 2.25 0 0 1 15.75 6.75v10.5A2.25 2.25 0 0 1 13.5 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Zm12.75 3.02 4.5-2.57a.75.75 0 0 1 1.125.65v7.56a.75.75 0 0 1-1.125.65l-4.5-2.57V9.77Z"/>
  </svg>
);

export const GearIcon = ({ className = "", size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={cx("", className)}
  >
    {/* Settings sliders icon for a cleaner modern look */}
    <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
    <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
    <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
    <circle cx="8" cy="6" r="2" fill="currentColor" />
    <circle cx="14" cy="12" r="2" fill="currentColor" />
    <circle cx="10" cy="18" r="2" fill="currentColor" />
  </svg>
);

export const ArrowLeftIcon = ({ className = "", size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={cx("", className)} fill="currentColor">
    <path d="M9.53 5.47a.75.75 0 0 1 0 1.06L6.06 10h12.19a.75.75 0 0 1 0 1.5H6.06l3.47 3.47a.75.75 0 1 1-1.06 1.06l-4.75-4.75a.75.75 0 0 1 0-1.06l4.75-4.75a.75.75 0 0 1 1.06 0Z"/>
  </svg>
);

export const CheckIcon = ({ className = "", size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={cx("", className)} fill="currentColor">
    <path d="M9.75 17.25 4.5 12l1.06-1.06 4.19 4.19 8.69-8.69L19.5 7.5 9.75 17.25Z"/>
  </svg>
);

export default {
  LikeIcon,
  CommentIcon,
  ShareIcon,
  RefreshIcon,
  ImageIcon,
  VideoIcon,
  GearIcon,
  ArrowLeftIcon,
  CheckIcon,
};
