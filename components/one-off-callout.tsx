import { Phone, Wrench } from "lucide-react"

export function OneOffCallout() {
  return (
    <div className="bg-tn-white border-t-4 border-t-tn-lime border-b border-b-tn-stone px-6 py-[22px]">
      <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-[18px]">
        <div className="flex items-center gap-4">
          <div className="bg-tn-forest text-tn-gold rounded-full w-12 h-12 flex items-center justify-center text-[1.4em] shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif text-[1.25em] tracking-[2px] text-tn-forest uppercase">
              {"Don't need a full season? No problem."}
            </div>
            <div className="text-[0.85em] text-tn-gray mt-0.5">
              We offer <strong>one-off &amp; on-demand services</strong> — mowing, cleanup, aeration, dethatching, and more, booked whenever you need them. Just select <strong>Stand-Alone</strong> in the calculator below or call us directly.
            </div>
          </div>
        </div>
        <a
          href="tel:7632801694"
          className="inline-flex items-center gap-2 bg-tn-gold text-tn-forest font-sans font-black text-[0.85em] tracking-[1px] uppercase px-5 py-[10px] rounded no-underline transition-transform hover:scale-[1.03] shrink-0"
        >
          <Phone className="w-4 h-4" />
          Call to Book
        </a>
      </div>
    </div>
  )
}
