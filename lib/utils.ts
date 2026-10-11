import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** User-facing message for a caught error from a server action. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong") {
  return err instanceof Error && err.message ? err.message : fallback;
}
