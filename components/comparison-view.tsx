"use client"

import { Check, X } from "lucide-react"

interface ComparisonItem {
  feature: string
  compass: boolean | string
  individual: boolean | string
}

const comparisonData: ComparisonItem[] = [
  { feature: "Weekly Mowing", compass: true, individual: true },
  { feature: "Spring Cleanup Included", compass: true, individual: false },
  { feature: "Fall Cleanup Included", compass: true, individual: false },
  { feature: "1 Stick Edging Included", compass: true, individual: false },
  { feature: "Discounted Rate", compass: true, individual: false },
  { feature: "Flexible Scheduling", compass: "Season-long", individual: "On-demand" },
  { feature: "No Commitment Required", compass: false, individual: true },
  { feature: "Pay Per Service", compass: false, individual: true },
  { feature: "Add-On Services Available", compass: true, individual: true },
]

export function ComparisonView() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="bg-tn-cream py-16 px-6">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-2">
          <span className="text-[0.75em] font-black tracking-[4px] uppercase text-tn-field">
            Compare Options
          </span>
        </div>
        <h2 className="text-center font-serif text-[clamp(1.8em,4vw,2.8em)] tracking-[3px] uppercase text-tn-forest mb-2 text-balance">
          Compass Care vs Individual Services
        </h2>
        <p className="text-center text-tn-gray text-[0.95em] mb-10">
          Choose the option that fits your needs best
        </p>

        <div className="bg-tn-white rounded-xl shadow-[var(--shadow-md)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_140px_140px] max-sm:grid-cols-[1fr_100px_100px] border-b-2 border-tn-forest">
            <div className="p-4 bg-tn-forest" />
            <div className="p-4 bg-tn-forest text-center">
              <div className="font-serif text-[1.1em] max-sm:text-[0.9em] tracking-[1px] text-tn-gold uppercase">
                Compass Care
              </div>
              <div className="text-[0.7em] text-white/60 mt-0.5">30-Week Season</div>
            </div>
            <div className="p-4 bg-tn-charcoal text-center">
              <div className="font-serif text-[1.1em] max-sm:text-[0.9em] tracking-[1px] text-tn-white uppercase">
                Individual
              </div>
              <div className="text-[0.7em] text-white/60 mt-0.5">On-Demand</div>
            </div>
          </div>

          {/* Rows */}
          {comparisonData.map((item, index) => (
            <div
              key={item.feature}
              className={`grid grid-cols-[1fr_140px_140px] max-sm:grid-cols-[1fr_100px_100px] ${
                index !== comparisonData.length - 1 ? "border-b border-tn-stone" : ""
              }`}
            >
              <div className="p-4 text-[0.9em] max-sm:text-[0.8em] text-tn-charcoal font-medium">
                {item.feature}
              </div>
              <div className="p-4 flex items-center justify-center bg-[#f8fdf0]">
                {typeof item.compass === "boolean" ? (
                  item.compass ? (
                    <Check className="w-5 h-5 text-tn-field" />
                  ) : (
                    <X className="w-5 h-5 text-tn-lgray" />
                  )
                ) : (
                  <span className="text-[0.8em] max-sm:text-[0.7em] text-tn-field font-semibold text-center">
                    {item.compass}
                  </span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                {typeof item.individual === "boolean" ? (
                  item.individual ? (
                    <Check className="w-5 h-5 text-tn-field" />
                  ) : (
                    <X className="w-5 h-5 text-tn-lgray" />
                  )
                ) : (
                  <span className="text-[0.8em] max-sm:text-[0.7em] text-tn-charcoal font-semibold text-center">
                    {item.individual}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* CTA Row */}
          <div className="grid grid-cols-[1fr_140px_140px] max-sm:grid-cols-[1fr_100px_100px] border-t-2 border-tn-stone bg-tn-cream">
            <div className="p-4" />
            <div className="p-4 flex items-center justify-center">
              <button
                onClick={scrollToCalculator}
                className="bg-tn-forest text-tn-gold font-bold text-[0.75em] max-sm:text-[0.65em] tracking-[1px] uppercase px-3 py-2 rounded border-none cursor-pointer transition-all hover:bg-tn-green"
              >
                Get Quote
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <button
                onClick={scrollToCalculator}
                className="bg-tn-charcoal text-white font-bold text-[0.75em] max-sm:text-[0.65em] tracking-[1px] uppercase px-3 py-2 rounded border-none cursor-pointer transition-all hover:bg-tn-gray"
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
