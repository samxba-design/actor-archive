import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import { Twitter, Linkedin, MessageCircle, Mail, QrCode } from "lucide-react";

interface ShareModalProps {
  url: string;
  name: string;
  open: boolean;
  onClose: () => void;
}

const ShareModal = ({ url, name, open, onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const theme = usePortfolioTheme();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = [
    {
      label: "X / Twitter",
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(name)}'s portfolio!&url=${encodeURIComponent(url)}`,
      color: "#1d9bf0",
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "#0a66c2",
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://wa.me/?text=Check out ${encodeURIComponent(name)}'s portfolio: ${encodeURIComponent(url)}`,
      color: "#25d366",
    },
    {
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      href: `mailto:?subject=${encodeURIComponent(`${name}'s Portfolio`)}&body=${encodeURIComponent(`Check out ${name}'s portfolio: ${url}`)}`,
      color: "#6b7280",
    },
  ];

  const inputStyle: React.CSSProperties = {
    background: theme.bgSecondary || theme.bgPrimary,
    border: `1px solid ${theme.borderPrimary}`,
    color: theme.textPrimary,
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.813rem",
    flex: 1,
    outline: "none",
    minWidth: 0,
  };

  const btnStyle: React.CSSProperties = {
    background: theme.accentPrimary,
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    fontSize: "0.813rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "opacity 0.15s",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: theme.bgPrimary,
          border: `1px solid ${theme.borderPrimary}`,
          color: theme.textPrimary,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: theme.textPrimary }}>
            Share {name}'s Portfolio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* URL copy row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={url}
              readOnly
              style={inputStyle}
            />
            <button onClick={copyUrl} style={btnStyle}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Share buttons */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: theme.textSecondary }}
            >
              Share via
            </p>
            <div className="flex flex-wrap gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ background: link.color }}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-3"
              style={{ color: theme.textSecondary }}
            >
              QR Code
            </p>
            <div className="flex items-start gap-4">
              <img
                src={qrUrl}
                alt={`QR code for ${name}'s portfolio`}
                className="w-32 h-32 rounded-lg"
                style={{ border: `1px solid ${theme.borderPrimary}` }}
              />
              <div className="flex flex-col gap-2 pt-1">
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Scan to open portfolio
                </p>
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 w-fit"
                  style={{
                    background: theme.accentPrimary,
                    color: "#fff",
                  }}
                >
                  <QrCode className="h-4 w-4" />
                  Download QR
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
