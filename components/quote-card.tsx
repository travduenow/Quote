"use client"

import { memo, useState } from "react"
import { useQuote } from "@/lib/quote-context"
import {
  fmt, LOT_LABELS, PAY_LABELS, SUB_MOWING, WEEKS, SUB_DISC_RATE, CARD_FEE_RATE,
  EMAIL_RE, FORMSPREE_URL, REFERRAL_OPTIONS, DEADLINE,
} from "@/lib/constants"
import { Printer } from "lucide-react"
import { saveQuote } from "@/lib/quote-history"

function formatPhone(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 10)
  if (v.length >= 7) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6)
  else if (v.length >= 4) v = "(" + v.slice(0, 3) + ") " + v.slice(3)
  else if (v.length >= 1) v = "(" + v
  return v
}

export const QuoteCard = memo(function QuoteCard() {
  const {
    quoteData, quoteUnlocked, setQuoteUnlocked, payMethod, setPayMethod,
    gateName, setGateName, gateEmail, setGateEmail,
    gatePhone, setGatePhone, gateReferral, setGateReferral,
    gateContactPref, setGateContactPref, calcQuote, isCalculating,
  } = useQuote()

  const [gateError, setGateError] = useState("")
  const [gateSending, setGateSending] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  const d = quoteData

  async function submitGate() {
    setGateError("")

    if (!gateName.trim()) { setGateError("Please enter your name."); return }
    if (!gateEmail.trim() || !EMAIL_RE.test(gateEmail)) { setGateError("Please enter a valid email address."); return }
    if (!gateReferral) { setGateError("Please let us know how you heard about us."); return }
    if (!gateContactPref) { setGateError("Please select a preferred contact method."); return }

    setGateSending(true)

    try {
      const qSummary = d
        ? `${LOT_LABELS[d.lot]} | ${PAY_LABELS[d.pay]} | ${d.isSub ? "Season Total" : "Service Total"}: ${fmt(d.total)}`
        : "Quote calculated"

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          from_name: gateName.trim(),
          from_email: gateEmail.trim(),
          phone: gatePhone.trim() || "Not provided",
          quote_summary: qSummary,
          contact_pref: gateContactPref,
          referral: gateReferral || "Not specified",
          message: "Quote reveal request.",
          quote_date: new Date().toLocaleString("en-US"),
          website: "BookTrueNorth.com",
        }),
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) throw new Error("Send failed")
    } catch (err) {
      console.error("Email gate submission failed:", err)
      // Still unlock quote but warn user their info may not have been received
      setGateError("Your quote is ready below, but we may not have received your info. Please double-check your email or call 763-280-1694.")
    }

    setGateSending(false)
    setQuoteUnlocked(true)
  }

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleSaveQuote() {
    if (!d) return
    saveQuote(d)
    setSavedMessage("Quote saved!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  // Empty state
  if (!d) {
    return (
      <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
        <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[26px] py-6 text-center pb-4">
          <h3 className="font-serif text-[1.7em] tracking-[2.5px] text-tn-white uppercase mb-[3px]">Your Quote</h3>
          <p className="text-[0.8em] text-white/65">True North Outdoor Services &middot; BookTrueNorth.com</p>
        </div>
        <div className="p-6">
          <div className="py-9 px-4 text-center">
            <div className="text-[2.8em] opacity-35 mb-[10px]">🌿</div>
            {/* Custom lot size selected */}
            {quoteData === null && lotSize === "custom" ? (
              <div className="space-y-4">
                <p className="text-[1.1em] font-serif tracking-[1px] text-tn-forest font-bold">Large Lot Sizing</p>
                <p className="text-[0.9em] leading-relaxed text-tn-gray mb-4">
                  For properties 1+ acres, we provide custom quotes based on your specific yard layout and service preferences.
                </p>
                <div className="bg-tn-gold/10 border-2 border-tn-gold/30 rounded-lg px-4 py-3">
                  <p className="text-[0.85em] font-semibold text-tn-forest">
                    📞 Call us for a personalized quote: <span className="text-tn-gold font-bold">763-280-1694</span>
                  </p>
                  <p className="text-[0.75em] text-tn-gray mt-2">
                    We're happy to discuss your property and find the perfect plan.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[0.85em] leading-relaxed text-tn-lgray">
                  Select lot size, add-ons &amp; payment above to see your quote.
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                  <div className="h-3 w-3 rounded-full bg-tn-stone/30 animate-pulse" />
                  <div className="h-3 w-3 rounded-full bg-tn-stone/30 animate-pulse" style={{ animationDelay: "0.1s" }} />
                  <div className="h-3 w-3 rounded-full bg-tn-stone/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Email gate (before revealing quote)
  if (!quoteUnlocked) {
    return (
      <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
        <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[26px] py-6 text-center pb-4">
          <h3 className="font-serif text-[1.7em] tracking-[2.5px] text-tn-white uppercase mb-[3px]">Your Quote</h3>
          <p className="text-[0.8em] text-white/65">True North Outdoor Services &middot; BookTrueNorth.com</p>
        </div>
        <div className="px-5 py-7 text-center">
          <div className="text-[2em] mb-2">🌿</div>
          {isCalculating ? (
            <div className="space-y-4">
              <div className="inline-block bg-tn-forest/10 rounded-lg px-6 py-4 w-full">
                <div className="flex gap-2 justify-center mb-3">
                  <div className="h-2 w-12 rounded-full bg-tn-stone/30 animate-pulse" />
                  <div className="h-2 w-12 rounded-full bg-tn-stone/30 animate-pulse" style={{ animationDelay: "0.1s" }} />
                  <div className="h-2 w-12 rounded-full bg-tn-stone/30 animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
                <div className="text-[0.85em] text-tn-gray font-medium">Calculating your price...</div>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-block bg-tn-forest text-tn-gold font-serif text-[1.55em] tracking-[3px] px-[22px] py-2 rounded-lg blur-[7px] select-none pointer-events-none mb-3">
                {d.isSub ? fmt(d.weeklyPayment ?? 0) + "/wk" : fmt(d.total) + " total"}
              </div>
              <div className="font-serif text-[1.5em] tracking-[2px] text-tn-forest mb-[6px]">Almost There!</div>
              <p className="text-[0.9em] text-tn-gray mb-[6px] leading-relaxed">
                Your personalized price is calculated and ready.<br />
                Enter your info below and {"we'll"} send it straight to your inbox — <strong className="text-tn-forest">no commitment required.</strong>
              </p>
            </>
          )}
          <p className="text-[0.8em] text-tn-lgray mb-5">
            🔒 Your info stays private. {"We're"} a small local crew — not a call center.
          </p>
          <div className="flex flex-col gap-[10px] max-w-[320px] mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className="w-full px-[14px] py-3 border-2 border-tn-border rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime focus:shadow-[0_0_0_3px_rgba(140,184,58,0.15)] text-left"
            />
            <input
              type="email"
              placeholder="Your Email Address"
              value={gateEmail}
              onChange={(e) => setGateEmail(e.target.value)}
              className="w-full px-[14px] py-3 border-2 border-tn-border rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime focus:shadow-[0_0_0_3px_rgba(140,184,58,0.15)] text-left"
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={gatePhone}
              onChange={(e) => setGatePhone(formatPhone(e.target.value))}
              maxLength={14}
              className="w-full px-[14px] py-3 border-2 border-tn-border rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime focus:shadow-[0_0_0_3px_rgba(140,184,58,0.15)] text-left"
            />
            <select
              value={gateReferral}
              onChange={(e) => setGateReferral(e.target.value)}
              className="w-full px-[14px] py-3 border-2 border-tn-border rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime text-left"
            >
              <option value="">— How did you hear about us? *</option>
              {REFERRAL_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <div className="text-left">
              <div className="text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">
                Best Way to Reach You *
              </div>
              <div className="flex gap-4 flex-wrap">
                {["phone", "text", "email"].map((pref) => (
                  <label key={pref} className="flex items-center gap-2 text-[0.88em] cursor-pointer">
                    <input
                      type="radio"
                      name="gateContactPref"
                      value={pref}
                      checked={gateContactPref === pref}
                      onChange={(e) => setGateContactPref(e.target.value)}
                      className="accent-tn-field"
                    />
                    {pref === "phone" ? "📞 Phone" : pref === "text" ? "💬 Text" : "📧 Email only"}
                  </label>
                ))}
              </div>
            </div>
            {gateError && (
              <div className="text-[0.78em] text-tn-error font-bold text-left">{gateError}</div>
            )}
            <button
              onClick={submitGate}
              disabled={gateSending || isCalculating}
              className="w-full bg-tn-gold text-tn-forest font-serif text-[1.15em] tracking-[2px] uppercase py-[14px] border-none rounded-md cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(232,185,35,0.45)] hover:bg-[#f5c842] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {gateSending ? "Sending..." : "Show Me My Price"}
            </button>
            <div className="text-[0.75em] text-tn-lgray leading-relaxed">
              {"We'll"} email your quote and only follow up if {"you'd"} like help getting started. No pressure, no spam — promise.
            </div>
          </div>
        </div>
      </div>
    )
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
    <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }} role="region" aria-live="polite" aria-label="Quote summary">
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

        {/* Save quote button */}
        <button
          type="button"
          onClick={handleSaveQuote}
          className="flex items-center justify-center gap-2 w-full mt-[9px] bg-transparent border-2 border-tn-gold text-tn-gold font-sans font-bold text-[0.8em] tracking-[1px] uppercase py-[10px] rounded-md cursor-pointer transition-all hover:border-tn-gold-dark hover:text-tn-gold-dark hover:bg-[#fff8e8]"
        >
          💾 Save This Quote
        </button>

        {savedMessage && (
          <div className="text-center text-[0.8em] text-tn-field font-semibold mt-2 animate-pulse">
            {savedMessage}
          </div>
        )}
      </div>
    </div>
  )
})
