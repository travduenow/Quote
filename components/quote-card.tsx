"use client"

import { useQuote } from "@/lib/quote-context"
import {
  fmt, SUB_MOWING, WEEKS, SUB_DISC_RATE, CARD_FEE_RATE, DEADLINE,
} from "@/lib/constants"
import { Printer } from "lucide-react"

export function QuoteCard() {
  const { quoteData, setPayMethod, calcQuote } = useQuote()

  const d = quoteData

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Empty state - hidden until quote is calculated
  if (!d) {
    return null
  }



  // Full quote result
  const aoKeys = Object.keys(d.aos)
  const nextDeadline = new Date(DEADLINE)
  nextDeadline.setFullYear(nextDeadline.getFullYear() + 1)
  const nextStr = nextDeadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  // Switch & save calculation — compare current SA total to what the same
  // services would cost on a subscription (mowing + priced add-ons)
  let switchSaving = 0
  if (d.useSA && !d.deadlinePassed) {
    const subMowTotal = SUB_MOWING[d.lot] * WEEKS
    const subSubtotal = subMowTotal + d.aosTotal
    const subDiscount = subSubtotal * SUB_DISC_RATE
    const subAfterDisc = subSubtotal - subDiscount
    const subCardFee = d.pay === "card" ? subAfterDisc * CARD_FEE_RATE : 0
    const subTotal = subAfterDisc + subCardFee
    switchSaving = d.total - subTotal
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
      <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[26px] py-6 text-center pb-4">
        <h3 className="font-serif text-[1.7em] tracking-[2.5px] text-tn-white uppercase mb-[3px]">Your Quote</h3>
        <p className="text-[0.8em] text-white/65">True North Outdoor Services &middot; BookTrueNorth.com</p>
      </div>

      {/* Deadline notice */}
      {d.deadlinePassed && d.pay !== "standalone" && (
        <div className="bg-tn-gold text-tn-forest px-5 py-[10px] text-[0.82em] font-bold text-center">
          Subscription sign-up closed April 1 — stand-alone pricing applied. Next deal opens {nextStr}!
        </div>
      )}

      <div className="px-6 py-[22px]">
        {/* Mowing Section */}
        <div className="mb-[18px]">
          <div className="text-[0.68em] font-black tracking-[2.5px] uppercase text-tn-lgray pb-[6px] border-b border-tn-stone mb-2">
            {d.isSub ? "Mowing Service (30 Weeks)" : "Mowing Service"}
          </div>
          <div className="flex justify-between items-start py-[5px] text-[0.87em]">
            <span className="text-tn-gray">
              Weekly Mowing Rate
              {d.isSub && (
                <span className="block mt-1 text-[0.75em] text-tn-success font-bold tracking-wide leading-relaxed">
                  Incl. Spring &amp; Fall Cleanup (1 each)<br />Incl. 2 Edging Visits
                </span>
              )}
            </span>
            <span className="font-bold text-tn-field">{fmt(d.weeklyMow)}{d.isSub ? "/wk" : "/visit"}</span>
          </div>
          <div className="flex justify-between items-center py-[5px] text-[0.87em]">
            <span className="text-tn-gray">{d.isSub ? "Mowing Subtotal (x30)" : "Mowing (Single Visit)"}</span>
            <span className="font-bold text-tn-charcoal">{fmt(d.mowingTotal)}</span>
          </div>
        </div>

        {/* Add-ons Section */}
        {aoKeys.length > 0 && (
          <div className="mb-[18px]">
            <div className="text-[0.68em] font-black tracking-[2.5px] uppercase text-tn-lgray pb-[6px] border-b border-tn-stone mb-2">
              Add-On Services
            </div>
            {aoKeys.map((k) => (
              <div key={k} className="flex justify-between items-center py-[5px] text-[0.87em]">
                <span className="text-tn-gray">{k}</span>
                <span className={`font-bold ${d.aos[k] === null ? "text-tn-gold-dark text-[0.78em]" : "text-tn-charcoal"}`}>
                  {d.aos[k] === null ? "TBD — we'll quote you" : fmt(d.aos[k]!)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="mb-[18px]">
          <div className="text-[0.68em] font-black tracking-[2.5px] uppercase text-tn-lgray pb-[6px] border-b border-tn-stone mb-2">
            Pricing Summary
          </div>
          <div className="flex justify-between items-center py-[5px] text-[0.87em]">
            <span className="text-tn-gray">Subtotal Before Adjustments</span>
            <span className="font-bold text-tn-charcoal">{fmt(d.subtotal)}</span>
          </div>
          {d.discount > 0 && (
            <div className="flex justify-between items-center py-[5px] text-[0.87em]">
              <span className="text-tn-gray">🏷️ 5% Compass Care Discount</span>
              <span className="font-bold text-tn-success">-{fmt(d.discount)}</span>
            </div>
          )}
          {d.cardFee > 0 && (
            <div className="flex justify-between items-center py-[5px] text-[0.87em]">
              <span className="text-tn-gray">💳 3% Card Service Fee</span>
              <span className="font-bold text-tn-warning">+{fmt(d.cardFee)}</span>
            </div>
          )}
        </div>

        {/* Badges */}
        {d.discount > 0 && (
          <div className="bg-gradient-to-br from-[#e8f8d0] to-[#d0f0a0] border border-tn-lime rounded-md px-[14px] py-[10px] text-[0.8em] font-bold text-tn-forest text-center my-3">
            🎉 {"You're"} saving <strong>{fmt(d.discount)}</strong> with the Compass Care 5% subscription discount!
          </div>
        )}
        {d.cardFee > 0 && (
          <div className="bg-[#fff8e0] border border-tn-gold rounded-md px-[14px] py-[9px] text-[0.78em] font-semibold text-tn-gold-dark text-center my-2">
            A 3% card processing fee is applied when paying by card.
          </div>
        )}
        {d.useSA && (
          <>
            <div className="bg-[#fff0e8] border border-tn-warning rounded-md px-[14px] py-[9px] text-[0.78em] font-semibold text-tn-warning text-center my-2">
              🔧 One-off / stand-alone pricing — no commitment required.
            </div>
            {switchSaving > 0 && (
              <div className="mt-2 bg-gradient-to-br from-[#edf8d8] to-[#d4f0a8] border-[1.5px] border-tn-lime rounded-lg px-[14px] py-[11px] text-[0.83em] text-tn-forest">
                💡 <strong>Switch to Compass Care and save {fmt(switchSaving)} this season</strong> — plus get Spring &amp; Fall Cleanup and 2 Edging visits included free.
                <br />
                <button
                  onClick={() => { setPayMethod("card"); setTimeout(calcQuote, 50); }}
                  className="mt-[7px] bg-tn-forest text-tn-gold border-none rounded px-[14px] py-[6px] font-serif text-base tracking-[1.5px] cursor-pointer"
                >
                  {"Switch to Subscription →"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Divider */}
        <div className="h-0.5 bg-tn-stone my-[14px]" />

        {/* Total */}
        <div className="flex justify-between items-baseline border-t-[3px] border-tn-forest pt-[14px] mt-2">
          <span className="font-serif text-[1.3em] tracking-[2px] uppercase text-tn-forest">
            {d.isSub ? "Season Total" : "Service Total"}
          </span>
          <span className="font-serif text-[2.8em] text-tn-forest tracking-[1px] leading-none">
            {fmt(d.total)}
          </span>
        </div>

        {/* Weekly payment box */}
        {(d.pay === "card" || d.pay === "cash") && (
          <div className="bg-tn-forest rounded-lg px-[18px] py-[14px] text-center mt-[14px]">
            <div className="text-[0.72em] font-bold tracking-[1.5px] uppercase text-white/60 mb-[3px]">
              {d.isSub && d.pay === "card" ? "Weekly Card Payment (x30 weeks)" :
               !d.isSub && d.pay === "card" ? "Card — One-Time Charge" :
               d.isSub && d.pay === "cash" ? "Cash — Paid in Full Upfront" :
               "Cash — Due at Service"}
            </div>
            <div className="font-serif text-[2em] tracking-[2px] text-tn-gold">
              {d.isSub && d.pay === "card" ? fmt(d.weeklyPayment ?? 0) + "/wk" :
               d.isSub ? fmt(d.total) + " due" :
               fmt(d.total) + (d.pay === "card" ? " total" : " due")}
            </div>
          </div>
        )}

        {/* Savings pill */}
        {d.discount > 0 && (
          <div className="text-center mt-[10px]">
            <span className="inline-block bg-tn-lime text-tn-forest font-black text-[0.78em] px-[14px] py-[5px] rounded-full tracking-wide">
              Saving {fmt(d.discount)} with Compass Care!
            </span>
          </div>
        )}

        {/* Book CTA */}
        <button
          onClick={scrollToBooking}
          className="block w-full mt-[18px] bg-tn-gold text-tn-forest font-serif text-[1.3em] tracking-[2px] uppercase text-center py-4 rounded-md border-none cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(232,185,35,0.4)]"
        >
          Book This Service →
        </button>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 w-full mt-[9px] bg-transparent border-2 border-tn-border text-tn-gray font-sans font-bold text-[0.8em] tracking-[1px] uppercase py-[10px] rounded-md cursor-pointer transition-all hover:border-tn-forest hover:text-tn-forest hover:bg-tn-cream"
        >
          <Printer className="w-4 h-4" />
          Print / Save Quote as PDF
        </button>
      </div>
    </div>
  )
}
