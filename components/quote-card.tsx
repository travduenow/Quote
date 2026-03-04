"use client"

import { useState } from "react"
import { useQuote } from "@/lib/quote-context"
import {
  fmt, SUB_MOWING, WEEKS, SUB_DISC_RATE, DEADLINE, FORMSPREE_URL, EMAIL_RE, LOT_LABELS,
} from "@/lib/constants"
import { Printer, Lock, Mail, ArrowRight } from "lucide-react"

export function QuoteCard() {
  const { 
    quoteData, setPayMethod, calcQuote, serviceType, lotSize,
    quoteUnlocked, setQuoteUnlocked, setGateEmail, setGateName, setGatePhone
  } = useQuote()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const d = quoteData
  const isIndividual = serviceType === "individual"
  const isCustomQuote = lotSize === "acreplus"

  function scrollToBooking() {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function formatPhoneInput(value: string): string {
    let v = value.replace(/\D/g, "").slice(0, 10)
    if (v.length >= 7) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6)
    else if (v.length >= 4) v = "(" + v.slice(0, 3) + ") " + v.slice(3)
    else if (v.length >= 1) v = "(" + v
    return v
  }

  // Handle unlocking the quote
  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setSending(true)

    try {
      // Build quote summary for the email
      const servicesList = d ? Object.keys(d.aos).join(", ") || "Mowing" : "Mowing"
      
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          from_name: name.trim() || "Not provided",
          from_email: email.trim(),
          phone: phone.trim() || "Not provided",
          request_type: "Quote View Request",
          service_type: serviceType === "compass" ? "Compass Care" : "Individual Services",
          lot_size: LOT_LABELS[lotSize] || lotSize,
          services_selected: servicesList,
          estimated_total: d ? (isCustomQuote ? "Custom Quote Required" : fmt(d.total)) : "N/A",
          quote_date: new Date().toLocaleString("en-US"),
          website: "BookTrueNorth.com",
        }),
        signal: AbortSignal.timeout(8000),
      })

      // Store the info for the booking form
      setGateEmail(email.trim())
      setGateName(name.trim())
      setGatePhone(phone.trim())
      setQuoteUnlocked(true)
    } catch (err) {
      console.error("Quote unlock failed:", err)
      setError("Could not send. Please try again.")
    }

    setSending(false)
  }

  // Empty state - hidden until quote is calculated
  if (!d) {
    return null
  }

  // Gate view - show email form before revealing quote
  if (!quoteUnlocked) {
    return (
      <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
        <div className="bg-gradient-to-br from-tn-forest to-tn-green px-6 py-6 text-center">
          <h3 className="font-serif text-[1.5em] tracking-[2px] text-tn-white uppercase mb-1">Your Quote is Ready</h3>
          <p className="text-[0.8em] text-white/65">Enter your info to view pricing</p>
        </div>

        <div className="px-6 py-6">
          {/* Teaser info */}
          <div className="bg-tn-cream rounded-lg p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-tn-forest" />
              <span className="font-bold text-[0.9em] text-tn-forest">Quote Summary</span>
            </div>
            <div className="space-y-2 text-[0.85em]">
              <div className="flex justify-between">
                <span className="text-tn-gray">Service Type</span>
                <span className="font-semibold text-tn-charcoal">
                  {serviceType === "compass" ? "Compass Care" : "Individual Services"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-tn-gray">Property Size</span>
                <span className="font-semibold text-tn-charcoal">{LOT_LABELS[lotSize] || lotSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tn-gray">Services Selected</span>
                <span className="font-semibold text-tn-charcoal">{Object.keys(d.aos).length || 1}</span>
              </div>
            </div>
          </div>

          {/* Email gate form */}
          <form onSubmit={handleUnlock} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-tn-border rounded-lg font-sans text-[0.9em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-tn-border rounded-lg font-sans text-[0.9em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                maxLength={14}
                className="w-full px-4 py-3 border-2 border-tn-border rounded-lg font-sans text-[0.9em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime"
              />
            </div>

            {error && (
              <div className="text-[0.8em] text-tn-error font-semibold">{error}</div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-tn-gold text-tn-forest font-serif text-[1.2em] tracking-[2px] uppercase py-4 rounded-lg border-none cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(232,185,35,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? "Loading..." : (
                <>
                  <Mail className="w-5 h-5" />
                  View My Quote
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-[0.72em] text-tn-lgray text-center mt-3">
            We will send your quote details and may follow up to help you get started.
          </p>
        </div>
      </div>
    )
  }

  // Full quote result (after email is provided)
  const aoKeys = Object.keys(d.aos)
  const nextDeadline = new Date(DEADLINE)
  nextDeadline.setFullYear(nextDeadline.getFullYear() + 1)
  const nextStr = nextDeadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  // Switch & save calculation
  let switchSaving = 0
  if (d.useSA && !d.deadlinePassed && !isCustomQuote && SUB_MOWING[d.lot]) {
    const subMowTotal = SUB_MOWING[d.lot] * WEEKS
    const subSubtotal = subMowTotal + d.aosTotal
    const subDiscount = subSubtotal * SUB_DISC_RATE
    const subTotal = subSubtotal - subDiscount
    switchSaving = d.total - subTotal
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-[var(--shadow-md)] bg-tn-white sticky top-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
      <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[26px] py-5 text-center">
        <h3 className="font-serif text-[1.5em] tracking-[2px] text-tn-white uppercase mb-0">Your Quote</h3>
        <p className="text-[0.75em] text-white/65">True North Outdoor Services</p>
      </div>

      {/* Deadline notice */}
      {d.deadlinePassed && d.pay !== "standalone" && (
        <div className="bg-tn-gold text-tn-forest px-5 py-2 text-[0.8em] font-bold text-center">
          Sign-up closed April 1 — next deal opens {nextStr}!
        </div>
      )}

      <div className="px-5 py-5">
        {/* Services Section */}
        <div className="mb-4">
          <div className="text-[0.65em] font-black tracking-[2px] uppercase text-tn-lgray pb-1 border-b border-tn-stone mb-2">
            {isIndividual ? "Selected Services" : d.isSub ? "Compass Care (30 Weeks)" : "Service"}
          </div>
          {!isIndividual && !isCustomQuote && (
            <>
              <div className="flex justify-between items-start py-1 text-[0.85em]">
                <span className="text-tn-gray">
                  Weekly Mowing
                  {d.isSub && (
                    <span className="block text-[0.72em] text-tn-success font-bold mt-0.5">
                      + Spring/Fall Cleanup + 1 Edging
                    </span>
                  )}
                </span>
                <span className="font-bold text-tn-field">{fmt(d.weeklyMow)}/wk</span>
              </div>
              <div className="flex justify-between items-center py-1 text-[0.85em]">
                <span className="text-tn-gray">{d.isSub ? "Season (x30)" : "Per Visit"}</span>
                <span className="font-bold text-tn-charcoal">{fmt(d.mowingTotal)}</span>
              </div>
            </>
          )}
          {!isIndividual && isCustomQuote && (
            <div className="flex justify-between items-center py-1 text-[0.85em]">
              <span className="text-tn-gray">Weekly Mowing (30 weeks)</span>
              <span className="font-bold text-tn-gold-dark text-[0.82em]">Custom quote</span>
            </div>
          )}
          {isIndividual && aoKeys.map((k) => (
            <div key={k} className="flex justify-between items-center py-1 text-[0.85em]">
              <span className="text-tn-gray text-[0.9em]">{k}</span>
              <span className={`font-bold ${d.aos[k] === null ? "text-tn-gold-dark text-[0.75em]" : "text-tn-charcoal"}`}>
                {d.aos[k] === null ? "Quote" : fmt(d.aos[k]!)}
              </span>
            </div>
          ))}
        </div>

        {/* Add-ons Section (Compass Care only) */}
        {!isIndividual && aoKeys.length > 0 && (
          <div className="mb-4">
            <div className="text-[0.65em] font-black tracking-[2px] uppercase text-tn-lgray pb-1 border-b border-tn-stone mb-2">
              Add-Ons
            </div>
            {aoKeys.map((k) => (
              <div key={k} className="flex justify-between items-center py-1 text-[0.85em]">
                <span className="text-tn-gray text-[0.9em]">{k}</span>
                <span className={`font-bold ${d.aos[k] === null ? "text-tn-gold-dark text-[0.75em]" : "text-tn-charcoal"}`}>
                  {d.aos[k] === null ? "Quote" : fmt(d.aos[k]!)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Discount */}
        {d.discount > 0 && (
          <div className="flex justify-between items-center py-1 text-[0.85em] mb-2">
            <span className="text-tn-gray">Compass Care Discount</span>
            <span className="font-bold text-tn-success">-{fmt(d.discount)}</span>
          </div>
        )}

        {/* Switch offer */}
        {switchSaving > 0 && (
          <div className="bg-gradient-to-br from-[#edf8d8] to-[#d4f0a8] border border-tn-lime rounded-lg px-3 py-2 text-[0.8em] text-tn-forest mb-3">
            <strong>Switch to Compass Care</strong> for discounted rate + free cleanups.
            <button
              onClick={() => { setPayMethod("card"); setTimeout(calcQuote, 50); }}
              className="block mt-2 bg-tn-forest text-tn-gold text-[0.85em] px-3 py-1 rounded border-none cursor-pointer"
            >
              Switch
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="h-0.5 bg-tn-stone my-3" />

        {/* Total */}
        <div className="flex justify-between items-baseline">
          <span className="font-serif text-[1.1em] tracking-[1px] uppercase text-tn-forest">
            {isCustomQuote ? "Status" : d.isSub ? "Season Total" : "Total"}
          </span>
          {isCustomQuote ? (
            <span className="font-serif text-[1.2em] text-tn-gold-dark tracking-[1px]">
              Custom Quote
            </span>
          ) : (
            <span className="font-serif text-[2.2em] text-tn-forest tracking-[1px] leading-none">
              {fmt(d.total)}
            </span>
          )}
        </div>

        {/* Payment info */}
        {isCustomQuote ? (
          <div className="bg-tn-gold rounded-lg px-4 py-3 text-center mt-3">
            <div className="text-[0.8em] font-bold text-tn-forest">
              1+ acre properties require custom pricing.
            </div>
          </div>
        ) : (
          <div className="bg-tn-forest rounded-lg px-4 py-3 text-center mt-3">
            <div className="text-[0.65em] font-bold tracking-[1px] uppercase text-white/60 mb-0.5">
              {d.isSub && d.pay === "card" ? "Weekly (x30)" : d.pay === "cash" ? "Cash" : "Card"}
            </div>
            <div className="font-serif text-[1.6em] tracking-[1px] text-tn-gold">
              {d.isSub && d.pay === "card" ? fmt(d.weeklyPayment ?? 0) + "/wk" : fmt(d.total)}
            </div>
          </div>
        )}

        {/* Book CTA */}
        <button
          onClick={scrollToBooking}
          className="block w-full mt-4 bg-tn-gold text-tn-forest font-serif text-[1.15em] tracking-[2px] uppercase text-center py-3 rounded-md border-none cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(232,185,35,0.4)]"
        >
          Book Service
        </button>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 w-full mt-2 bg-transparent border border-tn-border text-tn-gray font-sans font-bold text-[0.75em] tracking-[1px] uppercase py-2 rounded-md cursor-pointer transition-all hover:border-tn-forest hover:text-tn-forest"
        >
          <Printer className="w-3 h-3" />
          Print Quote
        </button>
      </div>
    </div>
  )
}
