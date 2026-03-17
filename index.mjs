import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/**
 * Raw TextMate grammar for the claude-code language.
 * Use with Shiki's `langs` option or Expressive Code's `shiki.langs`.
 */
export const grammar = require('./grammar.json')

export default grammar

export { getTokenOverrides } from './theme-overrides.mjs'
