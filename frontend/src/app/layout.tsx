import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Encrypted Random Selector',
  description: 'A privacy-preserving lottery system built on FHEVM',
  keywords: ['FHEVM', 'blockchain', 'privacy', 'lottery', 'encryption'],
  authors: [
    { name: 'JoyChurchill4', email: 'gamilmoodyea@outlook.com' },
    { name: 'DarnellViolet', email: 'nayrakalacqx@outlook.com' }
  ],
  openGraph: {
    title: 'Encrypted Random Selector',
    description: 'Privacy-preserving random selection on FHEVM',
    url: 'https://pro3-bice.vercel.app/',
    siteName: 'Encrypted Random Selector',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Encrypted Random Selector',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encrypted Random Selector',
    description: 'Privacy-preserving random selection on FHEVM',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                FHEVM Docs
              </a>
              <a
                href="https://github.com/zama-ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.zama.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Zama
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Built with ❤️ using FHEVM •{' '}
              <a
                href="https://pro3-bice.vercel.app/"
                className="text-blue-600 hover:underline"
              >
                Live Demo
              </a>
            </p>
            <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
              <span>UI: JoyChurchill4</span>
              <span>•</span>
              <span>Contract: DarnellViolet</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
