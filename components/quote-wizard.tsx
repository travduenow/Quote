"use client"

import { memo, useState } from "react"
import { useQuote } from "@/lib/quote-context"
import { LOT_OPTIONS, ADDON_OPTIONS } from "@/lib/constants"
import { ChevronRight, ChevronLeft } from "lucide-react"

export const QuoteWizard = memo(function QuoteWizard() {
  const {
    lotSize, setLotSize, payMethod, setPayMethod,
    addons, toggleAddon, shrubCount, setShrubCount,
    singleStory, setSingleStory, landscapingNote, setLandscapingNote,
    quoteData,
  } = useQuote()

  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { num: 1, title: "Lot Size", description: "What size is your property?" },
    { num: 2, title: "Service Type", description: "Choose your service package" },
    { num: 3, title: "Add-ons", description: "Select optional services" },
    { num: 4, title: "Your Quote", description: "Review your personalized price" },
  ]

  const canGoNext = {
    1: !!lotSize,
    2: !!payMethod,
    3: true,
    4: true,
  } as Record<number, boolean>

  const handleNext = () => {
    if (canGoNext[currentStep]) {
      setCurrentStep(Math.min(currentStep + 1, 4))
    }
  }

  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  return (
    <div className="bg-tn-white rounded-xl shadow-[var(--shadow-md)] overflow-hidden animate-fade-up">
      {/* Progress Bar */}
      <div className="h-1.5 bg-tn-stone/20 flex">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 transition-all ${
              step <= currentStep ? "bg-tn-gold" : "bg-tn-stone/20"
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-tn-forest to-tn-green px-[30px] py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-tn-gold/20 border-2 border-tn-gold rounded-lg flex items-center justify-center text-tn-gold font-serif text-[1.4em] font-bold">
            {currentStep}
          </div>
          <div>
            <h2 className="font-serif text-[1.6em] tracking-[2px] text-tn-white uppercase">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-[0.82em] text-white/65 mt-0.5">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-[30px] min-h-[380px] flex flex-col">
        {/* STEP 1: Lot Size */}
        {currentStep === 1 && (
          <div className="flex-1">
            <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-4 pb-[6px] border-b-2 border-tn-stone">
              Select Your Lot Size
            </label>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1" role="group" aria-label="Lot size options">
              {LOT_OPTIONS.map((opt) => {
                const isSelected = lotSize === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLotSize(opt.value)}
                    aria-pressed={isSelected}
                    aria-label={`${opt.label}: ${opt.sub}`}
                    className={`px-4 py-4 text-center border-2 rounded-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tn-gold ${
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
        )}

        {/* STEP 2: Service Type - Compass Care vs One-Time Service */}
        {currentStep === 2 && (
          <div className="flex-1">
            <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-4 pb-[6px] border-b-2 border-tn-stone">
              Choose Your Service
            </label>
            <div className="grid grid-cols-1 gap-4" role="group" aria-label="Service type options">
              {/* Compass Care */}
              <button
                type="button"
                onClick={() => setPayMethod("card")}
                aria-pressed={payMethod === "card"}
                className={`text-left px-6 py-5 border-2 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tn-gold ${
                  payMethod === "card"
                    ? "bg-tn-forest border-tn-forest text-tn-gold"
                    : "bg-tn-cream border-tn-border hover:border-tn-lime"
                }`}
              >
                <span className="text-[2em] block mb-2">🔄</span>
                <span className={`block font-serif text-[1.2em] tracking-[1px] font-bold ${payMethod === "card" ? "text-tn-gold" : "text-tn-charcoal"}`}>
                  Compass Care Subscription
                </span>
                <span className={`block text-[0.85em] font-semibold mt-1 leading-relaxed ${
                  payMethod === "card" ? "text-white/70" : "text-tn-lgray"
                }`}>
                  Weekly lawn care all season • Billed weekly • 5% subscription discount • Includes most add-ons
                </span>
              </button>

              {/* One-Time Service */}
              <button
                type="button"
                onClick={() => setPayMethod("standalone")}
                aria-pressed={payMethod === "standalone"}
                className={`text-left px-6 py-5 border-2 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tn-gold ${
                  payMethod === "standalone"
                    ? "bg-tn-forest border-tn-forest text-tn-gold"
                    : "bg-tn-cream border-tn-border hover:border-tn-lime"
                }`}
              >
                <span className="text-[2em] block mb-2">📋</span>
                <span className={`block font-serif text-[1.2em] tracking-[1px] font-bold ${payMethod === "standalone" ? "text-tn-gold" : "text-tn-charcoal"}`}>
                  One-Time Service
                </span>
                <span className={`block text-[0.85em] font-semibold mt-1 leading-relaxed ${
                  payMethod === "standalone" ? "text-white/70" : "text-tn-lgray"
                }`}>
                  Single lawn mowing • Pay once • No commitment • Perfect for one-off needs
                </span>
              </button>

              {/* Optional: Cash Payment */}
              <button
                type="button"
                onClick={() => setPayMethod("cash")}
                aria-pressed={payMethod === "cash"}
                className={`text-left px-6 py-5 border-2 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tn-gold ${
                  payMethod === "cash"
                    ? "bg-tn-forest border-tn-forest text-tn-gold"
                    : "bg-tn-cream border-tn-border hover:border-tn-lime"
                }`}
              >
                <span className="text-[2em] block mb-2">💵</span>
                <span className={`block font-serif text-[1.2em] tracking-[1px] font-bold ${payMethod === "cash" ? "text-tn-gold" : "text-tn-charcoal"}`}>
                  Cash Payment Option
                </span>
                <span className={`block text-[0.85em] font-semibold mt-1 leading-relaxed ${
                  payMethod === "cash" ? "text-white/70" : "text-tn-lgray"
                }`}>
                  Full payment upfront • No credit card fees • Works with Compass Care
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Add-ons */}
        {currentStep === 3 && (
          <div className="flex-1">
            <label className="block text-[0.72em] font-black tracking-[2.5px] uppercase text-tn-forest mb-4 pb-[6px] border-b-2 border-tn-stone">
              Optional Add-On Services
            </label>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto" role="group" aria-label="Add-on services">
              {ADDON_OPTIONS.map((ao) => (
                <div key={ao.id}>
                  <div
                    className={`flex items-start gap-3 px-3 py-3 rounded-lg border-2 cursor-pointer select-none transition-all focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-tn-gold ${
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
                      aria-label={ao.label}
                      className="w-[17px] h-[17px] mt-0.5 shrink-0 cursor-pointer accent-tn-field pointer-events-none"
                    />
                    <div>
                      <div className="font-bold text-[0.85em] text-tn-charcoal">
                        {ao.icon} {ao.label}
                      </div>
                      <div className="text-[0.72em] text-tn-lgray mt-0.5">{ao.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Quote Display */}
        {currentStep === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {!quoteData ? (
              <div className="space-y-3">
                <div className="text-[2.8em] opacity-35">🌿</div>
                <p className="text-[0.9em] text-tn-lgray">Calculating your quote...</p>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <div>
                  <p className="text-[0.8em] text-tn-lgray mb-2">YOUR TOTAL PRICE</p>
                  <div className="font-serif text-[2.8em] tracking-[2px] text-tn-gold font-bold">
                    {quoteData.isSub ? `$${(quoteData.weeklyPayment ?? 0).toFixed(0)}/wk` : `$${quoteData.total.toFixed(0)}`}
                  </div>
                </div>
                {quoteData.isSub && (
                  <p className="text-[0.85em] text-tn-gray">
                    Includes weekly mowing for 30 weeks
                  </p>
                )}
                <button
                  onClick={() => setCurrentStep(4)}
                  className="w-full bg-tn-gold text-tn-forest font-serif text-[1.1em] tracking-[2px] uppercase py-4 border-none rounded-lg cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Continue to Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-[30px] py-6 bg-tn-stone/5 flex items-center justify-between gap-4 border-t-2 border-tn-stone/20">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[0.9em] tracking-[1px] uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:disabled:bg-transparent hover:bg-tn-cream text-tn-forest border-2 border-tn-forest/30"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-[0.75em] font-black tracking-[2px] uppercase text-tn-forest">
          Step {currentStep} of 4
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext[currentStep]}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[0.9em] tracking-[1px] uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-tn-forest text-tn-gold hover:disabled:bg-tn-forest hover:bg-tn-lime hover:text-tn-forest"
        >
          {currentStep === 4 ? "Done" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
})
