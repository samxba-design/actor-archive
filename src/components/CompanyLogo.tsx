import { useState } from "react";
import {
  getCompanyLogoUrlWithColor,
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
  const [hidden, setHidden] = useState(false);

  const { url, needsCssTint } = getCompanyLogoUrlWithColor(companyName, colorMode, themeAccentHex);

  if (hidden) return null;

  const filterStyle: React.CSSProperties = needsCssTint
    ? { filter: 'sepia(1) saturate(2) brightness(0.8)' }
    : {};

  return (
    <img
      src={url}
      alt={`${companyName} logo`}
      className={`object-contain transition-all duration-200 ${className}`}
      style={{
        maxHeight: `${size}px`,
        maxWidth: `${size * 2.5}px`,
        ...filterStyle,
      }}
      onError={() => setHidden(true)}
    />
  );
};

export default CompanyLogo;
