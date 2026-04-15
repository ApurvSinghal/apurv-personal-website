"use client";

import { useEffect } from "react";
import { addBrowserPageAction } from "@/lib/newrelic-browser";

export function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) return;

      if (e.key === "c" || e.key === "C") {
        addBrowserPageAction("KeyboardShortcutUsed", {
          key: "c",
          target: "contact",
        });
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll depth tracking — fire at 25%, 50%, 75%, 100%
  useEffect(() => {
    const thresholds = new Set<number>();
    const milestones = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const percent = Math.round((window.scrollY / scrollHeight) * 100);

      for (const milestone of milestones) {
        if (percent >= milestone && !thresholds.has(milestone)) {
          thresholds.add(milestone);
          addBrowserPageAction("ScrollDepthReached", {
            depthPercent: milestone,
            pathname: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
