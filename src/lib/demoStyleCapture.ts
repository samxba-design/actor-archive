/**
 * demoStyleCapture.ts
 *
 * Captures the current demo theme + layout preset into localStorage so
 * DashboardHome can apply it when the user signs up or logs in.
 */

export const DEMO_STYLE_KEY = "cs_pending_demo_style";

export interface PendingDemoStyle {
  theme: string;
  layoutPreset: string;
  capturedAt: number; // Unix ms — we expire after 24h
}

export function saveDemoStyle(theme: string, layoutPreset: string): void {
  const payload: PendingDemoStyle = { theme, layoutPreset, capturedAt: Date.now() };
  try { localStorage.setItem(DEMO_STYLE_KEY, JSON.stringify(payload)); } catch {}
}

export function loadDemoStyle(): PendingDemoStyle | null {
  try {
    const raw = localStorage.getItem(DEMO_STYLE_KEY);
    if (!raw) return null;
    const data: PendingDemoStyle = JSON.parse(raw);
    // Expire after 24 hours
    if (Date.now() - data.capturedAt > 86_400_000) {
      localStorage.removeItem(DEMO_STYLE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearDemoStyle(): void {
  try { localStorage.removeItem(DEMO_STYLE_KEY); } catch {}
}
