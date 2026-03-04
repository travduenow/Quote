"use client"

import { Check, X } from "lucide-react"

export function ComparisonView() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="bg-tn-cream py-10 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-serif text-[clamp(1.4em,3vw,2em)] tracking-[2px] uppercase text-tn-forest mb-1">
            Compare Options
          </h2>
          <p className="text-tn-gray text-[0.85em]">Choose what fits your needs</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {/* Compass Care Card */}
          <div className="bg-tn-white rounded-xl shadow-[var(--shadow-sm)] overflow-hidden border-2 border-tn-forest">
            <div className="bg-tn-forest px-4 py-3 text-center">
              <div className="font-serif text-[1.1em] tracking-[1px] text-tn-gold uppercase">Compass Care</div>
              <div className="text-[0.7em] text-white/60">30-Week Season</div>
            </div>
            <div className="px-4 py-4">
              <ul className="space-y-2 text-[0.85em]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">Weekly mowing included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">Spring + Fall cleanup free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">1 stick edging included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">Discounted rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-tn-lgray shrink-0" />
                  <span className="text-tn-lgray">Season commitment</span>
                </li>
              </ul>
              <button
                onClick={scrollToCalculator}
                className="w-full mt-4 bg-tn-forest text-tn-gold font-bold text-[0.8em] tracking-[1px] uppercase px-4 py-2 rounded border-none cursor-pointer transition-all hover:bg-tn-green"
              >
                Get Quote
              </button>
            </div>
          </div>

          {/* Individual Services Card */}
          <div className="bg-tn-white rounded-xl shadow-[var(--shadow-sm)] overflow-hidden border-2 border-tn-border">
            <div className="bg-tn-charcoal px-4 py-3 text-center">
              <div className="font-serif text-[1.1em] tracking-[1px] text-tn-white uppercase">Individual</div>
              <div className="text-[0.7em] text-white/60">On-Demand</div>
            </div>
            <div className="px-4 py-4">
              <ul className="space-y-2 text-[0.85em]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">Pay per service</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">No commitment</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tn-field shrink-0" />
                  <span className="text-tn-charcoal">Flexible scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-tn-lgray shrink-0" />
                  <span className="text-tn-lgray">No seasonal discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-tn-lgray shrink-0" />
                  <span className="text-tn-lgray">No free cleanups</span>
                </li>
              </ul>
              <button
                onClick={scrollToCalculator}
                className="w-full mt-4 bg-tn-charcoal text-white font-bold text-[0.8em] tracking-[1px] uppercase px-4 py-2 rounded border-none cursor-pointer transition-all hover:bg-tn-gray"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
