import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import VoxelCursor from '@/components/VoxelCursor'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Voxel — The Data Engine for the Minecraft Creator Economy',
  description:
    'Uncover the mechanics behind viral Minecraft modpacks, server trends, and content formats. Join the insider waitlist.',
  openGraph: {
    title: 'Voxel — The Data Engine for the Minecraft Creator Economy',
    description:
      'Uncover the mechanics behind viral Minecraft modpacks, server trends, and content formats.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full bg-[#0A0A0C]`}
    >
      <body className="min-h-full antialiased bg-[#0A0A0C] text-white overflow-x-hidden">
        <div className="noise-overlay" aria-hidden="true" />
        <VoxelCursor />
        {children}
      </body>
    </html>
  )
}
