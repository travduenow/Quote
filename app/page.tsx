import { Topbar } from "@/components/topbar"
import { Hero } from "@/components/hero"
import { DeadlineBanner } from "@/components/deadline-banner"
import { OneOffCallout } from "@/components/one-off-callout"
import { SiteFooter } from "@/components/site-footer"
import { CalculatorSection } from "@/components/calculator-section"

export default function HomePage() {
  return (
    <>
      <Topbar />
      <Hero />
      <DeadlineBanner />
      <OneOffCallout />
      <CalculatorSection />
      <SiteFooter />
    </>
  )
}
