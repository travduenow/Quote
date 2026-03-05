"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import {
  WEEKS, CARD_FEE_RATE, SUB_DISC_RATE,
  SUB_MOWING, SA_MOWING, AO_RATES,
  LOT_LABELS, PAY_LABELS, fmt, isAfterDeadline,
  type QuoteData,
} from "./constants"

interface QuoteContextType {
  lotSize: string
  setLotSize: (v: string) => void
  payMethod: string
  setPayMethod: (v: string) => void
  addons: Record<string, boolean>
  toggleAddon: (id: string) => void
  shrubCount: number
  setShrubCount: (n: number) => void
  singleStory: boolean
  setSingleStory: (v: boolean) => void
  landscapingNote: string
  setLandscapingNote: (v: string) => void
  quoteData: QuoteData | null
  calcQuote: () => void
  isCalculating: boolean
  quoteUnlocked: boolean
  setQuoteUnlocked: (v: boolean) => void
  gateName: string
  setGateName: (v: string) => void
  gateEmail: string
  setGateEmail: (v: string) => void
  gatePhone: string
  setGatePhone: (v: string) => void
  gateReferral: string
  setGateReferral: (v: string) => void
  gateContactPref: string
  setGateContactPref: (v: string) => void
}

const QuoteContext = createContext<QuoteContextType | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lotSize, setLotSize] = useState("quarter")
  const [payMethod, setPayMethod] = useState("card")
  const [addons, setAddons] = useState<Record<string, boolean>>({})
  const [shrubCount, setShrubCount] = useState(1)
  const [singleStory, setSingleStory] = useState(false)
  const [landscapingNote, setLandscapingNote] = useState("")
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [quoteUnlocked, setQuoteUnlocked] = useState(false)
  const [gateName, setGateName] = useState("")
  const [gateEmail, setGateEmail] = useState("")
  const [gatePhone, setGatePhone] = useState("")
  const [gateReferral, setGateReferral] = useState("")
  const [gateContactPref, setGateContactPref] = useState("")

  const toggleAddon = useCallback((id: string) => {
    setAddons(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const calcQuote = useCallback(() => {
    if (!lotSize || !payMethod) return
    
    // Return early if custom lot size is selected
    if (lotSize === "custom") {
      setQuoteData(null)
      return
    }

    setIsCalculating(true)
    
    // Simulate calculation delay for smooth loading state
    setTimeout(() => {
      const deadlinePassed = isAfterDeadline()
      const useSA = payMethod === "standalone" || deadlinePassed
      const isSub = !useSA

      const weeklyMow = useSA ? SA_MOWING[lotSize] : SUB_MOWING[lotSize]
      const mowingTotal = isSub ? weeklyMow * WEEKS : weeklyMow
      const aos: Record<string, number | null> = {}
      let aosTotal = 0

      if (addons.overseeding) aos["🌱 Overseeding (Quote Requested)"] = null
      if (addons.aeration) aos["🔄 Core Aeration (Quote Requested)"] = null
      if (addons.dethatching) aos["🪚 Dethatching (Quote Requested)"] = null
      if (addons.weed) aos["🌿 Weed Control (Quote Requested)"] = null

      if (addons.shrub) {
        const n = Math.max(1, shrubCount)
        const c = AO_RATES.shrub * n
        aos[`✂️ Shrub Trimming (${n} shrub${n !== 1 ? "s" : ""})`] = c
        aosTotal += c
      }

      if (addons.gutter) {
        if (singleStory) {
          aos["🍂 Gutter Clean-Out"] = AO_RATES.gutter
          aosTotal += AO_RATES.gutter
        } else {
          aos["🍂 Gutter Clean-Out (Confirm single-story below to include)"] = null
        }
      }

      if (addons.dog) {
        if (isSub) {
          const c = AO_RATES.dog * WEEKS
          aos["🐾 Dog Waste Pickup (30 wks, 1 dog)"] = c
          aosTotal += c
        } else {
          aos["🐾 Dog Waste Pickup (Compass Care only)"] = null
        }
      }

      if (addons.edging) aos["📐 Edging (Quote Requested)"] = null
      if (addons.landscaping) {
        const note = landscapingNote.trim()
        aos[`🌳 General Landscaping (Quote Requested)${note ? ": " + note : ""}`] = null
      }
      if (addons.snow) aos["❄️ Snow Removal (Separate Winter Subscription — Quote Requested)"] = null

      const subtotal = mowingTotal + aosTotal
      const discount = isSub ? subtotal * SUB_DISC_RATE : 0
      const afterDisc = subtotal - discount
      const cardFee = payMethod === "card" ? afterDisc * CARD_FEE_RATE : 0
      const total = afterDisc + cardFee
      const weeklyPayment = isSub ? total / WEEKS : null

      const data: QuoteData = {
        lot: lotSize, pay: payMethod, isSub, useSA, deadlinePassed,
        weeklyMow, mowingTotal, aos, aosTotal, subtotal, discount,
        afterDisc, cardFee, total, weeklyPayment,
      }

      setQuoteData(data)
      setIsCalculating(false)
    }, 300)
  }, [lotSize, payMethod, addons, shrubCount, singleStory, landscapingNote])

  // Auto-calculate quote when dependencies change
  useEffect(() => {
    calcQuote()
  }, [calcQuote])

  return (
    <QuoteContext.Provider value={{
      lotSize, setLotSize, payMethod, setPayMethod,
      addons, toggleAddon, shrubCount, setShrubCount,
      singleStory, setSingleStory, landscapingNote, setLandscapingNote,
      quoteData, calcQuote, isCalculating, quoteUnlocked, setQuoteUnlocked,
      gateName, setGateName, gateEmail, setGateEmail,
      gatePhone, setGatePhone, gateReferral, setGateReferral,
      gateContactPref, setGateContactPref,
    }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error("useQuote must be within QuoteProvider")
  return ctx
}
