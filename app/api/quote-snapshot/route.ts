import { NextRequest, NextResponse } from "next/server"
import type { QuoteData } from "@/lib/constants"

// This API endpoint is prepared for future database integration
// Currently it validates and returns the quote data for client-side storage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { quoteData?: QuoteData; email?: string }

    // Validate quote data structure
    if (!body.quoteData || typeof body.quoteData !== "object") {
      return NextResponse.json(
        { error: "Invalid quote data" },
        { status: 400 }
      )
    }

    const { lot, pay, total, weeklyPayment } = body.quoteData

    // Basic validation
    if (!lot || !pay || total === undefined) {
      return NextResponse.json(
        { error: "Missing required quote fields" },
        { status: 400 }
      )
    }

    // In the future, this could:
    // 1. Store the quote in a database
    // 2. Generate a unique shareable link
    // 3. Log analytics
    // 4. Create invoice/PDF

    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("Quote snapshot received:", {
      quoteId,
      lot,
      pay,
      total,
      email: body.email,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        quoteId,
        message: "Quote snapshot recorded",
        // Future fields:
        // shareLink: `/quote/${quoteId}`,
        // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Quote snapshot error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to process quote snapshot" },
      { status: 500 }
    )
  }
}
