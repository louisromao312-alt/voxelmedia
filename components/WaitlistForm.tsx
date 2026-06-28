'use client'

import { useRef, useState, useId, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import WaitlistBlockBg from '@/components/WaitlistBlockBg'
import SectionReveal, { EASE } from '@/components/SectionReveal'
import { useUserJourney } from '@/context/UserJourneyContext'

type FormState = 'idle' | 'loading' | 'success'

export default function WaitlistForm({ id }: { id?: string }) {
  const { role: journeyRole } = useUserJourney()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')
  const formId = useId()
  const emailId = `${formId}-email`
  const roleId = `${formId}-role`
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (journeyRole === 'creator') setRole('studio')
    if (journeyRole === 'brand') setRole('brand')
  }, [journeyRole])

  const validate = () => {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Enter a valid email address.'
    if (!role) return 'Please select your role.'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      inputRef.current?.focus()
      return
    }
    setError('')
    setState('loading')
    await new Promise(r => setTimeout(r, 1100))
    setState('success')
  }

  return (
    <SectionReveal
      id={id}
      className="relative px-4 py-24 md:py-32 bg-[#0A0A0C] overflow-hidden"
      aria-labelledby="waitlist-heading"
    >
      <WaitlistBlockBg />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Early Access
          </p>
          <h2
            id="waitlist-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3"
          >
            Join the insider list.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
            First-wave members get lifetime pricing, priority terminal access,
            and exclusive market intelligence reports.
          </p>
        </div>

        {/* Large form container */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 backdrop-blur-sm">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="flex flex-col items-center gap-5 text-center py-4"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    layoutId="waitlist-submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-semibold text-white bg-green-500"
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <CheckCircle size={20} aria-hidden="true" />
                    You&apos;re on the list.
                  </motion.div>
                  <p className="text-zinc-400 text-sm max-w-sm">
                    Access credentials will be sent to{' '}
                    <span className="text-white font-mono">{email}</span> at
                    launch.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Voxel waitlist signup form"
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={emailId}
                      className="text-xs font-mono text-zinc-500 uppercase tracking-wider"
                    >
                      Work Email
                    </label>
                    <input
                      ref={inputRef}
                      id={emailId}
                      type="email"
                      autoComplete="email"
                      placeholder="you@studio.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        if (error) setError('')
                      }}
                      required
                      aria-required="true"
                      aria-describedby={error ? `${formId}-error` : undefined}
                      aria-invalid={!!error}
                      disabled={state === 'loading'}
                      className="w-full rounded-lg border border-white/[0.09] bg-[#0A0A0C] px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={roleId}
                      className="text-xs font-mono text-zinc-500 uppercase tracking-wider"
                    >
                      I represent a…
                    </label>
                    <div className="relative">
                      <select
                        id={roleId}
                        value={role}
                        onChange={e => {
                          setRole(e.target.value)
                          if (error) setError('')
                        }}
                        required
                        aria-required="true"
                        disabled={state === 'loading'}
                        className="w-full appearance-none rounded-lg border border-white/[0.09] bg-[#0A0A0C] px-4 py-3.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors disabled:opacity-50 cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" disabled className="bg-[#0A0A0C] text-zinc-500">
                          Select your role
                        </option>
                        <option value="studio" className="bg-[#0A0A0C] text-white">
                          Studio
                        </option>
                        <option value="brand" className="bg-[#0A0A0C] text-white">
                          Brand
                        </option>
                        <option value="agency" className="bg-[#0A0A0C] text-white">
                          Agency
                        </option>
                      </select>
                      <div
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        aria-hidden="true"
                      >
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        id={`${formId}-error`}
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-400 font-mono overflow-hidden"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    layoutId="waitlist-submit"
                    type="submit"
                    disabled={state === 'loading'}
                    whileHover={state !== 'loading' ? { scale: 1.015 } : {}}
                    whileTap={state !== 'loading' ? { scale: 0.985 } : {}}
                    className="w-full flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-semibold bg-white text-black hover:bg-zinc-100 transition-colors disabled:cursor-not-allowed cursor-pointer"
                    aria-label={
                      state === 'loading'
                        ? 'Submitting your request'
                        : 'Join Voxel waitlist'
                    }
                  >
                    <AnimatePresence mode="wait">
                      {state === 'loading' ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          Securing your spot…
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          Join Voxel
                          <ArrowRight size={16} aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <p className="text-center text-xs text-zinc-600">
                    No spam. No credit card. Unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
    </SectionReveal>
  )
}
