import { getCompanyLogoUrl } from "@/lib/companyLogos";

interface Props {
  companyName: string;
  className?: string;
  size?: number;
  grayscale?: boolean;
}

const CompanyLogo = ({ companyName, className = "", size = 40, grayscale = true }: Props) => {
  const logoUrl = getCompanyLogoUrl(companyName, size * 2); // 2x for retina

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={`object-contain transition-all duration-200 ${
        grayscale ? "grayscale hover:grayscale-0" : ""
      } ${className}`}
      style={{ maxHeight: `${size}px`, maxWidth: `${size * 2.5}px` }}
      onError={(e) => {
        // Hide broken images
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

export default CompanyLogo;
