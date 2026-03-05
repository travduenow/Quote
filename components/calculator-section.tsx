"use client"

import { QuoteProvider } from "@/lib/quote-context"
import { QuoteWizard } from "@/components/quote-wizard"
import { QuoteCard } from "@/components/quote-card"
import { BookingSection } from "@/components/booking-section"
import { StickyMobileBar } from "@/components/sticky-mobile-bar"
import { QuoteHistory } from "@/components/quote-history"

export function CalculatorSection() {
  return (
    <QuoteProvider>
      {/* Wizard Section */}
      <div id="calculator" className="bg-tn-stone/5 border-t-4 border-t-tn-lime print:hidden">
        <div className="max-w-[900px] mx-auto px-6 py-16">
          <div className="text-center mb-6">
            <span className="text-[0.75em] font-black tracking-[4px] uppercase text-tn-field">
              Compass Care Quote Builder
            </span>
          </div>
          <h2 className="text-center font-serif text-[clamp(2em,4vw,3.2em)] tracking-[3px] uppercase text-tn-forest mb-2">
            Get Your Quote in 4 Steps
          </h2>
          <p className="text-center text-tn-gray text-[0.95em] mb-8">
            Quick and easy — takes less than a minute.
          </p>

          <QuoteHistory />

          <QuoteWizard />

          {/* Info Banner */}
          <div className="bg-tn-forest rounded-lg px-6 py-4 mt-8 flex items-center gap-[14px] text-white/90 text-[0.9em]">
            <span className="text-[1.6em] shrink-0">📋</span>
            <div>
              <strong className="text-tn-gold">Custom properties?</strong>{" "}
              After you complete the wizard, submit your info and we'll follow up with exact pricing based on your property.
            </div>
          </div>
        </div>
      </div>

      <BookingSection />
      <StickyMobileBar />
    </QuoteProvider>
  )
}

