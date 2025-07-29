import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import HeaderWithLinks from '../../Front-End/components/HeaderWithLinks'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Lentils & Millets - Premium Organic Grains for Modern Healthy Living',
  description: 'Discover the power of premium organic lentils and ancient millets. From quick family meals to gourmet superfood experiences.',
  keywords: 'lentils, millets, organic, healthy food, gluten-free, ancient grains, recipes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <HeaderWithLinks />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}