"use client"

import { QuoteProvider } from "@/lib/quote-context"
import { StepWizard } from "@/components/step-wizard"
import { QuoteCard } from "@/components/quote-card"
import { BookingSection } from "@/components/booking-section"
import { StickyMobileBar } from "@/components/sticky-mobile-bar"

export function CalculatorSection() {
  return (
    <QuoteProvider>
      {/* Calculator Section */}
      <div id="calculator" className="bg-tn-white border-t-4 border-t-tn-lime print:hidden">
        <div className="max-w-[900px] mx-auto px-6 py-16">
          <div className="text-center mb-2">
            <span className="text-[0.75em] font-black tracking-[4px] uppercase text-tn-field">
              Quick Quote Calculator
            </span>
          </div>
          <h2 className="text-center font-serif text-[clamp(2em,4vw,3.2em)] tracking-[3px] uppercase text-tn-forest mb-2 text-balance">
            Get Your Quote in 4 Easy Steps
          </h2>
          <p className="text-center text-tn-gray text-[0.95em] mb-11">
            Choose your services, see your price instantly.
          </p>

          <StepWizard />
          
          <div id="quote-result" className="mt-10">
            <QuoteCard />
          </div>

          {/* Add-on notice */}
          <div className="bg-tn-forest rounded-lg px-6 py-4 mt-8 flex items-center gap-[14px] text-white/90 text-[0.9em]">
            <span className="text-[1.6em] shrink-0" role="img" aria-label="clipboard">📋</span>
            <div>
              <strong className="text-tn-gold">Need a custom quote?</strong>{" "}
              Some services are priced after an on-site visit. Request a quote above and {"we'll"} follow up with exact pricing.
            </div>
          </div>
        </div>
      </div>

      <BookingSection />
      <StickyMobileBar />
    </QuoteProvider>
  )
}
