# dj-portfolio handoff - setup guide for dima (windows)

hey claude. dima is setting up this project on his windows machine, transferred from ilia's mac. your #1 job right now is to get the conversation history working so dima can resume the previous session.

## what's in the handoff/ folder

- `conversation.jsonl` - FULL conversation history from phases 0-3 + bug fixes (11MB). this is the most important file - it contains all context from the previous session
- `GLOBAL_CLAUDE.md` - goes to `%USERPROFILE%\.claude\CLAUDE.md`
- `MEMORY.md` - goes to the project's memory folder (see below)
- `PLAN.md` - goes to `%USERPROFILE%\.claude\plans\crystalline-petting-avalanche.md`
- `settings.json` - goes to `%USERPROFILE%\.claude\settings.json`
- `settings.local.json` - goes to `%USERPROFILE%\.claude\settings.local.json` (MCP server configs)

## step 1: restore conversation history (DO THIS FIRST)

the conversation ID is: `0d94a9e0-427a-4ed3-8fc5-94c2fb04188c`

claude code stores conversations in: `%USERPROFILE%\.claude\projects\<path-hash>\`

where `<path-hash>` is the project's absolute path with separators replaced by dashes.

**claude, here's what you need to do:**

1. figure out the current project's absolute path (run `pwd` or `cd`)
2. look in `%USERPROFILE%\.claude\projects\` to find which folder corresponds to this project. if none exists yet, you can determine the hash: take the absolute path, replace all `\` and `/` with `-`, prepend with `-`. e.g. `C:\Users\dima\code\dj-portfolio` becomes `-C-Users-dima-code-dj-portfolio`
3. create the folder if it doesn't exist
4. copy `handoff/conversation.jsonl` to that folder as `0d94a9e0-427a-4ed3-8fc5-94c2fb04188c.jsonl`
5. tell dima to exit and run: `claude --resume 0d94a9e0-427a-4ed3-8fc5-94c2fb04188c`

if the path hash format is different on windows, just check what folders already exist in `%USERPROFILE%\.claude\projects\` after running claude once in this project directory - that will tell you the exact format.

## step 2: install config files

run these (adjust paths if needed):

```powershell
# global claude instructions
copy handoff\GLOBAL_CLAUDE.md $env:USERPROFILE\.claude\CLAUDE.md

# settings
copy handoff\settings.json $env:USERPROFILE\.claude\settings.json
copy handoff\settings.local.json $env:USERPROFILE\.claude\settings.local.json

# plan
mkdir $env:USERPROFILE\.claude\plans -ErrorAction SilentlyContinue
copy handoff\PLAN.md $env:USERPROFILE\.claude\plans\crystalline-petting-avalanche.md

# memory (use the project path hash from step 1)
mkdir $env:USERPROFILE\.claude\projects\<path-hash>\memory -ErrorAction SilentlyContinue
copy handoff\MEMORY.md $env:USERPROFILE\.claude\projects\<path-hash>\memory\MEMORY.md
```

**claude: replace `<path-hash>` with the actual hash you found in step 1.**

## step 3: install MCP servers

### context7 (library docs)
```powershell
npm install -g @anthropic-ai/context7
```

### serena (symbolic code editing)
needs python + uv:
```powershell
pip install uv
```
the MCP config in settings.local.json already has the serena command. if `uvx` doesn't work on windows, try `pipx` instead.

### playwright + eslint
these should be auto-configured as MCPs in claude code. if not, check the claude code docs.

## step 4: project setup

```powershell
git clone <repo-url>
cd dj-portfolio
git checkout feat/phases-1-3
npm install
npx playwright install chromium
```

verify:
```powershell
npx vitest run        # 13 tests should pass
npx next build        # should build clean
npx next dev -p 3000  # sphere at localhost:3000
```

## step 5: clean up settings.local.json

the settings.local.json has some stuff from ilia's machine that dima doesn't need:
- `AbletonMCP` server config - can remove unless dima uses ableton
- `Bash(./convert_jvc.sh:*)` permission - ilia's other project, remove it

the relevant MCP servers to keep: `serena`, `context7`

## current project state

- **branch**: `feat/phases-1-3` (4 commits ahead of main)
- **phases 0-3 complete**: test infra, dark theme + footer, 3d sphere with GLSL shaders, landing-to-content transition
- **13 unit tests passing**
- **sphere**: custom plasma/lightning shaders (purple/green/blue/pink), morphing icosahedron

### known issues
- sphere cropped in content state (CSS transform scale workaround, not perfect on resize)
- resize responsiveness: sphere gets smaller than intended on narrow viewports
- mobile: sphere centering and text spacing slightly off
- click handled by wrapper div (r3f mesh click was removed to prevent explosion hiding sphere)

### what's next
- fix resize/mobile polish issues
- phase 4: navigation + sections (events, about, music) with TDD
- commit frequently in small chunks
- stop after phase 4, review prototype

## potential windows issues

- `Intl.DateTimeFormat` timezone: tests handle both "CET" and "GMT+1"
- vitest + jsdom: works on windows
- r3f/three.js: pure JS, no platform issues
- playwright chromium: `npx playwright install chromium` handles windows paths
