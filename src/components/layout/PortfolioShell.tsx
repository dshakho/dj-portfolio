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

  const isLanding = view === 'landing'

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className={`flex shrink-0 flex-col items-center ${isLanding ? 'flex-1 justify-center' : 'pt-4'}`}>
        <motion.div
          layout
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="cursor-pointer"
          style={{
            width: isLanding ? 'min(50vw, 400px)' : '100px',
            height: isLanding ? 'min(50vw, 400px)' : '100px',
          }}
          onClick={transitionToContent}
        >
          {mounted && <SphereCanvas />}
        </motion.div>

        <AnimatePresence mode="wait">
          {isLanding ? (
            <motion.p
              key="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 font-serif text-3xl lowercase tracking-widest text-neutral-300"
            >
              mtmrfoz
            </motion.p>
          ) : (
            <motion.nav
              key="nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-2 flex gap-6 text-sm lowercase tracking-wider text-neutral-400"
            >
              <button className="transition-colors hover:text-neutral-100">
                events
              </button>
              <button className="transition-colors hover:text-neutral-100">
                about
              </button>
              <button className="transition-colors hover:text-neutral-100">
                music
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {!isLanding && (
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
      )}
      <Footer />
    </div>
  )
}
