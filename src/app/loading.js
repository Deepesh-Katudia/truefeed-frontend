"use client";
import Loader from "@/components/ui/Loader";
import styles from "@/styles/loader.module.css";

export default function RootLoading() {
  return (
    <div className={styles.fullscreenCenter}>
      <Loader
        variant="default"
        label="Loading…"
        subtext="Please wait while we prepare this page"
      />
    </div>
  );
}
