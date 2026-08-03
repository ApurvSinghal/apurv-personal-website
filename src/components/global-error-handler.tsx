"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      Sentry.captureException(event.error ?? new Error(event.message), {
        tags: {
          source: "window.error",
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      Sentry.captureException(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        {
          tags: {
            source: "window.unhandledrejection",
          },
        },
      );
    };

    const shouldAttachHandlers = process.env.NODE_ENV === "production";
    if (!shouldAttachHandlers) {
      return () => {
        // no-op in development
      };
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null;
}
