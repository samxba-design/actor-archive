import { useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface ClientItem {
  company_name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

type ColorMode = 'original' | 'grayscale' | 'theme';

interface Props {
  items?: ClientItem[];
  /** Legacy prop — plain company names for Clearbit lookup */
  companies?: string[];
  variant?: 'bar' | 'grid' | 'marquee';
  colorMode?: ColorMode;
}

const SectionClientLogos = ({ items, companies, variant = 'bar', colorMode = 'original' }: Props) => {
  const theme = usePortfolioTheme();

  // Normalize: DB items take priority, fall back to legacy string array
  const clients: ClientItem[] = items && items.length > 0
    ? items
    : (companies || []).map(name => ({ company_name: name }));

  if (!clients.length) return null;

  const LogoItem = ({ client, size = 28 }: { client: ClientItem; size?: number }) => {
    const hasCustomLogo = !!client.logo_url;

    const [imgError, setImgError] = useState(false);

    const logoContent = hasCustomLogo && !imgError ? (
      <img
        src={client.logo_url!}
        alt={`${client.company_name} logo`}
        className="object-contain grayscale hover:grayscale-0 transition-all duration-200"
        style={{ maxHeight: `${size}px`, maxWidth: `${size * 2.5}px` }}
        onError={() => setImgError(true)}
      />
    ) : (
      <CompanyLogo companyName={client.company_name} size={size} grayscale />
    );

    const inner = (
      <div className="flex flex-col items-center gap-1.5 shrink-0 group/logo">
        <div
          className="flex items-center justify-center transition-all duration-300"
          style={{ width: size * 2, height: size * 1.5 }}
        >
          {logoContent}
        </div>
        <span
          className="text-[9px] font-medium uppercase tracking-widest text-center transition-colors duration-200"
          style={{ color: theme.textTertiary }}
        >
          {client.company_name}
        </span>
      </div>
    );

    if (client.website_url) {
      return (
        <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="no-underline">
          {inner}
        </a>
      );
    }

    return inner;
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
        {clients.map((c, i) => (
          <LogoItem key={`${c.company_name}-${i}`} client={c} size={32} />
        ))}
      </div>
    );
  }

  if (variant === 'marquee') {
    const doubled = [...clients, ...clients, ...clients];
    return (
      <div className="relative overflow-hidden py-3">
        <div
          className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${theme.bgPrimary}, transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${theme.bgPrimary}, transparent)` }}
        />
        <div className="flex gap-10 animate-[client-marquee_25s_linear_infinite]">
          {doubled.map((c, i) => (
            <LogoItem key={`${c.company_name}-${i}`} client={c} size={24} />
          ))}
        </div>
      </div>
    );
  }

  // bar (default)
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 py-2">
      {clients.map((c, i) => (
        <LogoItem key={`${c.company_name}-${i}`} client={c} />
      ))}
    </div>
  );
};

export default SectionClientLogos;
