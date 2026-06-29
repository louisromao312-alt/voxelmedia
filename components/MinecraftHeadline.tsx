import localFont from 'next/font/local'

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
      className={`${minecraftTen.className} minecraft-headline w-full text-center`}
      aria-label={text.replace('\n', ' ')}
    >
      {lines.map((line) => (
        <MinecraftLine key={line}>{line}</MinecraftLine>
      ))}
    </h1>
  )
}
