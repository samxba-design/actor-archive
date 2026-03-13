import { useEffect, useRef, useCallback } from "react";

/**
 * Auto-saves form state to sessionStorage (debounced) and restores on mount.
 * Adds beforeunload warning when there are unsaved changes.
 */
export function useFormDraft<T extends Record<string, any>>(
  key: string,
  form: T,
  setForm: (updater: (prev: T) => T) => void,
  options?: { debounceMs?: number }
) {
  const debounceMs = options?.debounceMs ?? 500;
  const initialRef = useRef<T | null>(null);
  const restoredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Restore draft on mount (once)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const saved = sessionStorage.getItem(`draft:${key}`);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<T>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, [key, setForm]);

  // Track initial state for dirty detection
  useEffect(() => {
    if (initialRef.current === null) {
      initialRef.current = { ...form };
    }
  }, [form]);

  // Debounced save to sessionStorage
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem(`draft:${key}`, JSON.stringify(form));
      } catch {
        // storage full, ignore
      }
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [key, form, debounceMs]);

  // beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (initialRef.current && JSON.stringify(form) !== JSON.stringify(initialRef.current)) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form]);

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(`draft:${key}`);
    initialRef.current = { ...form };
  }, [key, form]);

  const hasDraft = useCallback(() => {
    return sessionStorage.getItem(`draft:${key}`) !== null;
  }, [key]);

  return { clearDraft, hasDraft };
}
