import BackgroundGrid from '@/components/BackgroundGrid'
import HeroSection from '@/components/HeroSection'
import IndustryGap from '@/components/IndustryGap'
import VoxelIntelligence from '@/components/VoxelIntelligence'
import AgencyBridge from '@/components/AgencyBridge'
import ArchitectsAdvantage from '@/components/ArchitectsAdvantage'
import FreemiumInsights from '@/components/FreemiumInsights'
import WaitlistForm from '@/components/WaitlistForm'
import JourneyShell from '@/components/JourneyShell'
import ScrollToWaitlist from '@/components/ScrollToWaitlist'
import BlockBurstLayer from '@/components/BlockBurstLayer'
import { BlockBurstProvider } from '@/context/BlockBurstContext'

export default function Home() {
  return (
    <BlockBurstProvider>
      <BackgroundGrid />
      <BlockBurstLayer />

      <JourneyShell>
        <div className="relative bg-[#0A0A0C]" style={{ zIndex: 10 }}>
          <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-[#0A0A0C]/80 backdrop-blur-md">
            <div className="flex w-full items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2.5" aria-label="Voxel wordmark">
                <div
                  className="w-6 h-6 border border-white/40 rotate-45 sm:w-7 sm:h-7"
                  aria-hidden="true"
                  style={{ boxShadow: '0 0 10px rgba(255,255,255,0.2)' }}
                />
                <span className="font-mono text-base font-semibold tracking-widest text-white uppercase sm:text-lg">
                  Voxel
                </span>
              </div>
              <nav aria-label="Primary navigation">
                <ScrollToWaitlist />
              </nav>
            </div>
          </header>

          <main className="bg-[#0A0A0C]">
            <HeroSection />
            <IndustryGap />
            <VoxelIntelligence />
            <AgencyBridge />
            <ArchitectsAdvantage />
            <FreemiumInsights />
            <WaitlistForm id="waitlist" />
          </main>

          <footer
            className="border-t border-white/[0.05] px-6 py-8 text-center bg-[#0A0A0C]"
            aria-label="Site footer"
          >
            <p className="text-xs font-mono text-zinc-600 tracking-widest uppercase">
              © {new Date().getFullYear()} Voxel · The Minecraft Data Terminal ·{' '}
              <span className="text-green-400">●</span> Private Beta
            </p>
          </footer>
        </div>
      </JourneyShell>
    </BlockBurstProvider>
  )
}
