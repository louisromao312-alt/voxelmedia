'use client'

export default function ScrollToWaitlist() {
  const scroll = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={scroll}
      aria-label="Navigate to waitlist signup section"
      className="text-xs font-mono text-zinc-400 hover:text-white border border-white/[0.09] hover:border-white/20 rounded-full px-4 py-1.5 transition-colors duration-200 cursor-pointer"
    >
      Join Voxel
    </button>
  )
}
