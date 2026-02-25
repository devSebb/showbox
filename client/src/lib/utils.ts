import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BUENPLAN_FALLBACK_EVENT_URL = "https://www.buenplan.com.ec/event/quorum-figth-xiii-2025-quito"
const BUENPLAN_BASE_LENGTH = "https://www.buenplan.com.ec".length

/** Use fallback event URL when ticketUrl is missing or only the base domain (avoids linking to buenplan homepage). */
export function effectiveTicketUrl(ticketUrl: string | null | undefined): string {
  const trimmed = ticketUrl?.replace(/\/+$/, "") ?? ""
  return trimmed.length > BUENPLAN_BASE_LENGTH ? trimmed : BUENPLAN_FALLBACK_EVENT_URL
}
