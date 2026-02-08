# mtmrfoz dj portfolio - implementation plan

## context

building a dark, minimal, experimental dj portfolio for mtmrfoz (dima). single-page site with no vertical scrolling. the centerpiece is an interactive 3d morphing sphere with plasma/lightning effects that serves as both the visual identity and navigation trigger. built with next.js 16, react 19, tailwind v4, typescript.

## tech stack

- **3d:** three.js + react-three-fiber v9 + drei (for react 19 compat)
- **animations:** motion (framer-motion rebrand, react 19 compatible)
- **font:** cormorant garamond (google fonts via next/font)
- **styling:** tailwind v4 + custom css
- **testing:** vitest + react testing library + playwright (e2e)

## dependencies to install

```bash
npm install three @react-three/fiber @react-three/drei motion
npm install -D @types/three vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright @playwright/test
```

## tdd approach (strict red-green-refactor)

every component follows this cycle:

1. **red:** write a failing test that describes the expected behavior
2. **green:** write the minimum implementation to make the test pass
3. **refactor:** clean up the code while keeping tests green

tests are written BEFORE implementation, never in the same step. each phase has its own test files that must pass before moving to the next phase.

### test structure
```
src/
  __tests__/
    components/
      Footer.test.tsx
      Navigation.test.tsx
      PortfolioShell.test.tsx
      EventsSection.test.tsx
      AboutSection.test.tsx
      MusicSection.test.tsx
    sphere/
      SphereCanvas.test.tsx
  e2e/
    landing.spec.ts           -- playwright: landing state, auto-transition
    navigation.spec.ts        -- playwright: section switching, no scroll
    sphere-interaction.spec.ts -- playwright: click sphere, visual check
```

### what to test per component
- **Footer:** renders year, "all rights reserved", "berlin", timezone string
- **Navigation:** renders 3 links, click triggers callback, active state shown
- **PortfolioShell:** starts in landing state, transitions to content after timeout, sphere click triggers early transition
- **EventsSection:** renders event cards, shows upcoming/past groups, newest first
- **AboutSection:** renders bio text, renders all social links with correct hrefs
- **MusicSection:** renders music platform links
- **SphereCanvas:** mounts without error, canvas element exists (r3f rendering is hard to unit test - use playwright for visual verification)

## file structure

```
src/
  app/
    layout.tsx              -- modify: cormorant garamond, dark bg, metadata
    page.tsx                -- modify: render PortfolioShell
    globals.css             -- modify: dark theme, overflow hidden, 100dvh
  components/
    sphere/
      Sphere.tsx            -- 3d sphere mesh with custom glsl shaders
      SphereCanvas.tsx      -- r3f canvas wrapper ("use client")
      shaders/
        vertex.glsl.ts      -- vertex shader (noise displacement)
        fragment.glsl.ts    -- fragment shader (plasma colors, lightning, fresnel)
      useExplosion.ts       -- particle deconstruct/reconstruct hook
    layout/
      PortfolioShell.tsx    -- main state machine ("use client")
      Navigation.tsx        -- section nav links
      Footer.tsx            -- copyright + berlin + timezone
    sections/
      EventsSection.tsx     -- events grid
      AboutSection.tsx      -- bio + social links
      MusicSection.tsx      -- music platform links
  lib/
    noise.ts                -- simplex noise glsl function string
  __tests__/                -- unit/integration tests (see above)
  e2e/                      -- playwright e2e tests
next.config.ts              -- add transpilePackages: ['three']
vitest.config.ts            -- vitest setup
playwright.config.ts        -- playwright setup
```

## implementation phases

### phase 0 - test infrastructure

0a. set up vitest config (vitest.config.ts, setup file for testing-library)
0b. set up playwright config
0c. verify test runner works with a trivial test

**verify:** `npx vitest run` and `npx playwright test` both execute without config errors

### phase 1 - foundation

**tests first:**
1a. write `Footer.test.tsx` - test that footer renders "2026", "all rights reserved", "berlin", and a timezone string

**then implement:**
1b. update `next.config.ts` - add `transpilePackages: ['three']`
1c. update `layout.tsx` - replace geist with cormorant garamond, set title to "mtmrfoz", force dark
1d. update `globals.css` - black bg (#000), light foreground (#e0e0e0), `overflow: hidden`, `height: 100dvh`, remove light mode media query
1e. create `Footer.tsx` - "2026, all rights reserved" | berlin | CET/CEST (via Intl.DateTimeFormat)

**verify:** tests pass + dev server shows black page, correct font, footer at bottom

### phase 2 - the sphere

**tests first:**
2a. write `SphereCanvas.test.tsx` - test that canvas mounts, renders a canvas element

**then implement:**
2b. create `lib/noise.ts` - 3d simplex noise glsl function as string constant
2c. create `shaders/vertex.glsl.ts` - noise-based vertex displacement with uniforms (uTime, uNoiseScale, uDisplacement)
2d. create `shaders/fragment.glsl.ts` - plasma color mixing (purple/green/blue/pink), fresnel edge glow, lightning lines via noise threshold
2e. create `Sphere.tsx` - icosahedron geometry (detail 64), custom ShaderMaterial, useFrame for time updates, click handler
2f. create `useExplosion.ts` - captures vertex positions, creates Points system, animates scatter/reconstruct with damping
2g. create `SphereCanvas.tsx` - "use client", r3f Canvas with transparent bg, camera at [0,0,3], dpr capped at [1,2]

**verify:** tests pass + sphere renders centered, morphs smoothly, colors shift, 60fps (browser devtools performance check), click triggers explosion + reconstruction. use playwright browser_snapshot for visual verification.

### phase 3 - landing + transition

**tests first:**
3a. write `PortfolioShell.test.tsx` - test landing state renders, test transition triggers after timeout, test click triggers early transition, test content state shows nav

**then implement:**
3b. create `PortfolioShell.tsx` - state machine with 'landing' | 'content' view states + activeSection state
    - landing: sphere centered large, "mtmrfoz" below
    - auto-transition after 3.5s or on click
    - content: sphere shrinks to top-center, sections appear below
    - uses motion for layout animations
3c. update `page.tsx` - just renders `<PortfolioShell />`

**verify:** tests pass + landing shows centered sphere + name, auto-transitions after 3.5s, sphere smoothly shrinks to top-center

### phase 4 - navigation + sections

**tests first:**
4a. write `Navigation.test.tsx` - test renders 3 links, test click handler called with correct section name, test active state
4b. write `EventsSection.test.tsx` - test renders events, test upcoming/past grouping, test newest first ordering
4c. write `AboutSection.test.tsx` - test renders bio text, test all social links present with correct hrefs
4d. write `MusicSection.test.tsx` - test renders music platform links

**then implement:**
4e. create `Navigation.tsx` - text links (events / about / music) next to shrunken sphere at top-center, lowercase, subtle hover
4f. create `EventsSection.tsx` - grid of event cards (square, placeholder image, name + date), "upcoming" and "past" groups, internal scroll if overflow
4g. create `AboutSection.tsx` - rectangular photo of dima (placeholder) next to bio text (same height), lorem ipsum paragraph, social link row below (insta, soundcloud, bandcamp, gmail, RA, facebook)
4h. create `MusicSection.tsx` - links/cards to music platforms (soundcloud, bandcamp, etc.)

**verify:** all tests pass + nav switches sections, no page scroll, internal scroll works for events, footer always visible. playwright e2e tests for full flow.

### phase 5 - e2e + polish

5a. write and run playwright e2e tests for full user flow (landing > transition > navigate sections)
5b. responsive testing at 320px, 768px, 1024px, 1440px
5c. performance check - 60fps on sphere animation
5d. eslint pass
5e. `npm run build` - clean build with no errors

## layout architecture (no vertical scroll)

```
[100dvh flex column, overflow hidden]
  |-- header (flex-shrink-0)
  |     shrunken sphere (top-center) + "mtmrfoz" + nav links
  |-- content (flex-1, overflow-y-auto for internal scroll)
  |     active section with motion enter/exit
  |-- footer (flex-shrink-0, ~40px)
  |     2026, all rights reserved | berlin | CET
```

landing state: header takes full viewport, sphere centered, "mtmrfoz" below, footer at absolute bottom.
content state: sphere shrinks to top-center as a logo, nav links positioned below or beside it. no hero photo on landing - photo goes in about section as a rectangular image next to the bio text.

## sphere shader architecture

**vertex shader:**
- simplex noise displacement along normals
- uniforms: uTime, uNoiseScale (~1.5), uDisplacement (~0.3)
- pass vDisplacement, vNormal, vPosition to fragment

**fragment shader:**
- 4-color palette mixing based on displacement + normals + time
- fresnel edge glow for plasma feel
- lightning: high-frequency noise threshold creates bright lines
- semi-transparent output for glow blending

**explosion system:**
- on click: capture vertex positions, create Points geometry
- animate outward along normals + random velocity, damping 0.97
- after 1.5s: lerp back to original positions
- mesh hidden during explosion, points shown, then swap back

## gotchas to handle

- r3f canvas must be "use client" + possibly dynamic import with ssr: false
- glsl shaders as template literal strings in .ts files (no loader needed)
- sphere scale transition via r3f scale prop, not canvas resize
- 100dvh instead of 100vh for mobile browser address bar
- mobile: reduce icosahedron detail to 32, fewer particles
- vitest needs jsdom environment for react component tests
- r3f components need canvas context in tests - mock or use a test canvas wrapper
- playwright tests need dev server running

## subagent usage

use subagents when:
- researching unfamiliar apis (context7 for r3f/drei/motion docs)
- exploring codebase after multiple files exist (explore agent)
- running parallel independent tasks (e.g., lint + test simultaneously)
- complex debugging that requires deep investigation

## stop point

stop after phase 3 is complete and all tests pass. show dima the working prototype before continuing to phase 4.

## handoff notes

**plan file location:** `~/.claude/plans/crystalline-petting-avalanche.md`

**important:** after plan approval, a `CLAUDE.md` will be created in the project root (`dj-portfolio/CLAUDE.md`) with all project context. this is what gives a new session full context automatically.

if continuing this project in a new session:
1. open claude code from the `dj-portfolio` directory (it will auto-read CLAUDE.md)
2. read this plan file at the path above
3. check which phase was last completed (`git log` + run tests to see current state)
4. always run existing tests before making changes
5. follow TDD strictly - failing test first, then implementation
6. use serena's symbolic tools for navigating existing components
7. use context7 for react-three-fiber and motion docs when unsure about apis
8. use playwright browser_snapshot to verify visual changes
9. commit after each phase is complete and all tests pass
