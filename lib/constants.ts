// ═══════════════════════════════════════════════════════════════
//  TRUE NORTH OUTDOOR SERVICES — COMPASS CARE QUOTE CALCULATOR
//  BookTrueNorth.com | 763-280-1694 | True North Enterprises MN
// ═══════════════════════════════════════════════════════════════

export const WEEKS = 30
export const CARD_FEE_RATE = 0.03 // 3%
export const SUB_DISC_RATE = 0.05 // 5%

// Compass Care Subscription — Weekly Pricing
export const SUB_MOWING: Record<string, number> = {
  eighth: 63,
  quarter: 76,
  half: 96,
  threequarter: 112,
  acre: 128,
}

// Regular Services — Pay-As-You-Go Pricing
export const SA_MOWING: Record<string, number> = {
  eighth: 50,
  quarter: 60,
  half: 75,
  threequarter: 85,
  acre: 95,
}

// Add-On Rates
export const AO_RATES = {
  shrub: 25,
  gutter: 150,
  dog: 15,
}

export const LOT_LABELS: Record<string, string> = {
  eighth: '1/8 Acre',
  quarter: '1/4 Acre',
  half: '1/2 Acre',
  threequarter: '3/4 Acre',
  acre: '1 Acre',
  custom: '1+ Acre (Custom)',
}

export const PAY_LABELS: Record<string, string> = {
  card: 'Card (weekly)',
  cash: 'Cash (full upfront)',
  standalone: 'One-Time Service',
}

// Season deadline — auto-rolls to next year if current deadline has passed
function getSeasonDeadline(): Date {
  const now = new Date()
  const thisYear = new Date(now.getFullYear(), 3, 1) // April 1 this year
  return now < thisYear ? thisYear : new Date(now.getFullYear() + 1, 3, 1)
}
export const DEADLINE = getSeasonDeadline()

export const LOT_OPTIONS = [
  { value: 'eighth', label: '1/8 Acre', sub: 'Small' },
  { value: 'quarter', label: '1/4 Acre', sub: 'Small-Medium' },
  { value: 'half', label: '1/2 Acre', sub: 'Medium' },
  { value: 'threequarter', label: '3/4 Acre', sub: 'Medium-Large' },
  { value: 'acre', label: '1 Acre', sub: 'Large' },
  { value: 'custom', label: '1+ Acre', sub: 'Contact for Quote' },
]

export const ADDON_OPTIONS = [
  { id: 'overseeding', label: 'Overseeding', icon: '🌱', desc: 'Spreads fresh grass seed to fill in thin or bare spots and thicken your lawn.', price: 'Request a quote · eligible for subscription', eligible: true },
  { id: 'aeration', label: 'Core Aeration', icon: '🔄', desc: 'Pulls small plugs from the soil to reduce compaction and let water and nutrients reach the roots.', price: 'Request a quote · eligible for subscription', eligible: true },
  { id: 'dethatching', label: 'Dethatching', icon: '🪚', desc: 'Removes the layer of dead grass and debris that builds up and chokes healthy growth.', price: 'Request a quote · eligible for subscription', eligible: true },
  { id: 'weed', label: 'Weed Control', icon: '🌿', desc: 'Targeted treatment to eliminate weeds and keep your lawn looking clean all season.', price: 'Request a quote · eligible for subscription', eligible: true },
  { id: 'shrub', label: 'Shrub Trimming', icon: '✂️', desc: 'Shapes and trims shrubs and bushes to keep your landscaping neat and tidy.', price: '$25 per shrub', hasSub: true },
  { id: 'gutter', label: 'Gutter Clean-Out', icon: '🍂', desc: 'Clears leaves and debris from gutters to prevent clogging and water damage. Single-story only.', price: '$150 flat fee · single-story homes only', hasSub: true },
  { id: 'dog', label: 'Dog Waste Pickup', icon: '🐾', desc: 'Weekly yard cleanup so you never have to deal with it — we handle it every visit.', price: '$15/week x 30 weeks (1 dog) · subscription only', eligible: true },
  { id: 'edging', label: 'Edging', icon: '📐', desc: 'Clean, sharp lines along driveways, sidewalks, and beds for a polished finished look.', price: 'Request a quote · eligible for subscription', eligible: true },
  { id: 'landscaping', label: 'General Landscaping', icon: '🌳', desc: 'Mulching, planting, bed cleanup, and more — tell us what you need and we\'ll quote it.', price: 'Request a quote', hasSub: true },
  { id: 'snow', label: 'Snow Removal', icon: '❄️', desc: 'Driveway and walkway clearing after snowfall — reliable service all winter long.', price: 'Request a quote · eligible for a separate winter subscription', snowSub: true },
]

export const REFERRAL_OPTIONS = [
  { value: 'Google Search', label: '🔍 Google Search' },
  { value: 'Facebook', label: '📘 Facebook' },
  { value: 'Neighbor Referral', label: '🏡 Neighbor Referral' },
  { value: 'Friend / Family', label: '👥 Friend / Family' },
  { value: 'Door Hanger / Flyer', label: '📄 Door Hanger / Flyer' },
  { value: 'Nextdoor', label: '📍 Nextdoor' },
  { value: 'Yard Sign', label: '🪧 Yard Sign' },
  { value: 'Other', label: 'Other' },
]

// Formspree URL — use environment variable or this placeholder
export const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_URL || 'https://formspree.io/f/REPLACE_ME'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface QuoteData {
  lot: string
  pay: string
  isSub: boolean
  useSA: boolean
  deadlinePassed: boolean
  weeklyMow: number
  mowingTotal: number
  aos: Record<string, number | null>
  aosTotal: number
  subtotal: number
  discount: number
  afterDisc: number
  cardFee: number
  total: number
  weeklyPayment: number | null
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

export function isAfterDeadline(): boolean {
  return new Date() >= DEADLINE
}
