import { NextRequest, NextResponse } from "next/server"

// Enhanced form submission handler with better error handling and validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["from_name", "from_email", "phone", "address"]
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== "string") {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.from_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate phone format (basic check)
    const phoneDigits = body.phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      )
    }

    // Rate limiting check (could be enhanced with Redis)
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const key = `form_submission_${ip}`
    // TODO: Implement Redis rate limiting

    // Forward to Formspree
    const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL || "https://formspree.io/f/YOUR_FORM_ID"
    
    const response = await fetch(formspreeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error("Formspree error:", response.status, await response.text())
      return NextResponse.json(
        { error: "Failed to submit form. Please try again." },
        { status: 500 }
      )
    }

    const data = await response.json()

    // Log successful submission (could be sent to analytics)
    console.log("Form submission successful:", {
      email: body.from_email,
      timestamp: new Date().toISOString(),
      type: "quote_request",
    })

    return NextResponse.json(
      { success: true, message: "Form submitted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Form submission error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request" },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout. Please try again." },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
