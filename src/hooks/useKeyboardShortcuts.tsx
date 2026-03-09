import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: "navigation" | "actions" | "general";
}

export function useKeyboardShortcuts(enabled: boolean = true) {
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    // Navigation (g + key)
    { key: "g h", description: "Go to Home", action: () => navigate("/dashboard"), category: "navigation" },
    { key: "g p", description: "Go to Profile Editor", action: () => navigate("/dashboard/profile"), category: "navigation" },
    { key: "g w", description: "Go to Projects", action: () => navigate("/dashboard/projects"), category: "navigation" },
    { key: "g i", description: "Go to Inbox", action: () => navigate("/dashboard/inbox"), category: "navigation" },
    { key: "g a", description: "Go to Analytics", action: () => navigate("/dashboard/analytics"), category: "navigation" },
    { key: "g s", description: "Go to Settings", action: () => navigate("/dashboard/settings"), category: "navigation" },
    // Actions
    { key: "n", description: "New item (context-aware)", action: () => {
      const btn = document.querySelector('[data-shortcut="new"]') as HTMLButtonElement;
      btn?.click();
    }, category: "actions" },
    { key: "/", description: "Focus search", action: () => {
      const input = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      input?.focus();
    }, category: "actions" },
    { key: "Escape", description: "Close modal / Cancel", action: () => {
      const closeBtn = document.querySelector('[data-shortcut="close"], [aria-label="Close"]') as HTMLButtonElement;
      closeBtn?.click();
    }, category: "general" },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    // Skip if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      if (e.key === "Escape") {
        target.blur();
      }
      return;
    }

    const key = e.key.toLowerCase();

    // Handle "g" prefix for navigation
    if (key === "g" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      window.__keySequence = "g";
      setTimeout(() => { window.__keySequence = ""; }, 1000);
      return;
    }

    // Check for sequence shortcuts
    if (window.__keySequence === "g") {
      const shortcut = shortcuts.find(s => s.key === `g ${key}`);
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
      window.__keySequence = "";
      return;
    }

    // Single key shortcuts
    const shortcut = shortcuts.find(s => s.key === key && !s.key.includes(" "));
    if (shortcut && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      shortcut.action();
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

// Type augmentation for window
declare global {
  interface Window {
    __keySequence?: string;
  }
}
