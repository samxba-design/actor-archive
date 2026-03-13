import { useState } from "react";
import {
  getCompanyLogoUrlWithColor,
  getCompanyDomain,
  getFaviconUrl,
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
  const colorMode: LogoColorMode = colorModeProp ?? (grayscale ? 'grayscale' : 'original');

  // 3-stage fallback: logo.dev → favicon → initials
  const [stage, setStage] = useState<"logodev" | "favicon" | "initials">("logodev");

  const getSrc = (): string | null => {
    switch (stage) {
      case "logodev": {
        const { url } = getCompanyLogoUrlWithColor(companyName, colorMode, themeAccentHex);
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

  // For theme mode on logo.dev, apply CSS sepia tint
  const { needsCssTint } = getCompanyLogoUrlWithColor(companyName, colorMode, themeAccentHex);
  const filterStyle: React.CSSProperties = needsCssTint
    ? { filter: 'sepia(1) saturate(2) brightness(0.8)' }
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
        if (stage === "logodev") setStage("favicon");
        else setStage("initials");
      }}
    />
  );
};

export default CompanyLogo;
