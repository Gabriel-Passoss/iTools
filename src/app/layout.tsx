import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Heaty',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <ClerkProvider localization={ptBR}>
          <Toaster />
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
