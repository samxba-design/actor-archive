import { useState } from "react";
import {
  getCompanyLogoUrlWithColor,
  getCompanyDomain,
  getFaviconUrl,
  getSimpleIconSlug,
  getSimpleIconUrl,
  type LogoColorMode,
} from "@/lib/companyLogos";

interface Props {
  companyName: string;
  className?: string;
  size?: number;
  grayscale?: boolean;
  colorMode?: LogoColorMode;
  themeAccentHex?: string;
}

const CompanyLogo = ({
  companyName,
  className = "",
  size = 40,
  grayscale = false,
  colorMode: colorModeProp,
  themeAccentHex,
}: Props) => {
  // Resolve effective color mode: explicit colorMode prop takes priority, then grayscale boolean
  const colorMode: LogoColorMode = colorModeProp ?? (grayscale ? 'grayscale' : 'original');

  const slug = getSimpleIconSlug(companyName);
  const hasSimpleIcon = !!slug;

  // 4-stage fallback: simpleicon → hunter → favicon → initials
  const [stage, setStage] = useState<"simpleicon" | "hunter" | "favicon" | "initials">(
    hasSimpleIcon ? "simpleicon" : "hunter"
  );

  const getSrc = (): string | null => {
    switch (stage) {
      case "simpleicon": {
        if (!slug) return null;
        let color: string | undefined;
        switch (colorMode) {
          case 'white': color = 'white'; break;
          case 'dark': color = '000000'; break;
          case 'grayscale': color = '999999'; break;
          case 'theme': color = themeAccentHex?.replace('#', '') || undefined; break;
          default: color = undefined; break;
        }
        return getSimpleIconUrl(slug, color);
      }
      case "hunter": {
        const { url } = getCompanyLogoUrlWithColor(companyName, 'original');
        return url;
      }
      case "favicon":
        return getFaviconUrl(getCompanyDomain(companyName), 128);
      default:
        return null;
    }
  };

  const src = getSrc();

  if (stage === "initials" || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-muted text-muted-foreground font-bold text-xs uppercase ${className}`}
        style={{ width: size, height: size }}
      >
        {companyName.slice(0, 2)}
      </div>
    );
  }

  // For non-SimpleIcon sources, apply CSS filter for color modes
  const needsCssFilter = stage !== "simpleicon" && colorMode !== 'original';
  const filterStyle: React.CSSProperties = needsCssFilter
    ? {
        filter:
          colorMode === 'grayscale' ? 'grayscale(1)' :
          colorMode === 'white' ? 'grayscale(1) brightness(10)' :
          colorMode === 'dark' ? 'grayscale(1) brightness(0)' :
          colorMode === 'theme' ? 'grayscale(1) sepia(1) brightness(0.75)' :
          'none',
      }
    : {};

  return (
    <img
      src={src}
      alt={`${companyName} logo`}
      className={`object-contain transition-all duration-200 ${className}`}
      style={{
        maxHeight: `${size}px`,
        maxWidth: `${size * 2.5}px`,
        ...filterStyle,
      }}
      onError={() => {
        if (stage === "simpleicon") setStage("hunter");
        else if (stage === "hunter") setStage("favicon");
        else setStage("initials");
      }}
    />
  );
};

export default CompanyLogo;
