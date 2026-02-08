# handoff guide for dima

## what's happening here

ilia and claude have been building your dj portfolio site (mtmrfoz) together. they completed phases 0-3: test infrastructure, dark theme, the 3d plasma sphere with custom GLSL shaders, and the landing-to-content transition. the whole conversation (all the debugging, decisions, learnings) is saved as a file called `conversation.jsonl` in the `handoff/` folder.

the goal: get that exact conversation running on your windows machine so you can pick up right where ilia left off. same claude, same context, same memory of all the bugs we hit and how we fixed them.

## how this works

claude code stores conversations as `.jsonl` files in a specific folder on your machine. if we put the conversation file in the right place, you can resume it with `--resume` and claude will have full memory of everything that happened - every file we created, every bug we debugged, every decision we made.

you'll start a fresh claude instance, give it the setup guide, and it will figure out exactly where to put everything on your windows machine. then you exit, resume the old conversation, and you're in.

## steps

### 0. set up github access

you need git and github CLI installed. if you don't have them:

```powershell
# install git (if not already installed)
winget install Git.Git

# install github CLI
winget install GitHub.cli
```

then authenticate with github:

```powershell
gh auth login
```

it will ask you a few questions:
- where do you use github? → `GitHub.com`
- preferred protocol? → `HTTPS`
- authenticate with? → `Login with a web browser`

it'll give you a code, open a browser, you paste the code, done. after that git and gh commands work with this repo.

### 1. clone the repo and checkout the branch

```powershell
git clone https://github.com/dshakho/dj-portfolio.git
cd dj-portfolio
git checkout feat/phases-1-3
npm install
```

### 2. install MCP servers

these are crucial - claude uses them constantly during development.

**context7** (library docs - claude uses this instead of web search for technical docs):
```powershell
npm install -g @anthropic-ai/context7
```

**serena** (symbolic code editing - claude uses this to navigate and understand codebases):
```powershell
pip install uv
```

**playwright** (browser testing - claude takes screenshots and interacts with the UI):
check if already configured in claude code. if not:
```powershell
npx @anthropic-ai/mcp-playwright
```

**eslint** (code quality - claude runs this after changes):
check if already configured. if not:
```powershell
npx @anthropic-ai/mcp-eslint
```

### 3. start claude code in the project directory

```powershell
claude
```

### 4. tell the fresh claude what to do

paste this message:

```
read the file handoff/SETUP_GUIDE.md and follow it step by step.
it has instructions for you (claude) on how to set up this machine
with the conversation history and config files from a previous session
on another machine. start with step 1 (the conversation history) -
that's the most important part.
```

claude will:
- figure out where your project's conversation folder is on windows
- copy the conversation file there
- copy the global config, memory, plan, and settings files to the right places
- tell you to exit and resume the old conversation

### 5. resume the conversation

after claude finishes setup, exit (`ctrl+c` or type `/exit`) and run:

```powershell
claude --resume 0d94a9e0-427a-4ed3-8fc5-94c2fb04188c
```

that's it. you'll be in the same conversation with full context. from there you can continue with phase 4 or fix the remaining polish issues.

## if --resume doesn't work

if for any reason the conversation can't be resumed, just start fresh. claude will still have:
- the project `CLAUDE.md` (in the repo root) with all project rules
- the `MEMORY.md` (in `handoff/`) with learnings from phases 0-3
- the full codebase with 13 passing tests
- the implementation plan

it won't remember the specific back-and-forth, but it'll have enough context to keep building.
