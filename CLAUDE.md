# mtmrfoz - dj portfolio

## project overview

dark, minimal, experimental dj portfolio for mtmrfoz (dima). single-page site with no vertical scrolling. the centerpiece is an interactive 3d morphing sphere with plasma/lightning effects (purple/green/blue/pink) that serves as both the visual identity and navigation trigger.

## design concept

- **landing state:** full screen, black bg, centered morphing plasma sphere, "mtmrfoz" in cormorant garamond below. auto-transitions to content after 3.5s or on click.
- **content state:** sphere shrinks to top-center (still animated), nav links appear beside it, sections render below, footer always visible.
- **no vertical page scrolling** - everything fits viewport. sections have internal scroll if needed.
- **sections:** events (upcoming/past grid), about (photo + bio + social links), music (platform links)
- **footer:** "2026, all rights reserved" | berlin | CET/CEST

## tech stack

- next.js 16, react 19, typescript, tailwind v4
- three.js + react-three-fiber v9 + drei (3d sphere)
- motion (animations/transitions)
- cormorant garamond (google font, all lowercase, serif minimal)
- vitest + react testing library (unit tests)
- playwright (e2e tests)

## implementation plan

full plan at: `~/.claude/plans/crystalline-petting-avalanche.md`

phases:
0. test infrastructure setup
1. foundation (dark theme, font, footer)
2. the sphere (shaders, morphing, explosion/reconstruction)
3. landing + transition (state machine, auto-transition, sphere shrink) **<-- STOP HERE, show prototype to dima**
4. navigation + sections (events, about, music)
5. e2e + polish

## development rules

- **strict TDD:** write failing tests FIRST, then implement. never both in same step. red > green > refactor.
- **commit after each phase** when all tests pass
- **use subagents** for: researching unfamiliar apis (context7 for r3f/drei/motion), exploring codebase (explore agent), parallel tasks
- **use serena** symbolic tools for navigating existing components
- **use context7** for react-three-fiber and motion docs
- **use playwright browser_snapshot** to verify visual changes
- **use eslint** after significant changes
- **no vertical scroll** - overflow hidden on body, sections scroll internally

## sphere details

- icosahedron geometry with custom glsl shaders (vertex + fragment)
- simplex noise displacement for morphing
- 4-color palette: purple (#8b5cf6), green (#10b981), blue (#3b82f6), pink (#ec4899)
- fresnel edge glow + lightning lines via noise threshold
- on click: deconstructs into particles, then reconstructs (Points system with lerp)
- must run at 60fps

## key decisions already made

- sphere position in content state: top-center
- hero photo: in about section (not on landing)
- font: cormorant garamond
- no-scroll: ball IS the navigation, sections appear below shrunken ball
- co-authored-by attribution: disabled globally
