"use client"

import { useState } from "react"
import { useQuote } from "@/lib/quote-context"
import { LOT_OPTIONS, ADDON_OPTIONS } from "@/lib/constants"
import { Check, ChevronRight, ChevronLeft, Compass, Wrench } from "lucide-react"

type ServiceType = "compass" | "standalone" | null

export function StepWizard() {
  const {
    lotSize, setLotSize, payMethod, setPayMethod,
    addons, toggleAddon, shrubCount, setShrubCount,
    singleStory, setSingleStory, landscapingNote, setLandscapingNote,
    calcQuote,
  } = useQuote()

  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState<ServiceType>(null)

  const totalSteps = 4

  const canProceed = () => {
    switch (step) {
      case 1: return serviceType !== null
      case 2: return lotSize !== ""
      case 3: return true // Add-ons are optional
      case 4: return payMethod !== ""
      default: return false
    }
  }

  const handleNext = () => {
    if (step < totalSteps && canProceed()) {
      setStep(step + 1)
    } else if (step === totalSteps && canProceed()) {
      // Final step - calculate quote
      calcQuote()
      // Scroll to quote card
      setTimeout(() => {
        document.getElementById("quote-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleServiceTypeSelect = (type: ServiceType) => {
    setServiceType(type)
    if (type === "standalone") {
      setPayMethod("standalone")
    } else if (type === "compass") {
      setPayMethod("card") // Default to card for compass care
    }
  }

  const stepLabels = ["Service Type", "Property Size", "Add-Ons", "Payment"]

  return (
    <div className="bg-tn-white rounded-xl shadow-[var(--shadow-md)] overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="bg-gradient-to-br from-tn-forest to-tn-green px-6 py-5">
        <h2 className="font-serif text-[1.6em] tracking-[2px] text-tn-white uppercase text-center">
          Build Your Quote
        </h2>
        <p className="text-[0.82em] text-white/65 mt-1 text-center">
          Answer a few quick questions to get your personalized price
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-tn-cream border-b border-tn-border">
        <div className="flex items-center justify-between max-w-[500px] mx-auto">
          {stepLabels.map((label, index) => {
            const stepNum = index + 1
            const isActive = step === stepNum
            const isComplete = step > stepNum
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isComplete
                        ? "bg-tn-success text-white"
                        : isActive
                        ? "bg-tn-forest text-tn-gold"
                        : "bg-tn-stone text-tn-lgray"
                    }`}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  <span
                    className={`text-[0.65em] mt-1 tracking-wide uppercase font-bold ${
                      isActive ? "text-tn-forest" : "text-tn-lgray"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 mt-[-16px] ${
                      step > stepNum ? "bg-tn-success" : "bg-tn-stone"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 min-h-[320px]">
        {/* Step 1: Service Type */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-[1.4em] tracking-[1.5px] text-tn-forest mb-2 text-center">
              What type of service do you need?
            </h3>
            <p className="text-tn-gray text-[0.9em] mb-6 text-center">
              Choose between our all-inclusive subscription or one-time service
            </p>

            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-w-[600px] mx-auto">
              {/* Compass Care Option */}
              <button
                type="button"
                onClick={() => handleServiceTypeSelect("compass")}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  serviceType === "compass"
                    ? "border-tn-gold bg-gradient-to-br from-tn-forest to-tn-green"
                    : "border-tn-border bg-tn-cream hover:border-tn-lime hover:bg-[#f0f8e8]"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      serviceType === "compass" ? "bg-tn-gold text-tn-forest" : "bg-tn-forest text-tn-gold"
                    }`}
                  >
                    <Compass className="w-6 h-6" />
                  </div>
                  <span
                    className={`font-serif text-[1.3em] tracking-[1px] ${
                      serviceType === "compass" ? "text-tn-gold" : "text-tn-forest"
                    }`}
                  >
                    Compass Care
                  </span>
                </div>
                <div
                  className={`text-[0.85em] leading-relaxed ${
                    serviceType === "compass" ? "text-white/80" : "text-tn-gray"
                  }`}
                >
                  <span className={`font-bold ${serviceType === "compass" ? "text-tn-gold" : "text-tn-forest"}`}>
                    30-Week Subscription
                  </span>
                  <ul className={`mt-2 space-y-1 ${serviceType === "compass" ? "text-white/70" : "text-tn-lgray"}`}>
                    <li>Weekly mowing all season</li>
                    <li>Spring + Fall cleanup included</li>
                    <li>2 Edging visits included</li>
                    <li>5% subscription discount</li>
                  </ul>
                </div>
                {serviceType === "compass" && (
                  <div className="mt-3 inline-flex items-center gap-1 text-tn-gold text-[0.8em] font-bold">
                    <Check className="w-4 h-4" /> Selected
                  </div>
                )}
              </button>

              {/* Stand-Alone Option */}
              <button
                type="button"
                onClick={() => handleServiceTypeSelect("standalone")}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                  serviceType === "standalone"
                    ? "border-tn-gold bg-gradient-to-br from-tn-forest to-tn-green"
                    : "border-tn-border bg-tn-cream hover:border-tn-lime hover:bg-[#f0f8e8]"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      serviceType === "standalone" ? "bg-tn-gold text-tn-forest" : "bg-tn-forest text-tn-gold"
                    }`}
                  >
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span
                    className={`font-serif text-[1.3em] tracking-[1px] ${
                      serviceType === "standalone" ? "text-tn-gold" : "text-tn-forest"
                    }`}
                  >
                    Stand-Alone
                  </span>
                </div>
                <div
                  className={`text-[0.85em] leading-relaxed ${
                    serviceType === "standalone" ? "text-white/80" : "text-tn-gray"
                  }`}
                >
                  <span className={`font-bold ${serviceType === "standalone" ? "text-tn-gold" : "text-tn-forest"}`}>
                    One-Time Service
                  </span>
                  <ul className={`mt-2 space-y-1 ${serviceType === "standalone" ? "text-white/70" : "text-tn-lgray"}`}>
                    <li>Single visit or service</li>
                    <li>No commitment required</li>
                    <li>Pay per service</li>
                    <li>Perfect for occasional needs</li>
                  </ul>
                </div>
                {serviceType === "standalone" && (
                  <div className="mt-3 inline-flex items-center gap-1 text-tn-gold text-[0.8em] font-bold">
                    <Check className="w-4 h-4" /> Selected
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Property Size */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-[1.4em] tracking-[1.5px] text-tn-forest mb-2 text-center">
              What size is your property?
            </h3>
            <p className="text-tn-gray text-[0.9em] mb-6 text-center">
              Select the option that best matches your lot size
            </p>

            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-w-[600px] mx-auto">
              {LOT_OPTIONS.map((opt) => {
                const isSelected = lotSize === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLotSize(opt.value)}
                    className={`px-3 py-4 text-center border-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "border-tn-gold bg-tn-forest"
                        : "border-tn-border bg-tn-cream hover:border-tn-lime hover:bg-[#f0f8e8]"
                    }`}
                  >
                    <span
                      className={`block font-serif text-[1.2em] tracking-[1.5px] transition-colors ${
                        isSelected ? "text-tn-gold" : "text-tn-forest"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`block text-[0.75em] font-bold mt-1 transition-colors ${
                        isSelected ? "text-white/60" : "text-tn-lgray"
                      }`}
                    >
                      {opt.sub}
                    </span>
                    {isSelected && (
                      <div className="mt-2 inline-flex items-center gap-1 text-tn-gold text-[0.75em] font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Add-Ons */}
        {step === 3 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-[1.4em] tracking-[1.5px] text-tn-forest mb-2 text-center">
              Any additional services?
            </h3>
            <p className="text-tn-gray text-[0.9em] mb-6 text-center">
              These are optional - skip if you just need the basics
            </p>

            <div className="flex flex-col gap-2 max-w-[600px] mx-auto max-h-[350px] overflow-y-auto pr-2">
              {ADDON_OPTIONS.map((ao) => (
                <div key={ao.id}>
                  <div
                    className={`flex items-start gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer select-none transition-all ${
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
                      className="w-[18px] h-[18px] mt-0.5 shrink-0 cursor-pointer accent-tn-field pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[0.9em] text-tn-charcoal">
                        {ao.icon} {ao.label}
                      </div>
                      <div className="text-[0.75em] text-tn-lgray mt-0.5 leading-[1.4]">
                        {ao.desc}
                      </div>
                      <div
                        className={`text-[0.78em] mt-1 ${
                          ao.eligible
                            ? "text-tn-field font-bold"
                            : ao.snowSub
                            ? "text-[#2980b9] font-bold"
                            : "text-tn-lgray"
                        }`}
                      >
                        {ao.price}
                      </div>
                    </div>
                  </div>

                  {/* Sub-inputs */}
                  {ao.id === "shrub" && addons.shrub && (
                    <div className="mt-2 ml-8">
                      <div className="flex items-center gap-3">
                        <label className="text-[0.85em] text-tn-gray">Number of shrubs:</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={shrubCount}
                          onChange={(e) => setShrubCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 px-3 py-2 border-2 border-tn-border rounded-md font-sans text-[0.9em] focus:outline-none focus:border-tn-lime"
                        />
                      </div>
                    </div>
                  )}

                  {ao.id === "gutter" && addons.gutter && (
                    <div className="mt-2 ml-8">
                      <label className="flex items-center gap-2 px-3 py-2 bg-[#fffce8] border border-tn-gold rounded-md text-[0.85em] text-tn-charcoal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={singleStory}
                          onChange={(e) => setSingleStory(e.target.checked)}
                          className="accent-tn-gold-dark cursor-pointer"
                        />
                        I confirm my home is single-story
                      </label>
                    </div>
                  )}

                  {ao.id === "landscaping" && addons.landscaping && (
                    <div className="mt-2 ml-8">
                      <label className="text-[0.85em] text-tn-gray">Describe what you need:</label>
                      <textarea
                        value={landscapingNote}
                        onChange={(e) => setLandscapingNote(e.target.value)}
                        rows={2}
                        maxLength={200}
                        placeholder="e.g. mulch beds, planting, trimming..."
                        className="w-full px-3 py-2 border-2 border-tn-border rounded-md font-sans text-[0.86em] resize-y mt-1 focus:outline-none focus:border-tn-lime"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="animate-fade-up">
            <h3 className="font-serif text-[1.4em] tracking-[1.5px] text-tn-forest mb-2 text-center">
              How would you like to pay?
            </h3>
            <p className="text-tn-gray text-[0.9em] mb-6 text-center">
              {serviceType === "compass"
                ? "Choose your preferred payment method for your subscription"
                : "Select how you'd like to pay for your service"}
            </p>

            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-w-[500px] mx-auto">
              {serviceType === "compass" ? (
                <>
                  {/* Card Payment */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("card")}
                    className={`text-center px-4 py-5 border-2 rounded-xl cursor-pointer transition-all ${
                      payMethod === "card"
                        ? "bg-tn-forest border-tn-gold"
                        : "bg-tn-cream border-tn-border hover:border-tn-lime hover:bg-[#f0f8e8]"
                    }`}
                  >
                    <span className="text-[2em] block mb-2">💳</span>
                    <span
                      className={`block font-serif text-[1.2em] tracking-[1px] ${
                        payMethod === "card" ? "text-tn-gold" : "text-tn-forest"
                      }`}
                    >
                      Card
                    </span>
                    <span
                      className={`block text-[0.8em] mt-1 leading-relaxed ${
                        payMethod === "card" ? "text-white/60" : "text-tn-lgray"
                      }`}
                    >
                      Billed weekly
                      <br />
                      +3% service fee
                    </span>
                    {payMethod === "card" && (
                      <div className="mt-2 inline-flex items-center gap-1 text-tn-gold text-[0.75em] font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>

                  {/* Cash Payment */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("cash")}
                    className={`text-center px-4 py-5 border-2 rounded-xl cursor-pointer transition-all ${
                      payMethod === "cash"
                        ? "bg-tn-forest border-tn-gold"
                        : "bg-tn-cream border-tn-border hover:border-tn-lime hover:bg-[#f0f8e8]"
                    }`}
                  >
                    <span className="text-[2em] block mb-2">💵</span>
                    <span
                      className={`block font-serif text-[1.2em] tracking-[1px] ${
                        payMethod === "cash" ? "text-tn-gold" : "text-tn-forest"
                      }`}
                    >
                      Cash
                    </span>
                    <span
                      className={`block text-[0.8em] mt-1 leading-relaxed ${
                        payMethod === "cash" ? "text-white/60" : "text-tn-lgray"
                      }`}
                    >
                      Paid in full upfront
                      <br />
                      No fee
                    </span>
                    {payMethod === "cash" && (
                      <div className="mt-2 inline-flex items-center gap-1 text-tn-gold text-[0.75em] font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Stand-alone Card */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("standalone")}
                    className={`text-center px-4 py-5 border-2 rounded-xl cursor-pointer transition-all ${
                      payMethod === "standalone"
                        ? "bg-tn-forest border-tn-gold"
                        : "bg-tn-cream border-tn-border hover:border-tn-lime hover:bg-[#f0f8e8]"
                    }`}
                  >
                    <span className="text-[2em] block mb-2">💳</span>
                    <span
                      className={`block font-serif text-[1.2em] tracking-[1px] ${
                        payMethod === "standalone" ? "text-tn-gold" : "text-tn-forest"
                      }`}
                    >
                      Card
                    </span>
                    <span
                      className={`block text-[0.8em] mt-1 leading-relaxed ${
                        payMethod === "standalone" ? "text-white/60" : "text-tn-lgray"
                      }`}
                    >
                      Pay at service
                      <br />
                      +3% service fee
                    </span>
                    {payMethod === "standalone" && (
                      <div className="mt-2 inline-flex items-center gap-1 text-tn-gold text-[0.75em] font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>

                  {/* Stand-alone Cash */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("standalone")}
                    className={`text-center px-4 py-5 border-2 rounded-xl cursor-pointer transition-all ${
                      payMethod === "standalone"
                        ? "bg-tn-forest border-tn-gold"
                        : "bg-tn-cream border-tn-border hover:border-tn-lime hover:bg-[#f0f8e8]"
                    }`}
                  >
                    <span className="text-[2em] block mb-2">💵</span>
                    <span
                      className={`block font-serif text-[1.2em] tracking-[1px] ${
                        payMethod === "standalone" ? "text-tn-gold" : "text-tn-forest"
                      }`}
                    >
                      Cash
                    </span>
                    <span
                      className={`block text-[0.8em] mt-1 leading-relaxed ${
                        payMethod === "standalone" ? "text-white/60" : "text-tn-lgray"
                      }`}
                    >
                      Pay at service
                      <br />
                      No fee
                    </span>
                    {payMethod === "standalone" && (
                      <div className="mt-2 inline-flex items-center gap-1 text-tn-gold text-[0.75em] font-bold">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-6 flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-[0.9em] transition-all ${
            step === 1
              ? "opacity-0 pointer-events-none"
              : "bg-tn-cream border-2 border-tn-border text-tn-gray hover:border-tn-forest hover:text-tn-forest cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-serif text-[1.1em] tracking-[1.5px] uppercase transition-all ${
            canProceed()
              ? "bg-gradient-to-br from-tn-forest to-tn-field text-tn-white cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(26,61,10,0.3)]"
              : "bg-tn-stone text-tn-lgray cursor-not-allowed"
          }`}
        >
          {step === totalSteps ? "See My Quote" : "Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
