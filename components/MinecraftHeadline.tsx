import localFont from 'next/font/local'
import type { ReactNode } from 'react'

const minecraftTen = localFont({
  src: '../public/fonts/MinecraftTen.woff',
  display: 'swap',
  variable: '--font-minecraft',
})

function MinecraftLine({ children }: { children: string }) {
  return (
    <span className="minecraft-title-line block">
      <span className="minecraft-title-extrude" aria-hidden="true">
        {children}
      </span>
      <span className="minecraft-title-face">{children}</span>
    </span>
  )
}

export function MinecraftBetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="minecraft-beta-block">
      <span className="minecraft-beta-text">{children}</span>
    </span>
  )
}

export default function MinecraftHeadline({
  text,
  middle,
  id = 'hero-heading',
}: {
  text: string
  middle?: ReactNode
  id?: string
}) {
  const lines = text.split('\n')

  return (
    <h1
      id={id}
      className={`${minecraftTen.className} minecraft-headline w-full text-center`}
      aria-label={text.replace('\n', ' ')}
    >
      {lines.length >= 2 && middle ? (
        <>
          <MinecraftLine>{lines[0]}</MinecraftLine>
          <span className="minecraft-headline-middle block">{middle}</span>
          {lines.slice(1).map((line) => (
            <MinecraftLine key={line}>{line}</MinecraftLine>
          ))}
        </>
      ) : (
        lines.map((line) => <MinecraftLine key={line}>{line}</MinecraftLine>)
      )}
    </h1>
  )
}
