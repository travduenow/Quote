"use client"

import { useQuote } from "@/lib/quote-context"
import { LOT_OPTIONS, ADDON_OPTIONS } from "@/lib/constants"
import { Calculator } from "lucide-react"
import { useEffect } from "react"

export function QuoteCalculator() {
  const {
    lotSize, setLotSize, payMethod, setPayMethod,
    addons, toggleAddon, shrubCount, setShrubCount,
    singleStory, setSingleStory, landscapingNote, setLandscapingNote,
    calcQuote,
  } = useQuote()

  // Auto-calculate when any parameter changes
  useEffect(() => {
    calcQuote()
  }, [lotSize, payMethod, addons, shrubCount, singleStory, landscapingNote, calcQuote])

  return (
    <div className="bg-tn-white rounded-xl shadow-[var(--shadow-md)] overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[30px] py-6 flex items-center gap-[14px]">
        <div className="w-11 h-11 bg-tn-gold rounded-lg flex items-center justify-center text-tn-forest shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-[1.7em] tracking-[2px] text-tn-white uppercase">
            Build Your Quote
          </h2>
          <p className="text-[0.82em] text-white/65 mt-0.5">
            Select your lot size, add-ons, and payment method.
          </p>
        </div>
      </div>

      <div className="p-[30px]">
        {/* LOT SIZE */}
        <div className="mb-7">
          <label htmlFor="lot-size" className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            1. Select Your Lot Size
          </label>
          <div id="lot-size" role="group" aria-label="Lot size options" className="grid grid-cols-3 gap-[9px] max-md:grid-cols-2 max-sm:grid-cols-1">
            {LOT_OPTIONS.map((opt) => {
              const isSelected = lotSize === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLotSize(opt.value)}
                  aria-label={`Select ${opt.label} lot size`}
                  className={`px-2 py-[13px] text-center border-2 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "border-tn-gold bg-tn-forest"
                      : "border-tn-border bg-tn-cream hover:border-tn-lime hover:bg-[#f0f8e8]"
                  }`}
                >
                  <span className={`block font-serif text-[1.1em] tracking-[1.5px] transition-colors ${
                    isSelected ? "text-tn-gold" : "text-tn-forest"
                  }`}>
                    {opt.label}
                  </span>
                  <span className={`block text-[0.68em] font-bold mt-px transition-colors ${
                    isSelected ? "text-white/60" : "text-tn-lgray"
                  }`}>
                    {opt.sub}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ADD-ONS */}
        <div className="mb-7">
          <label htmlFor="addons" className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            2. Optional Add-On Services
          </label>
          <div id="addons" role="group" aria-label="Add-on services options" className="flex flex-col gap-2">
            {ADDON_OPTIONS.map((ao) => (
              <div key={ao.id}>
                <div
                  className={`flex items-start gap-3 px-[14px] py-3 rounded-lg border-2 cursor-pointer select-none transition-all ${
                    addons[ao.id]
                      ? "border-tn-field bg-[#edf7dd]"
                      : "border-tn-border bg-tn-cream hover:border-tn-lime hover:bg-[#f3fae8]"
                  }`}
                  onClick={() => toggleAddon(ao.id)}
                >
                  <input
                    type="checkbox"
                    checked={!!addons[ao.id]}
                    readOnly
                    className="w-[17px] h-[17px] mt-0.5 shrink-0 cursor-pointer accent-tn-field pointer-events-none"
                  />
                  <div>
                    <div className="font-bold text-[0.9em] text-tn-charcoal">
                      {ao.icon} {ao.label}
                    </div>
                    <div className="text-[0.75em] text-tn-lgray mt-0.5 leading-[1.4]">{ao.desc}</div>
                    <div className={`text-[0.78em] mt-px ${ao.eligible ? "text-tn-field font-bold" : ao.snowSub ? "text-[#2980b9] font-bold" : "text-tn-lgray"}`}>
                      {ao.price}
                    </div>
                  </div>
                </div>

                {/* Sub-inputs */}
                {ao.id === "shrub" && addons.shrub && (
                  <div className="mt-2 ml-[29px]">
                    <div className="flex items-center gap-[10px]">
                      <label className="text-[0.82em] text-tn-gray">Number of shrubs:</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={shrubCount}
                        onChange={(e) => setShrubCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-[10px] py-2 border-2 border-tn-border rounded-md font-sans text-[0.9em] focus:outline-none focus:border-tn-lime"
                      />
                    </div>
                  </div>
                )}

                {ao.id === "gutter" && addons.gutter && (
                  <div className="mt-2 ml-[29px]">
                    <label className="flex items-center gap-2 px-3 py-[9px] bg-[#fffce8] border border-tn-gold rounded-md text-[0.82em] text-tn-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={singleStory}
                        onChange={(e) => setSingleStory(e.target.checked)}
                        className="accent-tn-gold-dark cursor-pointer"
                      />
                      I confirm my home is single-story (required for gutter service)
                    </label>
                  </div>
                )}

                {ao.id === "landscaping" && addons.landscaping && (
                  <div className="mt-2 ml-[29px]">
                    <label className="text-[0.82em] text-tn-gray">Describe what you need:</label>
                    <textarea
                      value={landscapingNote}
                      onChange={(e) => setLandscapingNote(e.target.value)}
                      rows={3}
                      maxLength={200}
                      placeholder="e.g. mulch beds, planting, trimming hedges, cleanup..."
                      className="w-full px-[10px] py-2 border-2 border-tn-border rounded-md font-sans text-[0.86em] resize-y mt-1 focus:outline-none focus:border-tn-lime"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-7">
          <label htmlFor="payment" className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            3. Payment Method
          </label>
          <div id="payment" role="group" aria-label="Payment method options" className="grid grid-cols-3 gap-[9px] max-sm:grid-cols-1">
            {[
              { value: "card", icon: "💳", name: "Card", desc: "Billed weekly\n+3% service fee" },
              { value: "cash", icon: "💵", name: "Cash", desc: "Paid in full\nupfront · no fee" },
              { value: "standalone", icon: "📋", name: "Stand-Alone", desc: "One-off service\nno commitment" },
            ].map((opt) => {
              const isSelected = payMethod === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPayMethod(opt.value)}
                  aria-label={`Pay by ${opt.name}: ${opt.desc.replace(/\n/g, ' ')}`}
                  className={`text-center px-2 py-[14px] border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-tn-forest border-tn-forest text-tn-gold"
                      : "bg-tn-cream border-tn-border hover:border-tn-lime"
                  }`}
                >
                  <span className="text-[1.5em] block mb-1">{opt.icon}</span>
                  <span className={`block font-serif text-base tracking-[1px] ${isSelected ? "text-tn-gold" : "text-tn-charcoal"}`}>{opt.name}</span>
                  <span className={`block text-[0.68em] font-semibold mt-px tracking-wide leading-[1.3] whitespace-pre-line ${
                    isSelected ? "text-white/60" : "text-tn-lgray"
                  }`}>
                    {opt.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
