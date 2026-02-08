# dj-portfolio project memory

## key learnings

- **playwright + webgl:** first screenshot of r3f canvas was black because `preserveDrawingBuffer` wasn't set in gl config. always add `preserveDrawingBuffer: true` for screenshot debugging.
- **next.js 16 + ssr: false:** `dynamic()` with `ssr: false` can't be used in server components. use `'use client'` + mounted state check pattern instead.
- **vitest + fake timers + userEvent:** `userEvent.setup({ advanceTimers })` with `vi.useFakeTimers()` causes deadlocks on click events. use `fireEvent.click()` instead for click tests with fake timers.
- **jsdom timezone:** `Intl.DateTimeFormat` with `timeZoneName: 'short'` returns "GMT+1" in jsdom instead of "CET". test regex needs to match both formats.
- **r3f in vitest:** mock `@react-three/fiber` Canvas as a div with data-testid. r3f lowercase JSX elements (mesh, shaderMaterial, etc.) cause React warnings in jsdom but tests still pass.
- **motion/react mocking:** need to mock both `motion.div` and `motion.p` (and any other elements used). filter out motion-specific props before passing to HTML elements.
- **eslint-config-next:** has a known compatibility issue with `react/display-name` rule - `contextOrFilename.getFilename is not a function`. pre-existing, not our bug.

## project state

- phases 0-3 complete on `feat/phases-1-3` branch
- 12 unit tests passing (footer, sphere canvas, portfolio shell)
- sphere renders with custom GLSL shaders (plasma colors, fresnel, lightning, noise morphing)
- landing → content auto-transition at 3.5s working
- stop point: show prototype to dima before proceeding to phase 4
