import { Phone } from "lucide-react"

export function Hero() {
  return (
    <header className="relative overflow-hidden py-[70px] px-6 text-center bg-gradient-to-br from-[rgba(74,95,20,0.97)] via-[rgba(80,100,20,0.90)] to-[rgba(93,113,40,0.82)]">
      {/* Compass rose watermark */}
      <div className="absolute -right-15 -top-15 text-[400px] text-white/[0.03] pointer-events-none leading-none select-none" aria-hidden="true">
        {"✦"}
      </div>

      <div className="inline-block bg-tn-gold text-tn-forest font-sans font-black text-[0.78em] tracking-[3px] uppercase px-[18px] py-[5px] rounded-sm mb-[18px]">
        2026 Season — Compass Care Subscription
      </div>

      <div className="inline-block bg-white/95 px-7 py-3 rounded-[10px] shadow-[0_6px_32px_rgba(0,0,0,0.4)] mb-[18px]">
        <div className="font-serif text-tn-forest text-xl tracking-[3px] uppercase">
          True North
        </div>
      </div>

      <h1 className="font-serif text-[clamp(3em,8vw,5.5em)] text-tn-white tracking-[4px] uppercase leading-[0.95] mb-[6px]">
        Lawn Care
        <em className="not-italic text-tn-gold block">Done Right</em>
      </h1>

      <p className="text-[1.05em] text-white/75 font-light tracking-wide mb-7">
        30-Week Season &middot; 5% Off &middot; Spring/Fall Cleanup Included &middot; 2 Edge Jobs Included
      </p>

      <div className="flex justify-center gap-[14px] flex-wrap">
        <a
          href="#calculator"
          className="inline-flex items-center gap-2 bg-tn-gold text-tn-forest font-sans font-black text-base tracking-[1px] uppercase px-7 py-[14px] rounded border-none cursor-pointer no-underline transition-all hover:translate-y-[-3px] hover:shadow-[0_8px_24px_rgba(232,185,35,0.45)] hover:bg-[#f5c842]"
        >
          Get My Instant Quote
        </a>
        <a
          href="tel:7632801694"
          className="inline-flex items-center gap-2 bg-transparent text-tn-white border-2 border-white/60 font-sans font-bold text-base tracking-[1px] uppercase px-[26px] py-3 rounded cursor-pointer no-underline transition-all hover:border-tn-gold hover:bg-[rgba(232,185,35,0.12)]"
        >
          <Phone className="w-4 h-4" />
          763-280-1694
        </a>
      </div>
    </header>
  )
}
