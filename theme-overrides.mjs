const DEFAULTS = {
  diffAdd: '#6BD968',
  diffRemove: '#F87171',
}

/**
 * Returns token color overrides for the claude-code grammar.
 * @param {{ colors?: { diffAdd?: string, diffRemove?: string } }} [options]
 */
export function getTokenOverrides(options = {}) {
  const colors = { ...DEFAULTS, ...options.colors }

  return [
    // Keep comment-scoped lines non-italic (correct rendering, not a style preference)
    {
      scope: [
        'comment.line.claude-code',
        'comment.line.horizontal-rule.claude-code',
        'comment.status-symbol.claude-code',
        'comment.status-done.claude-code',
      ],
      settings: { fontStyle: '' },
    },
    // Bold tool names — inherits theme foreground, no hardcoded color
    {
      scope: ['entity.name.function.tool.claude-code'],
      settings: { fontStyle: 'bold' },
    },
    // Diff additions
    {
      scope: [
        'markup.inserted.diff-symbol.claude-code',
        'markup.inserted.diff-content.claude-code',
      ],
      settings: { foreground: colors.diffAdd, fontStyle: '' },
    },
    // Diff removals
    {
      scope: [
        'markup.deleted.diff-symbol.claude-code',
        'markup.deleted.diff-content.claude-code',
      ],
      settings: { foreground: colors.diffRemove, fontStyle: '' },
    },
  ]
}
