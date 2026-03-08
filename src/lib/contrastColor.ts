/**
 * Determine whether text on a given background should be light or dark.
 */
export function hexToRelativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function isLightColor(hex: string): boolean {
  try {
    return hexToRelativeLuminance(hex) > 0.35;
  } catch {
    return false;
  }
}

export function getContrastTextColors(bgHex: string) {
  const light = isLightColor(bgHex);
  return {
    text: light ? '#1a1a1a' : '#F5F0EB',
    muted: light ? 'rgba(26,26,26,0.7)' : 'rgba(245,240,235,0.65)',
    faint: light ? 'rgba(26,26,26,0.45)' : 'rgba(245,240,235,0.4)',
  };
}
