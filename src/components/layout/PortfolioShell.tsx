'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SphereCanvas } from '@/components/sphere/SphereCanvas'
import { Footer } from './Footer'

type ViewState = 'landing' | 'content'

export function PortfolioShell() {
  const [view, setView] = useState<ViewState>('landing')
  const [mounted, setMounted] = useState(false)

  const transitionToContent = useCallback(() => {
    setView('content')
  }, [])

  // ssr guard for webgl canvas
  useEffect(() => {
    setMounted(true)
  }, [])

  // auto-transition after 3.5s
  useEffect(() => {
    if (view !== 'landing') return
    const timer = setTimeout(transitionToContent, 3500)
    return () => clearTimeout(timer)
  }, [view, transitionToContent])

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {view === 'landing' ? (
        <main className="flex flex-1 flex-col items-center justify-center">
          <motion.div
            layout
            className="h-[min(50vw,400px)] w-[min(50vw,400px)]"
          >
            {mounted && <SphereCanvas onClick={transitionToContent} />}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 font-serif text-3xl lowercase tracking-widest text-neutral-300"
          >
            mtmrfoz
          </motion.p>
        </main>
      ) : (
        <>
          <header className="flex shrink-0 flex-col items-center gap-2 pt-4">
            <div className="h-[100px] w-[100px]">
              {mounted && <SphereCanvas scale={0.5} />}
            </div>
            <nav className="flex gap-6 text-sm lowercase tracking-wider text-neutral-400">
              <button className="transition-colors hover:text-neutral-100">
                events
              </button>
              <button className="transition-colors hover:text-neutral-100">
                about
              </button>
              <button className="transition-colors hover:text-neutral-100">
                music
              </button>
            </nav>
          </header>
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {/* sections will be added in phase 4 */}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}
      <Footer />
    </div>
  )
}
