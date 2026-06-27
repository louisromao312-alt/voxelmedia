'use client'

const TICKER_ITEMS = [
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Realism Packs', change: '+24%', up: true },
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Horror / Backrooms', change: '+18%', up: true },
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Skyblock Economy', change: '+12%', up: true },
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Hardcore Survival', change: '+9%', up: true },
  { label: 'DECLINING', platform: 'MINECRAFT', item: 'Cartoon / Cute', change: '-6%', up: false },
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Modded SMP', change: '+14%', up: true },
  { label: 'TRENDING', platform: 'MINECRAFT', item: 'Tech / Create', change: '+11%', up: true },
  { label: 'DECLINING', platform: 'MINECRAFT', item: 'Vanilla SMP', change: '-4%', up: false },
]

function TickerItem({
  label,
  platform,
  item,
  change,
  up,
}: (typeof TICKER_ITEMS)[number]) {
  return (
    <span className="inline-flex items-center gap-2 px-6 whitespace-nowrap font-mono text-xs tracking-widest">
      <span className="text-zinc-500 uppercase">{label}:</span>
      <span className="text-zinc-400 uppercase">{platform}</span>
      <span className="text-white/80">{item}</span>
      <span
        className={up ? 'text-green-400' : 'text-red-400'}
        aria-label={`${change} ${up ? 'increase' : 'decrease'}`}
      >
        {up ? '▲' : '▼'} {change}
      </span>
      <span className="text-zinc-700 mx-2">·</span>
    </span>
  )
}

export default function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      className="relative w-full overflow-hidden border-b border-white/[0.06] bg-[#0A0A0C]/80 backdrop-blur-sm"
      style={{ zIndex: 50 }}
      role="marquee"
      aria-label="Live Minecraft market trends ticker"
    >
      <div className="absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-[#0A0A0C] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#0A0A0C] to-transparent pointer-events-none" />

      <div className="py-2.5">
        <div className="ticker-track inline-flex">
          {doubled.map((item, i) => (
            <TickerItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}
