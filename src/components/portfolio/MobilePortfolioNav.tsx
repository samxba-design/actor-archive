/**
 * MobilePortfolioNav.tsx
 *
 * Sticky bottom navigation bar for public portfolio pages on mobile.
 * Shows anchor links to visible sections for quick navigation.
 */
import { useState, useEffect } from "react";
import { User, FolderOpen, Image, Trophy, Mail, FileText } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface NavItem {
  label: string;
  icon: any;
  anchor: string;
  sectionKeys: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "About",    icon: User,       anchor: "bio",            sectionKeys: ["bio"] },
  { label: "Work",     icon: FolderOpen, anchor: "projects",       sectionKeys: ["projects", "credits", "case_studies"] },
  { label: "Gallery",  icon: Image,      anchor: "gallery",        sectionKeys: ["gallery"] },
  { label: "Awards",   icon: Trophy,     anchor: "awards",         sectionKeys: ["awards", "press"] },
  { label: "Scripts",  icon: FileText,   anchor: "scripts",        sectionKeys: ["scripts", "published_work"] },
  { label: "Contact",  icon: Mail,       anchor: "portfolio-contact", sectionKeys: ["contact"] },
];

interface Props {
  sectionOrder: string[];
  sectionsVisible: Record<string, boolean>;
}

const MobilePortfolioNav = ({ sectionOrder, sectionsVisible }: Props) => {
  const theme = usePortfolioTheme();
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  // Only show after scrolling past hero
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Build items that have visible sections
  const navItems = NAV_ITEMS.filter(item =>
    item.sectionKeys.some(key => {
      const isInOrder = sectionOrder.includes(key);
      const notHidden = sectionsVisible[key] !== false;
      return isInOrder && notHidden;
    }) || item.anchor === "portfolio-contact"
  );

  // Active section tracking
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 120;
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.anchor);
        if (el && el.offsetTop <= scrollY) {
          setActive(item.anchor);
          return;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems]);

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!visible || navItems.length < 2) return null;

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around px-1 pb-safe"
      style={{
        background: `${theme.bgElevated}f0`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${theme.borderDefault}`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {navItems.slice(0, 5).map(item => {
        const isActive = active === item.anchor;
        return (
          <button
            key={item.anchor}
            onClick={() => scrollTo(item.anchor)}
            className="flex flex-col items-center gap-0.5 py-2.5 px-2 min-w-[48px] transition-all"
            style={{ color: isActive ? theme.accentPrimary : theme.textTertiary }}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <span
                className="absolute bottom-1 w-1 h-1 rounded-full"
                style={{ backgroundColor: theme.accentPrimary }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobilePortfolioNav;
