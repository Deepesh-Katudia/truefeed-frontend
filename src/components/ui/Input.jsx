"use client";
import React from "react";
import { InlineLoader } from "./Loader";
import styles from "@/styles/input.module.css";

export default function Input({
  className = "",
  rightAdornment,
  validating = false,
  ...props
}) {
  const inputCls = `${styles.input} ${validating || rightAdornment ? styles.rightPad : ""} ${className}`.trim();
  return (
    <div className={styles.wrapper}>
      <input className={inputCls} {...props} />
      {(validating || rightAdornment) && (
        <div className={styles.adornment}>
          {validating ? <InlineLoader size={14} /> : rightAdornment}
        </div>
      )}
    </div>
  );
}
