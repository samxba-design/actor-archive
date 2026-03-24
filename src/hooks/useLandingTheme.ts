import { useEffect, useState, useCallback } from "react";

const LS_KEY = "landing-theme";

export function useLandingTheme() {
  const [isLight, setIsLight] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY) === "light";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add("landing-light");
    } else {
      root.classList.remove("landing-light");
    }
    try {
      localStorage.setItem(LS_KEY, isLight ? "light" : "dark");
    } catch {}
  }, [isLight]);

  const toggle = useCallback(() => setIsLight((v) => !v), []);

  return { isLight, toggle };
}
