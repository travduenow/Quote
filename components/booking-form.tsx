"use client"

import { useState, useRef, type FormEvent } from "react"
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

export function BookingForm() {
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
  const [contactPref, setContactPref] = useState(gateContactPref || "phone")
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
    if (!zip.trim() || !/^\d{5}$/.test(zip)) inv.add("zip")
    if (!quoteSummary) inv.add("quote")
    if (!terms) inv.add("terms")

    setInvalidFields(inv)

    if (inv.size > 0) {
      if (inv.has("quote")) {
        setErrMsg("Please use the quote calculator above to build your quote first.")
      } else {
        setErrMsg("Please fill in all required fields and agree to the terms.")
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
          quote_summary: quoteSummary,
          contact_pref: contactPref,
          message: notes.trim() || "No additional notes.",
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
      setErrMsg(`Send failed. Please try again or call 763-280-1694.`)
    }
  }

  const inputCls = (field: string) =>
    `w-full px-3 py-2.5 border-2 rounded-lg font-sans text-[0.9em] text-tn-charcoal bg-tn-white transition-colors focus:outline-none focus:border-tn-lime ${
      invalidFields.has(field) ? "border-tn-error" : "border-tn-border"
    }`

  if (success) {
    const deadlineActive = !isAfterDeadline()
    return (
      <div className="px-6 py-8 text-center bg-gradient-to-br from-[#edf8d8] to-[#d4f0a8] rounded-xl">
        <div className="text-[2.5em] mb-3">Done!</div>
        <h3 className="font-serif text-[1.8em] tracking-[2px] text-tn-forest mb-2">Request Received</h3>
        <p className="text-tn-gray text-[0.9em] mb-5">We will contact you within 24 hours to confirm your schedule.</p>

        {deadlineActive && (
          <p className="font-bold text-tn-forest text-[0.9em] mb-4">
            Sign up by April 1 for your discounted rate!
          </p>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          <a
            href="tel:7632801694"
            className="inline-flex items-center gap-2 bg-tn-gold text-tn-forest font-bold text-[0.9em] px-5 py-2 rounded-lg no-underline"
          >
            <Phone className="w-4 h-4" /> Call Us
          </a>
          <button
            onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-transparent border-2 border-tn-forest text-tn-forest font-bold text-[0.9em] px-5 py-2 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> New Quote
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={formRef} className="relative">
      {sending && (
        <div className="absolute inset-0 bg-white/90 rounded-xl z-10 flex items-center justify-center flex-col gap-3">
          <div className="w-10 h-10 border-4 border-tn-stone border-t-tn-forest rounded-full animate-spin-custom" />
          <div className="font-serif text-[1.1em] tracking-[1px] text-tn-forest">Sending...</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">First Name *</label>
            <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="John" className={inputCls("fname")} />
          </div>
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Last Name *</label>
            <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Doe" className={inputCls("lname")} />
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls("email")} />
          </div>
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Phone *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(763) 123-4567" maxLength={14} className={inputCls("phone")} />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Street Address *</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" className={inputCls("address")} />
        </div>

        {/* City/State/Zip row */}
        <div className="grid grid-cols-[2fr_80px_100px] gap-3 max-sm:grid-cols-1">
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">City *</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Minneapolis" className={inputCls("city")} />
          </div>
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={2} className={inputCls("state")} />
          </div>
          <div>
            <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">ZIP *</label>
            <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="55401" maxLength={5} inputMode="numeric" className={inputCls("zip")} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Access info, pets, preferences..."
            rows={2}
            className="w-full px-3 py-2.5 border-2 border-tn-border rounded-lg font-sans text-[0.9em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime resize-y"
          />
        </div>

        {/* Contact preference - compact inline */}
        <div>
          <label className="block text-[0.7em] font-bold tracking-[1px] uppercase text-tn-forest mb-1">Best way to reach you</label>
          <div className="flex gap-4 flex-wrap">
            {[
              { value: "phone", label: "Phone" },
              { value: "text", label: "Text" },
              { value: "email", label: "Email" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-[0.85em] cursor-pointer">
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

        {/* Terms checkbox */}
        <label className="flex items-start gap-2 bg-tn-cream rounded-lg p-3 text-[0.8em] text-tn-gray cursor-pointer">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="accent-tn-field mt-0.5 shrink-0"
          />
          I agree to be contacted by True North Outdoor Services regarding my quote. This is a request only, not a binding contract.
        </label>

        {errMsg && (
          <div className="bg-[#fff0f0] border border-tn-error rounded-lg px-3 py-2 text-[0.8em] text-tn-error font-semibold">
            {errMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-br from-tn-forest to-tn-field text-tn-white border-none cursor-pointer font-serif text-[1.2em] tracking-[2px] uppercase py-4 rounded-lg transition-all hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(26,61,10,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Submit Booking Request
        </button>
      </form>
    </div>
  )
}
