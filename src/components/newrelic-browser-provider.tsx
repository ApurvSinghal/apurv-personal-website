"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import {
  initializeBrowserMonitoring,
  noticeBrowserError,
  recordBrowserEvent,
} from "@/lib/newrelic-browser";

const trackedSectionIds = ["about", "experience", "skills", "projects", "contact"];

export function NewRelicBrowserProvider() {
  const pathname = usePathname();
  const observedSectionsRef = useRef<Set<string>>(new Set());

  useReportWebVitals((metric) => {
    recordBrowserEvent("WebVitalEvent", {
      metricId: metric.id,
      metricName: metric.name,
      metricRating: metric.rating ?? "unknown",
      metricValue: Number(metric.value.toFixed(2)),
      pathname,
    });
  });

  useEffect(() => {
    initializeBrowserMonitoring();
    observedSectionsRef.current = new Set();

    recordBrowserEvent("PortfolioPageView", {
      pathname,
      referrer: document.referrer || "direct",
      title: document.title,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) {
            continue;
          }

          const sectionId = entry.target.id;

          if (!sectionId || observedSectionsRef.current.has(sectionId)) {
            continue;
          }

          observedSectionsRef.current.add(sectionId);
          recordBrowserEvent("PortfolioSectionView", {
            pathname,
            sectionId,
          });
        }
      },
      {
        threshold: [0.6],
      },
    );

    for (const sectionId of trackedSectionIds) {
      const element = document.getElementById(sectionId);

      if (element) {
        observer.observe(element);
      }
    }

    const handleWindowError = (event: ErrorEvent) => {
      const error =
        event.error instanceof Error
          ? event.error
          : new Error(event.message || "Unknown browser error");

      noticeBrowserError(error, {
        pathname,
        source: "window.error",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason ?? "Unhandled promise rejection"));

      noticeBrowserError(error, {
        pathname,
        source: "unhandledrejection",
      });
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      observer.disconnect();
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [pathname]);

  return null;
}
