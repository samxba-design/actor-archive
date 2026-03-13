import { useState } from "react";
import { getCompanyLogoUrl, getCompanyDomain, getFaviconUrl } from "@/lib/companyLogos";

interface Props {
  companyName: string;
  className?: string;
  size?: number;
  grayscale?: boolean;
}

const CompanyLogo = ({ companyName, className = "", size = 40, grayscale = true }: Props) => {
  const [stage, setStage] = useState<"primary" | "favicon" | "initials">("primary");

  const src =
    stage === "primary"
      ? getCompanyLogoUrl(companyName, size * 2)
      : stage === "favicon"
        ? getFaviconUrl(getCompanyDomain(companyName), 128)
        : null;

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

  return (
    <img
      src={src}
      alt={`${companyName} logo`}
      className={`object-contain transition-all duration-200 ${
        grayscale ? "grayscale hover:grayscale-0" : ""
      } ${className}`}
      style={{ maxHeight: `${size}px`, maxWidth: `${size * 2.5}px` }}
      onError={() => {
        if (stage === "primary") setStage("favicon");
        else setStage("initials");
      }}
    />
  );
};

export default CompanyLogo;
