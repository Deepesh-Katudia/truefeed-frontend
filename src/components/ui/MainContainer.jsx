"use client";
import React from "react";

export default function MainContainer({ children, className = "" }) {
  // min-h-dvh avoids mobile URL bar issues; grid centers content
  const cls = `min-h-dvh grid place-items-center ${className}`;
  return <div className={cls}>{children}</div>;
}
