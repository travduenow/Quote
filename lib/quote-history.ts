import { type QuoteData } from "./constants"

export interface StoredQuote {
  id: string
  data: QuoteData
  createdAt: number
  name?: string
}

const STORAGE_KEY = "tn_quote_history"
const MAX_STORED_QUOTES = 5

export function getStoredQuotes(): StoredQuote[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveQuote(quoteData: QuoteData, name?: string): StoredQuote {
  if (typeof window === "undefined") return null as any
  
  const quotes = getStoredQuotes()
  const id = `quote_${Date.now()}`
  
  const newQuote: StoredQuote = {
    id,
    data: quoteData,
    createdAt: Date.now(),
    name: name || `Quote from ${new Date().toLocaleDateString()}`,
  }
  
  quotes.unshift(newQuote)
  
  // Keep only recent quotes
  if (quotes.length > MAX_STORED_QUOTES) {
    quotes.pop()
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
  
  return newQuote
}

export function deleteQuote(id: string): void {
  if (typeof window === "undefined") return
  
  const quotes = getStoredQuotes().filter(q => q.id !== id)
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  } catch {
    // Silently fail
  }
}

export function formatQuoteDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
