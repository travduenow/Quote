import { Phone, Globe } from "lucide-react"

export function Topbar() {
  return (
    <div className="bg-tn-forest px-6 py-2 flex justify-between items-center text-[0.82em] text-white/75 max-sm:hidden">
      <span>True North Outdoor Services &middot; Twin Cities Metro</span>
      <div className="flex gap-5 items-center">
        <a
          href="tel:7632801694"
          className="text-tn-gold font-bold tracking-wide no-underline hover:underline flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          763-280-1694
        </a>
        <a
          href="https://booktruenorth.com"
          className="text-tn-gold font-bold tracking-wide no-underline hover:underline flex items-center gap-1"
        >
          <Globe className="w-3 h-3" />
          BookTrueNorth.com
        </a>
      </div>
    </div>
  )
}
