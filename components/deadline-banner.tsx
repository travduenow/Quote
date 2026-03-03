"use client"

import { useEffect, useState } from "react"
import { DEADLINE } from "@/lib/constants"

export function DeadlineBanner() {
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    function tick() {
      const now = new Date()
      const diff = DEADLINE.getTime() - now.getTime()

      if (diff <= 0) {
        const nextDeadline = new Date(DEADLINE)
        nextDeadline.setFullYear(nextDeadline.getFullYear() + 1)
        const nextDiff = nextDeadline.getTime() - now.getTime()
        const d = Math.floor(nextDiff / 86400000)
        const h = Math.floor((nextDiff % 86400000) / 3600000)
        const m = Math.floor((nextDiff % 3600000) / 60000)
        const s = Math.floor((nextDiff % 60000) / 1000)
        setCountdown(`— Next deal opens in ${d}d ${h}h ${m}m ${s}s`)
      } else {
        const d = Math.floor(diff / 86400000)
        const h = Math.floor((diff % 86400000) / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setCountdown(`— ${d}d ${h}h ${m}m ${s}s remaining`)
      }
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-gradient-to-r from-tn-gold-dark via-tn-gold to-tn-gold-dark px-5 py-[13px] text-center font-black text-[0.9em] tracking-wide text-tn-forest relative overflow-hidden">
      <span className="animate-blink">🗓️</span>{" "}
      <strong>SIGN UP BY APRIL 1 — Lock in 5% off &amp; add-ons included.</strong>{" "}
      <span className="font-serif text-[1.3em] tracking-[2px] ml-2" suppressHydrationWarning>
        {countdown}
      </span>
    </div>
  )
}
