// Lightweight, dependency-free performance monitoring:
// Core Web Vitals (TTFB, FCP, LCP, CLS, INP) + runtime FPS and long tasks.

export type VitalName = "TTFB" | "FCP" | "LCP" | "CLS" | "INP";

export type PerfSnapshot = {
  vitals: Partial<Record<VitalName, number>>;
  fps: number;
  fpsMin: number;
  longTasks: number;
  longTaskMs: number;
  worstLongTaskMs: number;
  deviceMemory?: number;
  cpuCores?: number;
  connection?: string;
};

export const VITAL_THRESHOLDS: Record<VitalName, [number, number]> = {
  TTFB: [800, 1800],
  FCP: [1800, 3000],
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
};

export function rateVital(name: VitalName, value: number): "good" | "needs-improvement" | "poor" {
  const [good, poor] = VITAL_THRESHOLDS[name];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

type Listener = (snapshot: PerfSnapshot) => void;

function observe(type: string, cb: (entries: PerformanceEntry[]) => void, extra: Record<string, unknown> = {}) {
  try {
    const po = new PerformanceObserver((list) => cb(list.getEntries()));
    po.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
    return po;
  } catch {
    return undefined;
  }
}

export function startPerfMonitor(onUpdate: Listener) {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };

  const state: PerfSnapshot = {
    vitals: {},
    fps: 0,
    fpsMin: Number.POSITIVE_INFINITY,
    longTasks: 0,
    longTaskMs: 0,
    worstLongTaskMs: 0,
    deviceMemory: nav.deviceMemory,
    cpuCores: nav.hardwareConcurrency,
    connection: nav.connection?.effectiveType,
  };

  let dirty = true;
  const emit = () => {
    dirty = true;
  };

  // TTFB
  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navEntry) state.vitals.TTFB = navEntry.responseStart;

  const observers: (PerformanceObserver | undefined)[] = [];

  observers.push(
    observe("paint", (entries) => {
      for (const e of entries) if (e.name === "first-contentful-paint") state.vitals.FCP = e.startTime;
      emit();
    }),
  );

  observers.push(
    observe("largest-contentful-paint", (entries) => {
      const last = entries[entries.length - 1];
      if (last) state.vitals.LCP = last.startTime;
      emit();
    }),
  );

  // CLS (sum of session windows, report max window)
  let clsValue = 0;
  let sessionValue = 0;
  let sessionFirst = 0;
  let sessionLast = 0;
  observers.push(
    observe("layout-shift", (entries) => {
      for (const entry of entries as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (entry.hadRecentInput) continue;
        if (sessionValue && entry.startTime - sessionLast < 1000 && entry.startTime - sessionFirst < 5000) {
          sessionValue += entry.value;
          sessionLast = entry.startTime;
        } else {
          sessionValue = entry.value;
          sessionFirst = entry.startTime;
          sessionLast = entry.startTime;
        }
        if (sessionValue > clsValue) clsValue = sessionValue;
      }
      state.vitals.CLS = Math.round(clsValue * 1000) / 1000;
      emit();
    }),
  );

  // INP approximation: worst interaction latency
  observers.push(
    observe(
      "event",
      (entries) => {
        for (const entry of entries as (PerformanceEntry & { interactionId?: number; duration: number })[]) {
          if (!entry.interactionId) continue;
          state.vitals.INP = Math.max(state.vitals.INP ?? 0, Math.round(entry.duration));
        }
        emit();
      },
      { durationThreshold: 16 },
    ),
  );

  // Long tasks (main-thread blocking = jank source)
  observers.push(
    observe("longtask", (entries) => {
      for (const entry of entries) {
        state.longTasks += 1;
        state.longTaskMs += entry.duration;
        state.worstLongTaskMs = Math.max(state.worstLongTaskMs, Math.round(entry.duration));
      }
      emit();
    }),
  );

  // FPS sampling via rAF
  let frames = 0;
  let windowStart = performance.now();
  let rafId = 0;
  const tick = (now: number) => {
    frames += 1;
    const elapsed = now - windowStart;
    if (elapsed >= 1000) {
      state.fps = Math.round((frames * 1000) / elapsed);
      if (state.fps < state.fpsMin) state.fpsMin = state.fps;
      frames = 0;
      windowStart = now;
      emit();
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  const interval = window.setInterval(() => {
    if (!dirty) return;
    dirty = false;
    onUpdate({ ...state, vitals: { ...state.vitals } });
  }, 500);

  return () => {
    cancelAnimationFrame(rafId);
    window.clearInterval(interval);
    for (const po of observers) po?.disconnect();
  };
}

export function formatVital(name: VitalName, value: number) {
  return name === "CLS" ? value.toFixed(3) : `${Math.round(value)} ms`;
}
