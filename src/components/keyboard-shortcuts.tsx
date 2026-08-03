"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    let lastScrollAt = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.repeat ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return;

      if (e.key === "c" || e.key === "C") {
        const now = Date.now();
        if (now - lastScrollAt < 300) {
          return;
        }

        lastScrollAt = now;
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
