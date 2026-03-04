"use client"

import { useState } from "react"
import { useQuote } from "@/lib/quote-context"
import { Mail, Check } from "lucide-react"
import { FORMSPREE_URL, EMAIL_RE, fmt } from "@/lib/constants"

export function LeadCapture() {
  const { quoteData, serviceType } = useQuote()
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  if (!quoteData) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setSending(true)

    try {
      const quoteItems = Object.entries(quoteData.aos)
        .map(([k, v]) => `${k}: ${v === null ? "Quote requested" : fmt(v)}`)
        .join(", ")

      const quoteSummary = `
Service Type: ${serviceType === "compass" ? "Compass Care Subscription" : "Individual Services"}
Lot Size: ${quoteData.lot}
Payment: ${quoteData.pay}
Total: ${fmt(quoteData.total)}
${quoteData.weeklyPayment ? `Weekly Payment: ${fmt(quoteData.weeklyPayment)}/wk` : ""}
Services: ${quoteItems || "Mowing only"}
${quoteData.discount > 0 ? `Discount Applied: ${fmt(quoteData.discount)}` : ""}
      `.trim()

      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          from_email: email.trim(),
          quote_summary: quoteSummary,
          quote_total: fmt(quoteData.total),
          service_type: serviceType === "compass" ? "Compass Care" : "Individual Services",
          request_type: "Email Quote Request",
          quote_date: new Date().toLocaleString("en-US"),
          website: "BookTrueNorth.com",
        }),
        signal: AbortSignal.timeout(8000),
      })

      setSent(true)
    } catch (err) {
      console.error("Lead capture failed:", err)
      setError("Could not send. Please try again or call us directly.")
    }

    setSending(false)
  }

  if (sent) {
    return (
      <div className="bg-gradient-to-br from-[#e8f8d0] to-[#d0f0a0] border border-tn-lime rounded-lg px-5 py-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-tn-field flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-tn-forest text-[0.95em]">Quote sent!</div>
            <div className="text-[0.8em] text-tn-gray">
              Check your inbox at <strong>{email}</strong>. We will follow up shortly.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-tn-cream border border-tn-border rounded-lg px-5 py-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-4 h-4 text-tn-forest" />
        <span className="font-bold text-[0.9em] text-tn-forest">Email me this quote</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-sm:flex-col">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 border-2 border-tn-border rounded-md font-sans text-[0.9em] text-tn-charcoal bg-tn-white focus:outline-none focus:border-tn-lime"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-tn-forest text-tn-gold font-bold text-[0.85em] tracking-[1px] uppercase px-4 py-2 rounded-md border-none cursor-pointer transition-all hover:bg-tn-green disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {sending ? "Sending..." : "Send Quote"}
        </button>
      </form>
      {error && (
        <div className="text-[0.8em] text-tn-error font-semibold mt-2">{error}</div>
      )}
      <div className="text-[0.75em] text-tn-lgray mt-2">
        No spam, just your quote details. We may follow up to help you get started.
      </div>
    </div>
  )
}
