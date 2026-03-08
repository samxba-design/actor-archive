import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  url: string;
  title: string;
  description?: string;
}

const ShareButtons = ({ url, title, description }: Props) => {
  const theme = usePortfolioTheme();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      label: "Twitter / X",
      icon: "𝕏",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-2.5 transition-all hover:scale-105"
        style={{
          background: theme.bgElevated,
          color: theme.textSecondary,
          border: `1px solid ${theme.borderDefault}`,
        }}
        aria-label="Share this portfolio"
        aria-expanded={open}
      >
        <Share2 className="h-4 w-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-lg p-1.5 shadow-lg"
            style={{
              background: theme.bgElevated,
              border: `1px solid ${theme.borderDefault}`,
              borderRadius: theme.cardRadius,
            }}
            role="menu"
          >
            <button
              onClick={handleCopy}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors"
              style={{ color: theme.textPrimary }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgSecondary)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              role="menuitem"
            >
              {copied ? <Check className="h-3.5 w-3.5" style={{ color: theme.statusAvailable }} /> : <Link2 className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md transition-colors"
                style={{ color: theme.textPrimary }}
                onMouseEnter={(e) => (e.currentTarget.style.background = theme.bgSecondary)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                role="menuitem"
              >
                <span className="text-xs w-3.5 text-center">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
