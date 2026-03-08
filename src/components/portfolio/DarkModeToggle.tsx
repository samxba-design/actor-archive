import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

const DarkModeToggle = () => {
  const theme = usePortfolioTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Detect initial mode from theme or system
    const root = document.documentElement;
    const bg = getComputedStyle(root).getPropertyValue("--portfolio-bg").trim();
    // Simple heuristic: if background lightness > 50%, it's light
    setIsDark(!bg || true); // Default to dark for portfolio themes
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    if (next) {
      root.classList.remove("portfolio-light-override");
    } else {
      root.classList.add("portfolio-light-override");
    }
  };

  return (
    <button
      onClick={toggle}
      className="rounded-full p-2.5 transition-all hover:scale-105"
      style={{
        background: theme.bgElevated,
        color: theme.textSecondary,
        border: `1px solid ${theme.borderDefault}`,
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export default DarkModeToggle;
