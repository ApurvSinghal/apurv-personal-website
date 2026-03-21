"use client";

import { useEffect } from "react";

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
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}
