"use client";
import React, { useEffect, useMemo, useState } from "react";
import { API_LOGS } from "@/lib/paths";
import { fetcher, buildUrl } from "@/api";
import Button from "@/components/ui/Button";
import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { useLoader } from "@/components/ui/LoaderContext";
import styles from "@/styles/adminLogs.module.css";

export default function LogsAdminPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null); // date being viewed
  const [content, setContent] = useState("");
  const [loadingItem, setLoadingItem] = useState(null); // which log is loading for View
  const { show, hide } = useLoader();
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'raw'
  const [filter, setFilter] = useState("");
  const [compact, setCompact] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("tf_admin_logs_compact") === "1";
      } catch {}
    }
    return false;
  });

  // Persist compact toggle preference
  useEffect(() => {
    try {
      localStorage.setItem("tf_admin_logs_compact", compact ? "1" : "0");
    } catch {}
  }, [compact]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      show({
        variant: "admin",
        label: "Loading logs…",
        subtext: "Fetching available log files",
      });
      try {
        const r = await fetcher.rawGet(API_LOGS);
        if (!mounted) return;
        if (r.ok) setLogs(r.data?.logs || []);
        else if (r.status === 401)
          setError("Unauthorized. Please login as an admin.");
        else setError(r.error?.message || "Failed to list logs");
      } catch (err) {
        setError("Network error");
      } finally {
        if (mounted) setLoading(false);
        hide();
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [show, hide]);

  async function viewLog(date) {
    setViewing(date);
    setLoadingItem(date);
    setContent("");
    setViewMode("table");
    try {
      const url = buildUrl(
        `${API_LOGS}${API_LOGS.endsWith("/") ? "" : "/"}${date}/stream`
      );
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setContent(j.error || `Failed to load log ${date}`);
        return;
      }
      const txt = await res.text();
      setContent(txt);
    } catch (err) {
      setContent("Network error while loading log");
    } finally {
      setLoadingItem(null);
    }
  }

  function downloadUrl(date) {
    return buildUrl(`${API_LOGS}${API_LOGS.endsWith("/") ? "" : "/"}${date}`);
  }

  function streamUrl(date) {
    return buildUrl(
      `${API_LOGS}${API_LOGS.endsWith("/") ? "" : "/"}${date}/stream?follow=1`
    );
  }

  // Parse log content to rows and dynamic columns
  const { rows, columns } = useMemo(() => {
    if (!content) return { rows: [], columns: [] };
    const lines = content.split(/\r?\n/).filter(Boolean);
    const entries = [];
    const colsSet = new Set();

    const pick = (obj, keys) => keys.find((k) => obj[k] != null);
    const stdKeys = ["time", "level", "message"];

    for (const line of lines) {
      let row = null;
      const trimmed = line.trim();
      // Try JSON per line
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        trimmed.startsWith("{")
      ) {
        try {
          const obj = JSON.parse(trimmed);
          const timeKey = pick(obj, ["timestamp", "time", "date", "ts"]);
          const levelKey = pick(obj, ["level", "severity", "logLevel", "lvl"]);
          const msgKey = pick(obj, ["message", "msg", "text"]);
          row = {
            time: timeKey ? obj[timeKey] : "",
            level: levelKey ? String(obj[levelKey]).toUpperCase() : "",
            message: msgKey ? obj[msgKey] : trimmed,
          };
          // Collect remaining keys as meta columns
          for (const [k, v] of Object.entries(obj)) {
            if (![timeKey, levelKey, msgKey].includes(k)) {
              row[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
            }
          }
        } catch {}
      }
      if (!row) {
        // Try pattern: ISO date [LEVEL] message
        const m = trimmed.match(
          /^(\d{4}-\d{2}-\d{2}T[^\s]+)\s+\[([A-Za-z]+)\]\s+(.*)$/
        );
        if (m) {
          row = { time: m[1], level: m[2].toUpperCase(), message: m[3] };
        } else {
          // Fallback: just message
          row = { time: "", level: "", message: trimmed };
        }
      }
      Object.keys(row).forEach((k) => colsSet.add(k));
      entries.push(row);
    }
    // Prefer standard columns first
    const dynamic = Array.from(colsSet)
      .filter((k) => !stdKeys.includes(k))
      .sort();
    const columns = [...stdKeys.filter((k) => colsSet.has(k)), ...dynamic];
    return { rows: entries, columns };
  }, [content]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Logs (admin)</h2>
      {/* Global overlay loader handles loading visuals */}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {logs.length === 0 && <div>No logs available</div>}
          <ul className="space-y-2">
            {logs.map((d) => (
              <li key={d}>
                <Card>
                  <CardContent className={styles.row}>
                    <div className={styles.date}>{d}</div>
                    <div className={styles.actions}>
                      <Button
                        variant="ghost"
                        onClick={() => viewLog(d)}
                        loading={loadingItem === d}
                      >
                        View
                      </Button>
                      <a
                        className={styles.downloadBtn}
                        href={downloadUrl(d)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                      <Button
                        variant="primary"
                        onClick={() => window.open(streamUrl(d), "_blank")}
                      >
                        Stream
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          {viewing && (
            <Card>
              <CardHeader>
                <h3 className="font-medium">Viewing: {viewing}</h3>
              </CardHeader>
              <CardContent>
                {/* View mode toggle and filter */}
                <div className={styles.viewerToolbar}>
                  <div className={styles.toggleGroup}>
                    <button
                      className={`${styles.toggleBtn} ${
                        viewMode === "table" ? styles.toggleActive : ""
                      }`}
                      onClick={() => setViewMode("table")}
                    >
                      Table
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${
                        viewMode === "raw" ? styles.toggleActive : ""
                      }`}
                      onClick={() => setViewMode("raw")}
                    >
                      Raw
                    </button>
                  </div>

                  {viewMode === "table" && (
                    <div className={styles.controls}>
                      <div className={styles.filter}>
                        <input
                          type="text"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          placeholder="Filter logs…"
                          className={styles.filterInput}
                        />
                      </div>
                      <label className={styles.compactToggle}>
                        <input
                          type="checkbox"
                          checked={compact}
                          onChange={(e) => setCompact(e.target.checked)}
                        />
                        Compact rows
                      </label>
                    </div>
                  )}
                </div>

                {viewMode === "table" ? (
                  <div className={styles.tableWrap}>
                    <table
                      className={`${styles.table} ${compact ? "compact" : ""}`}
                    >
                      <thead className={styles.thead}>
                        <tr>
                          {columns.map((c) => (
                            <th
                              key={c}
                              className={`${styles.th} ${
                                c === "time"
                                  ? styles.colTime
                                  : c === "level"
                                  ? styles.colLevel
                                  : styles.colMessage
                              }`}
                            >
                              {c.charAt(0).toUpperCase() + c.slice(1)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows
                          .filter((r) =>
                            !filter
                              ? true
                              : Object.values(r).some((v) =>
                                  String(v)
                                    .toLowerCase()
                                    .includes(filter.toLowerCase())
                                )
                          )
                          .map((r, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 ? styles.trAlt : ""}
                            >
                              {columns.map((c) => (
                                <td
                                  key={c}
                                  className={`${styles.td} ${
                                    c === "message" ? styles.tdMessage : ""
                                  }`}
                                >
                                  {c === "time"
                                    ? (() => {
                                        const d = new Date(r[c]);
                                        return r[c] && !isNaN(d.getTime())
                                          ? d.toLocaleString()
                                          : r[c] || "";
                                      })()
                                    : c === "level"
                                    ? (() => {
                                        const val = String(
                                          r[c] ?? ""
                                        ).toUpperCase();
                                        const cls =
                                          val === "WARN"
                                            ? styles.bWarn
                                            : val === "ERROR" || val === "ERR"
                                            ? styles.bError
                                            : styles.bInfo;
                                        return (
                                          <span
                                            className={`${styles.badge} ${cls}`}
                                          >
                                            {val || "-"}
                                          </span>
                                        );
                                      })()
                                    : String(r[c] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <pre className={styles.rawPre}>{content}</pre>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setViewing(null);
                      setContent("");
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
