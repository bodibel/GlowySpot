"use client"

import { Crown, Clock, AlertTriangle, XCircle } from "lucide-react"

type Plan = "FREE" | "STANDARD" | "PREMIUM"
type Status = "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELLED"

interface SubscriptionBadgeProps {
  plan: Plan
  status: Status
  freeExpiresAt?: string | Date | null
  currentPeriodEnd?: string | Date | null
  cancelAtPeriodEnd?: boolean
}

function getDaysLeft(date: string | Date | null | undefined): number | null {
  if (!date) return null
  const ms = new Date(date).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function SubscriptionBadge({
  plan,
  status,
  freeExpiresAt,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: SubscriptionBadgeProps) {
  // Lejárt / inaktív
  if (status === "INACTIVE" || status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
        <XCircle className="h-3 w-3" />
        Lejárt
      </span>
    )
  }

  if (status === "PAST_DUE") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle className="h-3 w-3" />
        Fizetés sikertelen
      </span>
    )
  }

  // PREMIUM
  if (plan === "PREMIUM") {
    const daysLeft = cancelAtPeriodEnd ? getDaysLeft(currentPeriodEnd) : null
    if (daysLeft !== null && daysLeft <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Crown className="h-3 w-3" />
          Prémium · {daysLeft}n
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C87860]/10 text-[#C87860] border border-[#C87860]/20">
        <Crown className="h-3 w-3 fill-current" />
        Prémium
      </span>
    )
  }

  // STANDARD
  if (plan === "STANDARD") {
    const daysLeft = cancelAtPeriodEnd ? getDaysLeft(currentPeriodEnd) : null
    if (daysLeft !== null && daysLeft <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="h-3 w-3" />
          Standard · {daysLeft}n
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
        <Clock className="h-3 w-3" />
        Standard
      </span>
    )
  }

  // FREE
  const daysLeft = getDaysLeft(freeExpiresAt)
  if (daysLeft === null) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
        Ingyenes
      </span>
    )
  }

  if (daysLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
        <XCircle className="h-3 w-3" />
        Lejárt
      </span>
    )
  }

  if (daysLeft <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle className="h-3 w-3" />
        {daysLeft} nap múlva lejár
      </span>
    )
  }

  if (daysLeft <= 14) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="h-3 w-3" />
        {daysLeft} nap múlva lejár
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
      <Clock className="h-3 w-3" />
      Ingyenes · {daysLeft} nap
    </span>
  )
}
