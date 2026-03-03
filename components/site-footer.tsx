import { Phone, Globe } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-tn-forest px-6 pt-12 pb-7 text-white/65 text-[0.88em] print:hidden">
      <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-8 pb-8 border-b border-white/10 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <div className="font-serif text-[1.7em] tracking-[3px] text-tn-white flex items-center gap-[10px] mb-[10px]">
            <div className="bg-tn-gold text-tn-forest w-9 h-9 rounded flex items-center justify-center text-[0.85em] shrink-0">
              TN
            </div>
            TRUE NORTH
          </div>
          <div className="text-[0.88em] text-white/70 leading-[1.7]">
            True North Outdoor Services<br />
            True North Enterprises MN
          </div>
          <div className="italic text-[0.85em] text-white/50 mt-1">
            {'"Done Right. Every Time."'}
          </div>
        </div>
        <div>
          <h4 className="font-serif text-[0.95em] tracking-[2px] text-tn-gold uppercase mb-[10px]">
            Services
          </h4>
          <div className="space-y-0 leading-[1.9]">
            <span className="block text-white/75">Lawn Mowing</span>
            <span className="block text-white/75">Spring &amp; Fall Cleanup</span>
            <span className="block text-white/75">Core Aeration</span>
            <span className="block text-white/75">Dethatching</span>
            <span className="block text-white/75">Shrub Trimming</span>
            <span className="block text-white/75">Snow Removal</span>
          </div>
        </div>
        <div>
          <h4 className="font-serif text-[0.95em] tracking-[2px] text-tn-gold uppercase mb-[10px]">
            Contact
          </h4>
          <div className="space-y-0 leading-[1.9]">
            <a href="tel:7632801694" className="flex items-center gap-2 text-white/75 no-underline hover:text-tn-gold transition-colors">
              <Phone className="w-3 h-3" /> 763-280-1694
            </a>
            <a href="https://booktruenorth.com" className="flex items-center gap-2 text-white/75 no-underline hover:text-tn-gold transition-colors">
              <Globe className="w-3 h-3" /> BookTrueNorth.com
            </a>
          </div>
          <p className="mt-[10px] text-[0.82em] text-white/50">
            Serving the Twin Cities metro area.<br />
            Sign up by April 1 for Compass Care pricing.
          </p>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto mt-5 flex justify-between flex-wrap gap-2 text-[0.78em] text-white/40">
        <span>&copy; {new Date().getFullYear()} True North Enterprises MN. All rights reserved.</span>
        <span>BookTrueNorth.com &middot; 763-280-1694</span>
      </div>
    </footer>
  )
}
