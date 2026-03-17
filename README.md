# claude-code-lang

A [TextMate grammar](https://macromates.com/manual/en/language_grammars) for syntax highlighting [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI terminal output. Works with [Shiki](https://shiki.style), [Expressive Code](https://expressive-code.com), and any TextMate-compatible highlighter.

> **Alpha** — API may change between releases.

## Quick start

### Expressive Code plugin (recommended)

The plugin registers the grammar, injects theme token overrides, and renders a custom Claude Code frame with the Clawd mascot header.

```js
// astro.config.mjs
import expressiveCode from 'astro-expressive-code'
import claudeCodePlugin, { grammar, getTokenOverrides } from 'claude-code-lang/plugin'

// Add claude-code token overrides to your theme
myTheme.tokenColors.push(...getTokenOverrides())

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: [myTheme],
      plugins: [claudeCodePlugin()],
      shiki: { langs: [grammar] },
    }),
  ],
})
```

Then use `claude-code` as the language in fenced code blocks:

````md
```claude-code
❯ What files are in this project?

  ✻ Reading src/index.ts

  Here are the files in this project:
  - src/index.ts
  - package.json
```
````

The frame header renders like the real Claude Code CLI:

```
 ▐▛███▜▌   Claude Code vCode Sample
▝▜█████▛▘  [Model] · [Plan]
  ▘▘ ▝▝    ~/myProject
```

#### Plugin options

```js
claudeCodePlugin({
  showHeader: true,              // default — set false to hide the frame header
  line2: '[Model] · [Plan]',     // default — second line of header
  line3: '~/myProject',          // default — third line of header
  colors: {
    diffAdd: '#6BD968',          // default — green for added lines
    diffRemove: '#F87171',       // default — red for removed lines
  },
})
```

#### Per-block overrides

Override header lines on individual code blocks via meta props:

````md
```claude-code line2="Opus 4.6 · Claude Max" line3="~/Code/my-project"
❯ /plan implement auth
```

```claude-code showHeader=false
❯ /help
```
````

### Plain Shiki (grammar only)

```js
import { createHighlighter } from 'shiki'
import claudeCodeGrammar from 'claude-code-lang'

const highlighter = await createHighlighter({
  langs: [claudeCodeGrammar],
  themes: ['github-dark'],
})

const html = highlighter.codeToHtml(code, {
  lang: 'claude-code',
  theme: 'github-dark',
})
```

## Token overrides

`getTokenOverrides(options?)` returns an array of TextMate token color rules for claude-code scopes. These ensure correct rendering (non-italic status lines, bold tool names, diff colors).

The overrides intentionally do **not** set foreground colors for most scopes, so they inherit from your theme. Only diff colors are set explicitly.

## What gets highlighted

| Element | Example | Scope |
|---|---|---|
| Prompt character | `❯`, `>` | `keyword.operator.prompt.claude-code` |
| Slash commands | `/help`, `/compact` | `entity.name.function.command.claude-code` |
| Tool names | `Read`, `Edit`, `Bash` | `entity.name.function.tool.claude-code` |
| Active status | `✻ Reading...` | `keyword.control.status-active.claude-code` |
| Done status | `✻ Brewed for 30s` | `comment.status-done.claude-code` |
| Diff additions | `+  new line` | `markup.inserted.diff-content.claude-code` |
| Diff removals | `-  old line` | `markup.deleted.diff-content.claude-code` |
| Mode indicators | `plan`, `act` | `constant.numeric.mode.claude-code` |
| Keyboard shortcuts | `Shift+Tab`, `Esc+Esc` | `keyword.control.shortcut.claude-code` |
| File paths | `src/index.ts` | `string.unquoted.path.claude-code` |
| Quoted strings | `"hello world"` | `string.quoted.double.claude-code` |
| Comments / rules | `# comment`, `───` | `comment.line.claude-code` |

## License

MIT
