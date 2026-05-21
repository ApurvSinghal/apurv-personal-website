import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CAREER_START_MONTH_INDEX, CAREER_START_YEAR } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsOfExperience(): number {
  const now = new Date();
  const yearsSinceCareerStart = now.getUTCFullYear() - CAREER_START_YEAR;
  const hasReachedWorkAnniversary = now.getUTCMonth() >= CAREER_START_MONTH_INDEX;

  return Math.max(0, hasReachedWorkAnniversary ? yearsSinceCareerStart : yearsSinceCareerStart - 1);
}

export function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}
