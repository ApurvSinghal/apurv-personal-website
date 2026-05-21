import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CAREER_START_DAY, CAREER_START_MONTH, CAREER_START_YEAR } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsOfExperience(): number {
  const now = new Date();
  const yearsSinceCareerStart = now.getFullYear() - CAREER_START_YEAR;
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const hasReachedWorkAnniversary =
    currentMonth > CAREER_START_MONTH ||
    (currentMonth === CAREER_START_MONTH && currentDay >= CAREER_START_DAY);

  return Math.max(0, hasReachedWorkAnniversary ? yearsSinceCareerStart : yearsSinceCareerStart - 1);
}

export function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}
