"use client"

import { memo, useEffect, useState } from "react"
import { getStoredQuotes, deleteQuote, formatQuoteDate } from "@/lib/quote-history"
import { fmt } from "@/lib/constants"
import { Trash2, Clock } from "lucide-react"
import type { StoredQuote } from "@/lib/quote-history"

export const QuoteHistory = memo(function QuoteHistory() {
  const [quotes, setQuotes] = useState<StoredQuote[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setQuotes(getStoredQuotes())
  }, [])

  const handleDelete = (id: string) => {
    deleteQuote(id)
    setQuotes(getStoredQuotes())
  }

  const handleLoadQuote = (quote: StoredQuote) => {
    // Dispatch event for parent to handle quote loading
    window.dispatchEvent(
      new CustomEvent("loadQuote", { detail: quote })
    )
    setIsOpen(false)
  }

  if (quotes.length === 0) return null

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-tn-cream border-2 border-tn-border rounded-lg hover:border-tn-lime transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-tn-field" />
          <span className="text-[0.85em] font-bold text-tn-forest">
            {quotes.length} {quotes.length === 1 ? "Saved Quote" : "Saved Quotes"}
          </span>
        </div>
        <span className="text-[0.7em] text-tn-lgray">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 bg-tn-white border-2 border-tn-border rounded-lg p-4 max-h-64 overflow-y-auto">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="flex items-center justify-between p-3 bg-tn-cream rounded-lg hover:bg-[#f3fae8] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleLoadQuote(quote)}
                  className="block w-full text-left hover:opacity-75"
                >
                  <div className="font-semibold text-[0.85em] text-tn-forest truncate">
                    {quote.name}
                  </div>
                  <div className="text-[0.7em] text-tn-lgray">
                    {fmt(quote.data.total)} • {formatQuoteDate(quote.createdAt)}
                  </div>
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(quote.id)}
                className="ml-2 p-2 text-tn-lgray hover:text-tn-error transition-colors flex-shrink-0"
                aria-label="Delete quote"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
