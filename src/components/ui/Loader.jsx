"use client";
import React from "react";
import styles from "@/styles/loader.module.css";

const themeClass = {
  default: styles.t_default,
  admin: styles.t_admin,
  auth: styles.t_auth,
  profile: styles.t_profile,
};

export default function Loader({
  label = "Loading…",
  subtext,
  className = "",
  size = 24,
  variant = "default",
}) {
  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={`${styles.spinner} ${themeClass[variant] || themeClass.default}`}
      />
      <div style={{ textAlign: "center" }}>
        <div className={styles.label}>{label}</div>
        {subtext && <div className={styles.subtext}>{subtext}</div>}
      </div>
    </div>
  );
}

export function InlineLoader({ size = 16, className = "", variant = "default" }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`${styles.spinner} ${themeClass[variant] || themeClass.default} ${className}`}
    />
  );
}
