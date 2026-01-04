import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper for Tailwind classes (you already have this in other files, but good to centralize)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper for Money
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// Helper for Dates
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}
