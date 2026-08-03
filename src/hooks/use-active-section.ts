"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const idByElement = new Map<Element, string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const id = idByElement.get(entry.target);
          if (id) {
            setActiveSection(id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (!element) {
        continue;
      }

      idByElement.set(element, id);
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
