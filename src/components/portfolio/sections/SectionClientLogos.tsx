import { useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import type { LogoColorMode } from "@/lib/companyLogos";

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const LOGO_SIZE_MAP: Record<LogoSize, number> = {
  sm: 20,
  md: 28,
  lg: 36,
  xl: 48,
};

interface ClientItem {
  company_name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface Props {
  items?: ClientItem[];
  /** Legacy prop — plain company names for lookup */
  companies?: string[];
  variant?: 'bar' | 'grid' | 'marquee';
  colorMode?: LogoColorMode;
  logoSize?: LogoSize;
}

const SectionClientLogos = ({ items, companies, variant = 'bar', colorMode = 'original', logoSize = 'md' }: Props) => {
  const theme = usePortfolioTheme();

  // Normalize: DB items take priority, fall back to legacy string array
  const clients: ClientItem[] = items && items.length > 0
    ? items
    : (companies || []).map(name => ({ company_name: name }));

  if (!clients.length) return null;

  const basePx = LOGO_SIZE_MAP[logoSize];
    const hasCustomLogo = !!client.logo_url;
    const [imgError, setImgError] = useState(false);

    // CSS filter for custom uploaded logos when colorMode is not original
    const filterClass =
      colorMode === 'grayscale' ? 'grayscale hover:grayscale-0 transition-all duration-200' :
      colorMode === 'theme' ? 'grayscale sepia brightness-75 transition-all duration-200' :
      colorMode === 'white' ? 'brightness-0 invert transition-all duration-200' :
      colorMode === 'dark' ? 'brightness-0 transition-all duration-200' :
      'transition-all duration-200';

    const logoContent = hasCustomLogo && !imgError ? (
      <img
        src={client.logo_url!}
        alt={`${client.company_name} logo`}
        className={`object-contain ${filterClass}`}
        style={{ maxHeight: `${size}px`, maxWidth: `${size * 2.5}px` }}
        onError={() => setImgError(true)}
      />
    ) : (
      <CompanyLogo
        companyName={client.company_name}
        size={size}
        colorMode={colorMode}
        themeAccentHex={theme.accentPrimary}
      />
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
          <LogoItem key={`${c.company_name}-${i}`} client={c} />
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
            <LogoItem key={`${c.company_name}-${i}`} client={c} />
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
