import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tiny Suitcase Travel Agency - Coming Soon',
  description: 'Boutique travel agency specializing in personalized experiences for influencers. Coming soon.',
  keywords: 'travel agency, boutique travel, influencer travel, personalized travel, luxury travel',
  authors: [{ name: 'Tiny Suitcase' }],
  openGraph: {
    title: 'Tiny Suitcase Travel Agency - Coming Soon',
    description: 'Boutique travel agency specializing in personalized experiences for influencers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiny Suitcase Travel Agency - Coming Soon',
    description: 'Boutique travel agency specializing in personalized experiences for influencers.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/TG-GirthyUltra.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/RedditMono-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

