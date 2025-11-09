import type { Metadata } from 'next'
import './globals.css'
import Toast from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Machine Monitoring Dashboard',
  description: 'Monitor your machines in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toast />
      </body>
    </html>
  )
}

