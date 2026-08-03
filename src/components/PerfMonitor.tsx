import { useEffect, useState } from "react";
import { Activity, X } from "lucide-react";

import {
  formatVital,
  rateVital,
  startPerfMonitor,
  type PerfSnapshot,
  type VitalName,
} from "@/lib/perf-monitor";

const STORAGE_KEY = "onewebs.perf";
const VITALS: VitalName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];

const rateClass: Record<string, string> = {
  good: "text-emerald-500",
  "needs-improvement": "text-amber-500",
  poor: "text-rose-500",
};

function isEnabled() {
  if (typeof window === "undefined") return false;
  const param = new URLSearchParams(window.location.search).get("perf");
  if (param === "1") {
    window.localStorage.setItem(STORAGE_KEY, "1");
    return true;
  }
  if (param === "0") {
    window.localStorage.removeItem(STORAGE_KEY);
    return false;
  }
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function PerfMonitor() {
  const [enabled, setEnabled] = useState(false);
  const [snapshot, setSnapshot] = useState<PerfSnapshot | null>(null);

  useEffect(() => {
    setEnabled(isEnabled());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    return startPerfMonitor(setSnapshot);
  }, [enabled]);

  if (!enabled || !snapshot) return null;

  const fpsClass =
    snapshot.fps >= 50 ? rateClass.good : snapshot.fps >= 30 ? rateClass["needs-improvement"] : rateClass.poor;

  return (
    <div className="fixed bottom-3 left-3 z-[100] w-[min(15rem,calc(100vw-1.5rem))] rounded-xl border border-border/60 bg-background/90 p-3 font-mono text-[11px] leading-relaxed shadow-lg backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          Perf
        </span>
        <button
          type="button"
          aria-label="Hide performance monitor"
          onClick={() => {
            window.localStorage.removeItem(STORAGE_KEY);
            setEnabled(false);
          }}
          className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">FPS</span>
        <span className={fpsClass}>
          {snapshot.fps}
          {Number.isFinite(snapshot.fpsMin) ? ` (min ${snapshot.fpsMin})` : ""}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Long tasks</span>
        <span className={snapshot.longTasks ? rateClass["needs-improvement"] : rateClass.good}>
          {snapshot.longTasks} / {Math.round(snapshot.longTaskMs)}ms
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Worst task</span>
        <span className={snapshot.worstLongTaskMs > 100 ? rateClass.poor : "text-foreground"}>
          {snapshot.worstLongTaskMs}ms
        </span>
      </div>

      <div className="my-2 h-px bg-border/60" />

      {VITALS.map((name) => {
        const value = snapshot.vitals[name];
        return (
          <div key={name} className="flex items-center justify-between">
            <span className="text-muted-foreground">{name}</span>
            <span className={value === undefined ? "text-muted-foreground" : rateClass[rateVital(name, value)]}>
              {value === undefined ? "—" : formatVital(name, value)}
            </span>
          </div>
        );
      })}

      <div className="mt-2 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
        {snapshot.cpuCores ?? "?"} cores
        {snapshot.deviceMemory ? ` · ${snapshot.deviceMemory}GB` : ""}
        {snapshot.connection ? ` · ${snapshot.connection}` : ""}
      </div>
    </div>
  );
}
