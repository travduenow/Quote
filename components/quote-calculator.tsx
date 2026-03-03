"use client"

import { useQuote } from "@/lib/quote-context"
import { LOT_OPTIONS, ADDON_OPTIONS } from "@/lib/constants"
import { Calculator, Zap } from "lucide-react"

export function QuoteCalculator() {
  const {
    lotSize, setLotSize, payMethod, setPayMethod,
    addons, toggleAddon, shrubCount, setShrubCount,
    singleStory, setSingleStory, landscapingNote, setLandscapingNote,
    calcQuote,
  } = useQuote()

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
          <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            1. Select Your Lot Size
          </label>
          <div className="grid grid-cols-3 gap-[9px] max-md:grid-cols-2 max-sm:grid-cols-1">
            {LOT_OPTIONS.map((opt) => (
              <label key={opt.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="lotSize"
                  value={opt.value}
                  checked={lotSize === opt.value}
                  onChange={() => { setLotSize(opt.value); }}
                  className="absolute opacity-0 pointer-events-none peer"
                />
                <div className="px-2 py-[13px] text-center border-2 border-tn-border rounded-lg bg-tn-cream transition-all hover:border-tn-lime hover:bg-[#f0f8e8] peer-checked:border-tn-gold peer-checked:bg-tn-forest">
                  <span className="block font-serif text-[1.1em] tracking-[1.5px] text-tn-forest transition-colors peer-checked:text-tn-gold">
                    <span className="peer-checked:text-tn-gold">{opt.label}</span>
                  </span>
                  <span className="block text-[0.68em] font-bold text-tn-lgray mt-px transition-colors">
                    {opt.sub}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ADD-ONS */}
        <div className="mb-7">
          <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            2. Optional Add-On Services
          </label>
          <div className="flex flex-col gap-2">
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
                    onChange={() => toggleAddon(ao.id)}
                    className="w-[17px] h-[17px] mt-0.5 shrink-0 cursor-pointer accent-tn-field"
                    onClick={(e) => e.stopPropagation()}
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
          <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-3 pb-[6px] border-b-2 border-tn-stone">
            3. Payment Method
          </label>
          <div className="grid grid-cols-3 gap-[9px] max-sm:grid-cols-1">
            {[
              { value: "card", icon: "💳", name: "Card", desc: "Billed weekly\n+3% service fee" },
              { value: "cash", icon: "💵", name: "Cash", desc: "Paid in full\nupfront · no fee" },
              { value: "standalone", icon: "📋", name: "Stand-Alone", desc: "One-off service\nno commitment" },
            ].map((opt) => (
              <div key={opt.value} className="relative">
                <input
                  type="radio"
                  name="payMethod"
                  id={`pay-${opt.value}`}
                  value={opt.value}
                  checked={payMethod === opt.value}
                  onChange={() => { setPayMethod(opt.value); }}
                  className="absolute opacity-0 pointer-events-none peer"
                />
                <label
                  htmlFor={`pay-${opt.value}`}
                  className="block text-center px-2 py-[14px] border-2 border-tn-border rounded-lg bg-tn-cream cursor-pointer transition-all hover:border-tn-lime peer-checked:bg-tn-forest peer-checked:border-tn-forest peer-checked:text-tn-gold"
                >
                  <span className="text-[1.5em] block mb-1">{opt.icon}</span>
                  <span className="block font-serif text-base tracking-[1px]">{opt.name}</span>
                  <span className="block text-[0.68em] font-semibold text-tn-lgray mt-px tracking-wide leading-[1.3] whitespace-pre-line peer-checked:text-white/60">
                    {opt.desc}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={calcQuote}
          className="w-full mt-[26px] bg-gradient-to-br from-tn-forest to-tn-field text-tn-white border-none cursor-pointer font-serif text-[1.5em] tracking-[3px] uppercase py-[18px] rounded-lg transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(26,61,10,0.4)] flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Calculate My Quote Now
        </button>
      </div>
    </div>
  )
}
