"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";

type TextScale = "small" | "default" | "large";

const PREFS_EVENT = "gc-prefs";

function applyPrefs(scale: TextScale, contrast: boolean) {
  document.documentElement.dataset.textScale = scale;
  document.documentElement.dataset.contrast = contrast ? "high" : "normal";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PREFS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PREFS_EVENT, onChange);
  };
}

function getScale(): TextScale {
  return (window.localStorage.getItem("gc-text-scale") as TextScale | null) ?? "default";
}

function getContrast(): boolean {
  return window.localStorage.getItem("gc-contrast") === "high";
}

function emitPrefs() {
  window.dispatchEvent(new Event(PREFS_EVENT));
}

function subscribeHydrate() {
  return () => undefined;
}

export function UtilityBar() {
  const hydrated = useSyncExternalStore(subscribeHydrate, () => true, () => false);
  const storedScale = useSyncExternalStore(subscribe, getScale, () => "default" as TextScale);
  const storedContrast = useSyncExternalStore(subscribe, getContrast, () => false);
  const scale = hydrated ? storedScale : "default";
  const contrast = hydrated ? storedContrast : false;

  useEffect(() => {
    applyPrefs(scale, contrast);
  }, [scale, contrast]);

  function updateScale(next: TextScale) {
    window.localStorage.setItem("gc-text-scale", next);
    applyPrefs(next, contrast);
    emitPrefs();
  }

  function toggleContrast() {
    const next = !contrast;
    window.localStorage.setItem("gc-contrast", next ? "high" : "normal");
    applyPrefs(scale, next);
    emitPrefs();
  }

  return (
    <div className="bg-navy-950 text-[12px] text-white">
      <div className="h-[3px] bg-[linear-gradient(90deg,#ff9933_0_33.3%,#fff_33.3%_66.6%,#138808_66.6%_100%)]" />
      <Container className="flex h-9 items-center justify-between gap-3">
        <p className="truncate">Government of India | Official appointment portal</p>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Text size">
            <button
              type="button"
              className={cn("px-1", scale === "small" && "font-bold text-india-saffron")}
              onClick={() => updateScale("small")}
              aria-pressed={scale === "small"}
            >
              A-
            </button>
            <button
              type="button"
              className={cn("px-1", scale === "default" && "font-bold text-india-saffron")}
              onClick={() => updateScale("default")}
              aria-pressed={scale === "default"}
            >
              A
            </button>
            <button
              type="button"
              className={cn("px-1 text-base", scale === "large" && "font-bold text-india-saffron")}
              onClick={() => updateScale("large")}
              aria-pressed={scale === "large"}
            >
              A+
            </button>
          </div>
          <button
            type="button"
            className="rounded border border-white/30 px-2 py-0.5"
            onClick={toggleContrast}
            aria-pressed={contrast}
          >
            High contrast
          </button>
          <span className="text-white/80">English</span>
        </div>
      </Container>
    </div>
  );
}
