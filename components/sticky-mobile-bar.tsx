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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-tn-forest text-tn-white px-[18px] py-[10px] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex items-center justify-between gap-3 print:hidden">
      <div>
        <div className="text-[0.68em] tracking-[2px] uppercase text-white/60 font-bold">Your Quote</div>
        <div className="font-serif text-[1.5em] tracking-[2px] text-tn-gold">{fmt(quoteData.total)}</div>
      </div>
      <button
        onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="bg-tn-gold text-tn-forest border-none rounded px-[18px] py-[10px] font-serif text-base tracking-[1.5px] cursor-pointer whitespace-nowrap shrink-0"
      >
        Book Now →
      </button>
    </div>
  )
}
