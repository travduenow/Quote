/**
 * Database Schema Types
 * These are prepared for future database integration (Supabase, Neon, etc.)
 */

export interface BookingRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  notes?: string
  startDate?: string
  contactPreference: "phone" | "text" | "email"
  quoteId?: string
  createdAt: Date
  updatedAt: Date
  status: "new" | "contacted" | "scheduled" | "completed" | "rejected"
}

export interface QuoteSnapshot {
  id: string
  lotSize: string
  paymentMethod: "card" | "cash" | "standalone"
  addOns: Record<string, boolean>
  totalPrice: number
  weeklyPrice?: number
  isSubscription: boolean
  email?: string
  createdAt: Date
  expiresAt: Date
  shareToken?: string
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  referralSource?: string
  createdAt: Date
  updatedAt: Date
  bookings?: BookingRequest[]
  quotes?: QuoteSnapshot[]
}

export interface AnalyticsEvent {
  id: string
  eventType: "quote_calculated" | "quote_saved" | "booking_requested" | "email_submitted"
  email?: string
  quoteTotal?: number
  lotSize?: string
  paymentMethod?: string
  userAgent?: string
  ipAddress?: string
  createdAt: Date
}

/**
 * SQL Migration Scripts (for Supabase/Neon/PostgreSQL)
 * 
 * CREATE TABLE IF NOT EXISTS customers (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   first_name VARCHAR(100),
 *   last_name VARCHAR(100),
 *   phone VARCHAR(20),
 *   address TEXT,
 *   city VARCHAR(100),
 *   state VARCHAR(2),
 *   zip VARCHAR(10),
 *   referral_source VARCHAR(255),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE IF NOT EXISTS booking_requests (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   customer_id UUID REFERENCES customers(id),
 *   first_name VARCHAR(100) NOT NULL,
 *   last_name VARCHAR(100) NOT NULL,
 *   email VARCHAR(255) NOT NULL,
 *   phone VARCHAR(20) NOT NULL,
 *   address TEXT NOT NULL,
 *   city VARCHAR(100) NOT NULL,
 *   state VARCHAR(2) NOT NULL,
 *   zip VARCHAR(10) NOT NULL,
 *   notes TEXT,
 *   start_date DATE,
 *   contact_preference VARCHAR(50),
 *   quote_id UUID,
 *   status VARCHAR(50) DEFAULT 'new',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE IF NOT EXISTS quote_snapshots (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   lot_size VARCHAR(50),
 *   payment_method VARCHAR(50),
 *   add_ons JSONB,
 *   total_price DECIMAL(10, 2),
 *   weekly_price DECIMAL(10, 2),
 *   is_subscription BOOLEAN DEFAULT false,
 *   email VARCHAR(255),
 *   share_token VARCHAR(255) UNIQUE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 *   expires_at TIMESTAMP WITH TIME ZONE
 * );
 * 
 * CREATE TABLE IF NOT EXISTS analytics_events (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   event_type VARCHAR(100),
 *   email VARCHAR(255),
 *   quote_total DECIMAL(10, 2),
 *   lot_size VARCHAR(50),
 *   payment_method VARCHAR(50),
 *   user_agent TEXT,
 *   ip_address INET,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE INDEX idx_bookings_status ON booking_requests(status);
 * CREATE INDEX idx_bookings_created ON booking_requests(created_at);
 * CREATE INDEX idx_quotes_email ON quote_snapshots(email);
 * CREATE INDEX idx_analytics_event ON analytics_events(event_type);
 */
