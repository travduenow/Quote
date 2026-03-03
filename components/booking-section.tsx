"use client"

import { BookingForm } from "./booking-form"

export function BookingSection() {
  return (
    <section id="booking" className="bg-tn-cream px-6 py-[70px] print:hidden">
      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-[6px] flex items-center justify-center gap-[10px]">
          <span className="text-[0.75em] font-black tracking-[4px] uppercase text-tn-field">
            True North Outdoor Services
          </span>
        </div>
        <h2 className="text-center font-serif text-[clamp(2em,4vw,3.2em)] tracking-[3px] uppercase text-tn-forest mb-2">
          Book Your Service
        </h2>
        <p className="text-center text-tn-gray text-[0.95em] mb-8">
          {"We'll"} confirm within 24 hrs
        </p>

        <div className="bg-tn-white rounded-xl shadow-[var(--shadow-md)] overflow-hidden">
          <div className="bg-gradient-to-br from-tn-forest to-tn-field px-8 py-7">
            <h2 className="font-serif text-[1.8em] tracking-[2px] text-tn-white uppercase">
              Booking Request
            </h2>
            <p className="text-[0.85em] text-white/70 mt-1">BookTrueNorth.com &middot; 763-280-1694</p>
          </div>
          <div className="p-9 max-sm:p-5">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  )
}
