"use client"

import { memo, useState, useRef, type FormEvent } from "react"
import { useQuote } from "@/lib/quote-context"
import {
  fmt, LOT_LABELS, PAY_LABELS, EMAIL_RE, FORMSPREE_URL, isAfterDeadline,
} from "@/lib/constants"
import { Phone, RotateCcw } from "lucide-react"

function formatPhone(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 10)
  if (v.length >= 7) v = "(" + v.slice(0, 3) + ") " + v.slice(3, 6) + "-" + v.slice(6)
  else if (v.length >= 4) v = "(" + v.slice(0, 3) + ") " + v.slice(3)
  else if (v.length >= 1) v = "(" + v
  return v
}

export const BookingForm = memo(function BookingForm() {
  const { quoteData, gateName, gateEmail, gatePhone, gateReferral, gateContactPref } = useQuote()

  const [fname, setFname] = useState(gateName.split(" ")[0] || "")
  const [lname, setLname] = useState(gateName.split(" ").slice(1).join(" ") || "")
  const [email, setEmail] = useState(gateEmail)
  const [phone, setPhone] = useState(gatePhone)
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("MN")
  const [zip, setZip] = useState("")
  const [notes, setNotes] = useState("")
  const [startDate, setStartDate] = useState("")
  const [contactPref, setContactPref] = useState(gateContactPref)
  const [terms, setTerms] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())

  const formRef = useRef<HTMLDivElement>(null)

  const d = quoteData
  const useSA = d?.useSA ?? false

  const quoteSummary = d
    ? `${LOT_LABELS[d.lot]} | ${PAY_LABELS[d.pay]} | ${useSA ? "Service Total" : "Season Total"}: ${fmt(d.total)}`
    : ""

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrMsg("")

    const inv = new Set<string>()
    if (!fname.trim()) inv.add("fname")
    if (!lname.trim()) inv.add("lname")
    if (!email.trim() || !EMAIL_RE.test(email)) inv.add("email")
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) inv.add("phone")
    if (!address.trim()) inv.add("address")
    if (!city.trim()) inv.add("city")
    if (!state.trim()) inv.add("state")
    if (!zip.trim() || !/^\d{5}$/.test(zip)) inv.add("zip")
    if (!quoteSummary) inv.add("quote")
    if (!contactPref) inv.add("contactPref")
    if (!terms) inv.add("terms")

    setInvalidFields(inv)

    if (inv.size > 0) {
      if (inv.has("quote")) {
        setErrMsg("Please use the quote calculator above to build your quote before booking.")
      } else {
        setErrMsg("Please fill in all required fields, enter a valid phone number and email, select a contact preference, and agree to the terms.")
      }
      return
    }

    setSending(true)

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          from_name: `${fname.trim()} ${lname.trim()}`,
          from_email: email.trim(),
          phone: phone.trim(),
          address: [address.trim(), city.trim(), state.trim(), zip.trim()].join(", "),
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
          quote_summary: quoteSummary,
          contact_pref: contactPref,
          message: notes.trim() || "No additional notes.",
          start_date: startDate || "Not specified",
          referral: gateReferral || "Not specified",
          quote_date: new Date().toLocaleString("en-US"),
          website: "BookTrueNorth.com",
        }),
        signal: AbortSignal.timeout(8000),
      })

      if (!res.ok) throw new Error("Send failed")
      setSuccess(true)
    } catch (err) {
      setSending(false)
      setErrMsg(`Send failed: ${err instanceof Error ? err.message : "Unknown error"}. Please try again or call 763-280-1694.`)
    }
  }

  const inputCls = (field: string) =>
    `w-full px-[14px] py-3 border-2 rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white transition-colors focus:outline-none focus:border-tn-lime focus:shadow-[0_0_0_3px_rgba(140,184,58,0.15)] ${
      invalidFields.has(field) ? "border-tn-error" : "border-tn-border"
    }`

  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  if (success) {
    const deadlineActive = !isAfterDeadline()
    return (
      <div className="px-8 py-12 text-center bg-gradient-to-br from-[#edf8d8] to-[#d4f0a8] rounded-b-xl">
        <div className="text-[3.5em] mb-4">✅</div>
        <h3 className="font-serif text-[2.2em] tracking-[2px] text-tn-forest mb-2">{"You're"} All Set!</h3>
        <p className="text-tn-gray text-base mb-7">Your booking request was received. {"Here's"} what to expect:</p>

        <div className="flex flex-col max-w-[380px] mx-auto mb-7 text-left">
          {[
            { icon: "📬", title: "Confirmation email on its way", text: "Check your inbox (and spam folder) for a summary of your request." },
            { icon: "📞", title: "We'll reach out within 24 hours", text: "A team member will contact you at your preferred method to confirm your schedule and details." },
            { icon: "🗓️", title: "Your season gets locked in", text: "Once confirmed, your recurring schedule is set — no need to call each week." },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-[14px] py-[14px] border-b border-tn-forest/15 last:border-b-0">
              <div className="shrink-0 w-[38px] h-[38px] bg-tn-forest text-tn-white rounded-full flex items-center justify-center text-[1.1em] mt-px">
                {step.icon}
              </div>
              <div>
                <strong className="block font-sans font-bold text-[0.95em] text-tn-forest mb-0.5">{step.title}</strong>
                <span className="text-[0.85em] text-tn-gray leading-[1.4]">{step.text}</span>
              </div>
            </div>
          ))}
        </div>

        {deadlineActive && (
          <p className="font-black text-tn-forest text-base mt-[14px] mb-4">
            📅 Sign up by April 1 to lock in your 5% Compass Care discount!
          </p>
        )}

        <div className="flex flex-wrap gap-[10px] justify-center mt-[22px]">
          <a
            href="tel:7632801694"
            className="inline-flex items-center gap-[7px] bg-tn-gold text-tn-white font-serif text-[1.05em] tracking-[2px] px-[22px] py-[11px] rounded-lg no-underline shadow-[0_3px_10px_rgba(239,162,67,0.35)] hover:bg-tn-gold-dark transition-colors"
          >
            <Phone className="w-4 h-4" /> Call 763-280-1694
          </a>
          <button
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-[7px] bg-transparent border-2 border-tn-forest text-tn-forest font-serif text-[1.05em] tracking-[2px] px-[22px] py-[11px] rounded-lg cursor-pointer hover:bg-tn-forest hover:text-tn-white transition-all"
          >
            <RotateCcw className="w-4 h-4" /> New Quote
          </button>
        </div>

        <p className="mt-4 text-[0.8em] text-tn-lgray">
          BookTrueNorth.com &middot; True North Enterprises MN
        </p>
      </div>
    )
  }

  return (
    <div ref={formRef} className="relative">
      {/* Sending overlay */}
      {sending && (
        <div className="absolute inset-0 bg-white/90 rounded-xl z-10 flex items-center justify-center flex-col gap-[14px]">
          <div className="w-[42px] h-[42px] border-4 border-tn-stone border-t-tn-forest rounded-full animate-spin-custom" />
          <div className="font-serif text-[1.2em] tracking-[2px] text-tn-forest">Sending Your Request...</div>
        </div>
      )}

      {/* Form Progress */}
      <div className="mb-6 px-4 py-3 bg-tn-cream rounded-lg">
        <div className="flex items-center justify-between text-[0.75em] font-black tracking-[1.5px] uppercase text-tn-forest mb-2">
          <span>Booking Form Progress</span>
          <span className="text-tn-gold">~60% Complete</span>
        </div>
        <div className="w-full h-2 bg-tn-stone rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-tn-gold to-tn-field w-3/5 transition-all" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-[18px] mb-[18px] max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">First Name *</label>
            <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="John" className={inputCls("fname")} />
            {invalidFields.has("fname") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Last Name *</label>
            <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Doe" className={inputCls("lname")} />
            {invalidFields.has("lname") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Required</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[18px] mb-[18px] max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Email Address *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className={inputCls("email")} />
            {invalidFields.has("email") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Valid email required</p>}
          </div>
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Phone Number *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(763) 123-4567" maxLength={14} className={inputCls("phone")} />
            {invalidFields.has("phone") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Valid phone required</p>}
          </div>
        </div>

        <div className="mb-[18px]">
          <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Street Address *</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" className={inputCls("address")} />
          {invalidFields.has("address") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Required</p>}
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr] gap-[18px] mb-[18px] max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">City *</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Minneapolis" className={inputCls("city")} />
            {invalidFields.has("city") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">State *</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={2} className={inputCls("state")} />
            {invalidFields.has("state") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">ZIP Code *</label>
            <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="55401" maxLength={5} inputMode="numeric" className={inputCls("zip")} />
            {invalidFields.has("zip") && <p className="text-[0.7em] text-tn-error font-semibold mt-1">5 digits</p>}
          </div>
        </div>

        {useSA && (
          <div className="mb-[18px]">
            <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Preferred Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={minDate} className={inputCls("startDate")} />
          </div>
        )}

        <div className="mb-[18px]">
          <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know about your property, access, pets, timing preferences, etc.?"
            className="w-full px-[14px] py-3 border-2 border-tn-border rounded-[7px] font-sans text-[0.93em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime focus:shadow-[0_0_0_3px_rgba(140,184,58,0.15)] resize-y min-h-[88px]"
          />
        </div>

        <div className="mb-[18px]">
          <label className="block text-[0.72em] font-black tracking-[2px] uppercase text-tn-forest mb-[6px]">Preferred Contact Method *</label>
          <div className="flex gap-[18px] flex-wrap mt-[6px]">
            {[
              { value: "phone", label: "📞 Phone Call" },
              { value: "text", label: "💬 Text Message" },
              { value: "email", label: "📧 Email" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-[0.88em] cursor-pointer">
                <input
                  type="radio"
                  name="contactPref"
                  value={opt.value}
                  checked={contactPref === opt.value}
                  onChange={(e) => setContactPref(e.target.value)}
                  className="accent-tn-field"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-0">
          <label className="flex items-start gap-[10px] bg-tn-cream rounded-[7px] p-[14px] text-[0.83em] text-tn-gray cursor-pointer">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="accent-tn-field mt-0.5 shrink-0"
            />
            I agree to be contacted by True North Outdoor Services / True North Enterprises MN regarding my quote and scheduling. This form is a request only and is not a final binding contract.
          </label>
        </div>

        {errMsg && (
          <div className="bg-[#fff0f0] border-2 border-tn-error rounded-[7px] px-4 py-3 mt-3 text-[0.83em] text-tn-error font-semibold leading-relaxed">
            {errMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full mt-[22px] bg-gradient-to-br from-tn-forest to-tn-field text-tn-white border-none cursor-pointer font-serif text-[1.4em] tracking-[3px] uppercase py-[18px] rounded-lg transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(26,61,10,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          Submit My Booking Request
        </button>
      </form>
    </div>
  )
})
