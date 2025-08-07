import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const apiUrl = "https://xwer1yi8u0.execute-api.eu-west-1.amazonaws.com/v1";
