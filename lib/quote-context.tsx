"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
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
  serviceType: "compass" | "individual" | null
  setServiceType: (v: "compass" | "individual" | null) => void
  selectedServices: Record<string, boolean>
  setSelectedServices: (v: Record<string, boolean>) => void
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
  const [lotSize, setLotSize] = useState("")
  const [payMethod, setPayMethod] = useState("")
  const [serviceType, setServiceType] = useState<"compass" | "individual" | null>(null)
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({})
  const [addons, setAddons] = useState<Record<string, boolean>>({})
  const [shrubCount, setShrubCount] = useState(1)
  const [singleStory, setSingleStory] = useState(false)
  const [landscapingNote, setLandscapingNote] = useState("")
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
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

    const deadlinePassed = isAfterDeadline()
    const isIndividual = serviceType === "individual"
    const useSA = isIndividual || payMethod === "standalone" || deadlinePassed
    const isSub = !useSA

    const aos: Record<string, number | null> = {}
    let aosTotal = 0
    let mowingTotal = 0
    let weeklyMow = 0

    // Handle Individual Services
    if (isIndividual) {
      if (selectedServices.mowing) {
        weeklyMow = SA_MOWING[lotSize]
        aos["Weekly Mowing (per visit)"] = weeklyMow
        mowingTotal = weeklyMow
      }
      if (selectedServices.spring) {
        aos["Spring Clean Up (Quote Requested)"] = null
      }
      if (selectedServices.fall) {
        aos["Fall Clean Up (Quote Requested)"] = null
      }
    } else {
      // Compass Care subscription
      weeklyMow = SUB_MOWING[lotSize]
      mowingTotal = weeklyMow * WEEKS

      // Add-ons for Compass Care
      if (addons.overseeding) aos["Overseeding (Quote Requested)"] = null
      if (addons.aeration) aos["Core Aeration (Quote Requested)"] = null
      if (addons.dethatching) aos["Dethatching (Quote Requested)"] = null
      if (addons.weed) aos["Weed Control (Quote Requested)"] = null

      if (addons.shrub) {
        const n = Math.max(1, shrubCount)
        const c = AO_RATES.shrub * n
        aos[`Shrub Trimming (${n} shrub${n !== 1 ? "s" : ""})`] = c
        aosTotal += c
      }

      if (addons.gutter) {
        if (singleStory) {
          aos["Gutter Clean-Out"] = AO_RATES.gutter
          aosTotal += AO_RATES.gutter
        } else {
          aos["Gutter Clean-Out (Confirm single-story below to include)"] = null
        }
      }

      if (addons.dog) {
        const c = AO_RATES.dog * WEEKS
        aos["Dog Waste Pickup (30 wks, 1 dog)"] = c
        aosTotal += c
      }

      if (addons.edging) aos["Edging (Quote Requested)"] = null
      if (addons.landscaping) {
        const note = landscapingNote.trim()
        aos[`General Landscaping (Quote Requested)${note ? ": " + note : ""}`] = null
      }
      if (addons.snow) aos["Snow Removal (Separate Winter Subscription)"] = null
    }

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
  }, [lotSize, payMethod, serviceType, selectedServices, addons, shrubCount, singleStory, landscapingNote])

  return (
    <QuoteContext.Provider value={{
      lotSize, setLotSize, payMethod, setPayMethod,
      serviceType, setServiceType, selectedServices, setSelectedServices,
      addons, toggleAddon, shrubCount, setShrubCount,
      singleStory, setSingleStory, landscapingNote, setLandscapingNote,
      quoteData, calcQuote, quoteUnlocked, setQuoteUnlocked,
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
