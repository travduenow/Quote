"use client"

import { useEffect, useState } from "react"
import { useQuote } from "@/lib/quote-context"
import { fmt } from "@/lib/constants"

export function StickyMobileBar() {
  const { quoteData, quoteUnlocked } = useQuote()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function updateBar() {
      if (window.innerWidth > 1080 || !quoteData || !quoteUnlocked) {
        setVisible(false)
        return
      }
      const calcEl = document.getElementById("calculator")
      const bookingEl = document.getElementById("booking")
      if (!calcEl || !bookingEl) { setVisible(false); return }

      const calcBottom = calcEl.getBoundingClientRect().bottom
      const bookingBottom = bookingEl.getBoundingClientRect().bottom

      setVisible(calcBottom < 0 && bookingBottom > 60)
    }

    window.addEventListener("scroll", updateBar, { passive: true })
    window.addEventListener("resize", updateBar, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateBar)
      window.removeEventListener("resize", updateBar)
    }
  }, [quoteData, quoteUnlocked])

  if (!visible || !quoteData) return null

  const d = quoteData
  const isSub = d.isSub
  const displayPrice = isSub ? `${fmt(d.weeklyPayment ?? 0)}/week` : fmt(d.total)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-gradient-to-br from-tn-forest to-tn-field text-tn-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex items-center justify-between gap-3 print:hidden" role="status" aria-live="polite">
      <div className="flex-1 min-w-0">
        <div className="text-[0.65em] tracking-[2px] uppercase text-white/70 font-bold">Your {isSub ? "Weekly" : "Total"} Quote</div>
        <div className="font-serif text-[1.4em] tracking-[2px] text-tn-gold truncate">{displayPrice}</div>
      </div>
      <button
        onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="bg-tn-gold text-tn-forest border-none rounded px-4 py-2 font-serif text-sm tracking-[1.5px] cursor-pointer whitespace-nowrap shrink-0 transition-all hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
      >
        Book →
      </button>
    </div>
  )
}
