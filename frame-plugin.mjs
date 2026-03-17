import { h } from '@expressive-code/core/hast'
import { getTokenOverrides } from './theme-overrides.mjs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const grammar = require('./grammar.json')

const CLAWD_ART = [
  ' \u2590\u259B\u2588\u2588\u2588\u259C\u258C',
  '\u259D\u259C\u2588\u2588\u2588\u2588\u2588\u259B\u2598',
  '  \u2598\u2598 \u259D\u259D',
]

const DEFAULTS = {
  showHeader: true,
  line2: '[Model] · [Plan]',
  line3: '~/myProject',
  diffAdd: '#6BD968',
  diffRemove: '#F87171',
}

/**
 * Expressive Code plugin that registers the claude-code language grammar,
 * injects theme token overrides, and renders a custom Claude Code frame
 * with the Clawd mascot header.
 *
 * @param {object} [options]
 * @param {boolean} [options.showHeader=true] Show the Clawd header above code blocks
 * @param {string} [options.line2='[Model] · [Plan]'] Second line of header text
 * @param {string} [options.line3='~/myProject'] Third line of header text
 * @param {{ diffAdd?: string, diffRemove?: string }} [options.colors] Diff highlight colors
 * @returns {import('@expressive-code/core').ExpressiveCodePlugin}
 */
export default function claudeCodePlugin(options = {}) {
  const config = { ...DEFAULTS, ...options, colors: { ...DEFAULTS, ...options.colors } }
  const tokenOverrides = getTokenOverrides({ colors: config.colors })

  return {
    name: 'claude-code',
    baseStyles: `
      .claude-code-frame {
        all: unset;
        display: flex;
        flex-direction: column;
        border-radius: var(--ec-brdRad);
        border: 1px solid var(--ec-brdCol);
        box-shadow: var(--ec-frm-frameBoxShadowCssValue, none);
        overflow: hidden;
      }
      .claude-code-frame .frame {
        all: unset;
        display: block;
      }
      .claude-code-frame .frame > .header {
        display: none;
      }
      .claude-code-frame pre {
        border: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }
      .claude-code-header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0 0.625rem;
        padding: 0.875rem 1.25rem;
        background: var(--ec-codeBg);
        font-family: var(--ec-codeFontFamily, ui-monospace, monospace);
        line-height: 1.4;
        color: var(--ec-codeFg);
      }
      .claude-code-header-art {
        grid-row: 1 / 4;
        white-space: pre;
        color: #E8553A;
        line-height: 1;
        font-size: 1.15rem;
        align-self: center;
      }
      .claude-code-header-line1 strong {
        font-weight: 700;
      }
      .claude-code-header-line2,
      .claude-code-header-line3 {
        opacity: 0.6;
      }
    `,
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        if (codeBlock.language === 'claude-code') {
          codeBlock.props.frame = 'none'
        }
      },
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        if (codeBlock.language !== 'claude-code') return

        // Read optional meta overrides: ```claude-code line2="Opus 4.6" line3="~/[project]"
        const metaLine2 = codeBlock.metaOptions.getString('line2')
        const metaLine3 = codeBlock.metaOptions.getString('line3')
        const metaShowHeader = codeBlock.metaOptions.getBoolean('showHeader')

        const showHeader = metaShowHeader ?? config.showHeader
        const line2 = metaLine2 ?? config.line2
        const line3 = metaLine3 ?? config.line3

        if (!showHeader) {
          // Still wrap in the frame figure for consistent styling, just no header
          renderData.blockAst = h('figure', { className: ['claude-code-frame'] }, [
            renderData.blockAst,
          ])
          return
        }

        const headerChildren = [
          h('div', { className: 'claude-code-header-art' }, CLAWD_ART.join('\n')),
          h('div', { className: 'claude-code-header-line1' }, [
            h('strong', {}, 'Claude Code'),
            ' vCode Sample',
          ]),
          h('div', { className: 'claude-code-header-line2' }, line2 || '\u00A0'),
          h('div', { className: 'claude-code-header-line3' }, line3 || '\u00A0'),
        ]

        renderData.blockAst = h('figure', { className: ['claude-code-frame'] }, [
          h('div', { className: 'claude-code-header' }, headerChildren),
          renderData.blockAst,
        ])
      },
    },
  }
}

/**
 * The raw grammar and token overrides, re-exported for users who want
 * to use them without the frame plugin.
 */
export { getTokenOverrides } from './theme-overrides.mjs'
export { grammar }
