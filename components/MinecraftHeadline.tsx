import { Bungee } from 'next/font/google'

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
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

export default function MinecraftHeadline({
  text,
  id = 'hero-heading',
}: {
  text: string
  id?: string
}) {
  const lines = text.split('\n')

  return (
    <h1
      id={id}
      className={`${bungee.className} minecraft-headline w-full text-center`}
      aria-label={text.replace('\n', ' ')}
    >
      {lines.map((line) => (
        <MinecraftLine key={line}>{line}</MinecraftLine>
      ))}
    </h1>
  )
}
