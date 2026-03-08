/**
 * Lightweight markdown-to-HTML converter for bios and descriptions.
 * Supports: **bold**, *italic*, [text](url)
 * Sanitizes HTML to prevent XSS.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderSimpleMarkdown(text: string): string {
  let html = escapeHtml(text);

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:hsl(var(--portfolio-accent));text-decoration:underline">$1</a>'
  );

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return html;
}
