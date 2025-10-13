"use client";
import React from "react";
import styles from "@/styles/card.module.css";

export default function Card({ className = "", children }) {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
}

export function CardHeader({ className = "", children }) {
  return <div className={`${styles.header} ${className}`.trim()}>{children}</div>;
}

export function CardContent({ className = "", children }) {
  return <div className={`${styles.content} ${className}`.trim()}>{children}</div>;
}
