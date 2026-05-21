import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CAREER_START_YEAR } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsOfExperience(): number {
  return new Date().getFullYear() - CAREER_START_YEAR;
}

export function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}
