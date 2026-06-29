'use client'

export default function ScrollToWaitlist() {
  const scroll = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={scroll}
      aria-label="Navigate to waitlist signup section"
      className="group relative isolate cursor-pointer overflow-hidden rounded-full border border-white/[0.09] px-5 py-2 font-mono text-sm text-zinc-400 transition-[border-color,box-shadow] duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(74,222,128,0.12)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-[-12%] bottom-0 z-0 h-[140%] translate-y-[72%] rounded-[48%] bg-gradient-to-t from-green-500 via-green-400 to-green-300/95 transition-[transform,border-radius] duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-y-0 group-hover:rounded-none"
      />
      <span className="relative z-10 transition-colors duration-[650ms] delay-100 ease-out group-hover:text-[#0A0A0C]">
        Join Voxel
      </span>
    </button>
  )
}
