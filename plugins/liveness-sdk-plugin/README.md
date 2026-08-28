# Liveness SDK Skills Plugin (liveness-sdk-plugin)

An agent skills plugin for Antigravity / Gemini CLI and AI coding assistants. This plugin equips AI agents with the knowledge, procedural workflows, code templates, and validation rules required to implement, integrate, and verify the Liveness SDK (@liveness/sdk) and Biometric Face Verification in web applications.

---

## What is Included

```text
liveness-sdk-plugin/
├── plugin.json                 # Antigravity plugin manifest
├── gemini-extension.json       # Gemini extension manifest
├── rules/
│   └── AGENTS.md               # Strict architectural guidelines and privacy constraints
├── skills/
│   └── liveness-sdk-integration/
│       ├── SKILL.md            # Primary agent runbook and workflow guide
│       ├── references/
│       │   ├── sdk-api-reference.md             # Complete JS/TS API documentation
│       │   ├── backend-api-and-webhooks.md      # REST API and HMAC signature verification
│       │   ├── model-assets-guide.md            # WASM/model hosting and basePath setup
│       │   └── troubleshooting-and-edgecases.md # Lighting, Safari quirks, CSP fixes
│       ├── examples/
│       │   ├── react-use-liveness-hook.tsx      # Production React custom hook
│       │   ├── react-liveness-modal.tsx         # Clean Tailwind CSS verification dialog
│       │   ├── vanilla-html-js.html             # Zero-dependency vanilla JS demo
│       │   ├── backend-verification-node.js     # Express API and webhook receiver
│       │   └── nextjs-api-route.ts              # Next.js App Router verification route
│       └── scripts/
│           └── copy-liveness-assets.js          # CLI tool to copy model assets into public/
```

---

## Installation and Usage

### Method 1: Workspace Installation (Project-Specific)

Place the plugin in your project's `.agents/plugins/` directory:

```bash
mkdir -p .agents/plugins
cp -r /path/to/liveness-sdk-plugin .agents/plugins/
```

Antigravity automatically discovers and activates all skills and rules in `.agents/`.

### Method 2: Global Installation (All Projects on Machine)

Install the plugin into your global configuration:

```bash
mkdir -p ~/.gemini/config/plugins/
cp -r /path/to/liveness-sdk-plugin ~/.gemini/config/plugins/
```

### Method 3: Using in Other AI Assistants (Claude Code, Cursor, Windsurf)

- Cursor / Windsurf: Add `rules/AGENTS.md` to `.cursorrules` or `.windsurfrules`.
- Claude Code: Add `rules/AGENTS.md` to `CLAUDE.md`.

---

## Included Assets Helper Script

To automatically copy the required MediaPipe Face Mesh and MobileNet V2 model assets to your web app's `public/` directory:

```bash
node .agents/plugins/liveness-sdk-plugin/skills/liveness-sdk-integration/scripts/copy-liveness-assets.js ./public
```

---

## How AI Agents Use This Skill

When a user prompts the AI agent with requests such as:

- "Add liveness detection to our React login form"
- "Integrate @liveness/sdk into our Next.js onboarding"
- "How do I verify the webhook signature for liveness events?"
- "Help me fix a camera permission or poor lighting issue with the liveness SDK"

The agent automatically activates the `liveness-sdk-integration` skill, loads the relevant API references and code examples via progressive disclosure, and generates robust integration code matching the actual Liveness SDK implementation.
