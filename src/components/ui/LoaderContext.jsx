"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Loader from "./Loader";
import styles from "@/styles/loader.module.css";

const LoaderCtx = createContext({ show: () => {}, hide: () => {}, state: { visible: false } });

export function LoaderProvider({ children }) {
  const [state, setState] = useState({ visible: false, label: "Loading…", subtext: "", variant: "default" });

  const show = useCallback((opts = {}) => {
    setState((s) => ({
      ...s,
      visible: true,
      label: opts.label ?? s.label,
      subtext: opts.subtext ?? s.subtext,
      variant: opts.variant ?? s.variant,
    }));
  }, []);

  const hide = useCallback(() => setState((s) => ({ ...s, visible: false })), []);

  const value = useMemo(() => ({ show, hide, state }), [show, hide, state]);

  // Lock body scroll when overlay is visible
  useEffect(() => {
    if (state.visible) {
      const html = document.documentElement;
      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      html.classList.add("loader-open");
      document.body.classList.add("loader-open");
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        html.classList.remove("loader-open");
        document.body.classList.remove("loader-open");
        html.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [state.visible]);

  return (
    <LoaderCtx.Provider value={value}>
      {children}
      {state.visible && (
        <div className={styles.overlayBackdrop}>
          <div className={styles.overlayPane}>
            <Loader variant={state.variant} label={state.label} subtext={state.subtext} />
          </div>
        </div>
      )}
    </LoaderCtx.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderCtx);
}
