'use client'

export default function ScrollToWaitlist() {
  const scroll = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={scroll}
      aria-label="Navigate to waitlist signup section"
      className="join-voxel-btn group relative isolate cursor-pointer overflow-hidden rounded-full border border-white/[0.09] px-5 py-2 font-mono text-sm text-zinc-400 transition-[border-color,box-shadow] duration-300 hover:border-green-400/35 hover:shadow-[0_0_20px_rgba(74,222,128,0.12)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="join-voxel-liquid absolute bottom-0 left-0 right-0 z-0 h-0 overflow-visible bg-gradient-to-t from-green-600 via-green-500 to-green-400 transition-[height] duration-[5000ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:h-full">
          <span className="join-voxel-wave join-voxel-wave-1 absolute -top-5 left-[-30%] h-9 w-[160%] rounded-[42%] bg-green-400/95" />
          <span className="join-voxel-wave join-voxel-wave-2 absolute -top-4 left-[-22%] h-7 w-[145%] rounded-[48%] bg-green-300/80" />
          <span className="join-voxel-wave join-voxel-wave-3 absolute top-2 left-[-18%] h-4 w-[136%] rounded-[50%] bg-green-200/25" />
        </span>
      </span>
      <span className="relative z-10 transition-colors duration-[5000ms] ease-linear group-hover:text-[#0A0A0C]">
        Join Voxel
      </span>
    </button>
  )
}
