/**
 * Sanitize user-provided CSS to prevent XSS attacks.
 * Strips dangerous patterns like javascript:, expression(), behavior, @import, etc.
 */
export function sanitizeCSS(css: string): string {
  if (!css) return '';

  return css
    // Remove javascript: protocol
    .replace(/javascript\s*:/gi, '')
    // Remove expression() - IE CSS expressions
    .replace(/expression\s*\(/gi, '')
    // Remove behavior: url() - IE DHTML behaviors
    .replace(/behavior\s*:/gi, '')
    // Remove -moz-binding
    .replace(/-moz-binding\s*:/gi, '')
    // Remove @import to prevent loading external stylesheets
    .replace(/@import\b/gi, '')
    // Remove url() containing data: with script types
    .replace(/url\s*\(\s*['"]?\s*data\s*:\s*text\/html/gi, 'url(about:blank')
    // Remove </style> closing tags that could break out
    .replace(/<\/style/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '');
}
