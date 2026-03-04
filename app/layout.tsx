import type { Metadata } from 'next'
import { Bebas_Neue, Barlow } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })
const barlow = Barlow({
  weight: ['300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'Compass Care Subscription | True North Outdoor Services | BookTrueNorth.com',
  description:
    'Get an instant quote for lawn mowing, cleanup, and outdoor services in the Twin Cities. Compass Care subscription — 30-week season, discounted rate, cleanups included.',
  openGraph: {
    title: 'Instant Lawn Care Quote | True North Outdoor Services',
    description:
      '30-week Compass Care subscription or individual services. Lock in your season price — sign up by April 1 for a discounted rate.',
    type: 'website',
    url: 'https://booktruenorth.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden leading-relaxed">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
