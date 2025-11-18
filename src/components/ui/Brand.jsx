"use client";
import React from "react";
import styles from "@/styles/header.module.css";

export default function Brand({ as: Tag = "div", children = "TrueFeed", className = "", center = false }) {
  const cls = [styles.brand, center ? styles.brandCentered : "", className]
    .filter(Boolean)
    .join(" ");
  return <Tag className={cls}>{children}</Tag>;
}
