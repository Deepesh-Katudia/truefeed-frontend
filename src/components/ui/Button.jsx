"use client";
import React from "react";
import styles from "@/styles/button.module.css";

export default function Button({
  variant = "primary",
  className = "",
  loading = false,
  loadingLabel,
  children,
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading;
  const variantCls = styles[variant] || styles.primary;
  const cls = `${styles.base} ${variantCls} ${className}`.trim();
  return (
    <button className={cls} disabled={isDisabled} aria-busy={loading} {...props}>
      {loading && (
        <span aria-hidden="true" className={styles.spinner} />
      )}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}
