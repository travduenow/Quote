/**
 * Environment Configuration Documentation
 * 
 * Required Variables (Already set in .env.local):
 * NEXT_PUBLIC_FORMSPREE_URL - Formspree endpoint for form submissions
 * 
 * Optional Variables for Enhanced Features:
 * 
 * Database Integration (Supabase / Neon):
 * DATABASE_URL - PostgreSQL connection string
 * DATABASE_SECRET - Database secret key
 * 
 * Analytics & Monitoring:
 * ANALYTICS_KEY - Third-party analytics API key
 * SENTRY_DSN - Error tracking (optional)
 * 
 * Email Service (for enhanced notifications):
 * SENDGRID_API_KEY - SendGrid for email notifications
 * SEND_GRID_TEMPLATE_ID - Email template ID
 * 
 * Rate Limiting (Redis):
 * UPSTASH_REDIS_REST_URL - Redis REST endpoint
 * UPSTASH_REDIS_REST_TOKEN - Redis token
 * 
 * Feature Flags:
 * ENABLE_QUOTE_HISTORY=true
 * ENABLE_PDF_EXPORT=false (requires implementation)
 * ENABLE_DATABASE_STORAGE=false (requires database setup)
 */

// Runtime config validation
export function validateEnv() {
  const required = ["NEXT_PUBLIC_FORMSPREE_URL"]
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`)
  }

  return {
    formspreeUrl: process.env.NEXT_PUBLIC_FORMSPREE_URL,
    databaseUrl: process.env.DATABASE_URL,
    analyticsKey: process.env.ANALYTICS_KEY,
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    enableQuoteHistory: process.env.ENABLE_QUOTE_HISTORY !== "false",
    enablePdfExport: process.env.ENABLE_PDF_EXPORT === "true",
    enableDatabaseStorage: process.env.ENABLE_DATABASE_STORAGE === "true",
  }
}
