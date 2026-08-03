"use client";

import { useEffect, useState } from "react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export function HomeEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true), { timeout: 300 })
      : window.setTimeout(() => setReady(true), 150);

    return () => {
      if (typeof id === "number") {
        clearTimeout(id);
        return;
      }

      window.cancelIdleCallback?.(id);
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <AnimateOnScroll />
      <KeyboardShortcuts />
    </>
  );
}
