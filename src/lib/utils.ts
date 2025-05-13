import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with clsx and tailwind-merge
 * This is useful for conditionally applying Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendOrderProcessingFailedEmail(data: any) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/order-failed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
}
export async function sendOrderProcessingSucceededEmail(data: any) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/order-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
}
