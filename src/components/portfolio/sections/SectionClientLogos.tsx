import CompanyLogo from "@/components/CompanyLogo";
import { usePortfolioTheme } from "@/themes/ThemeProvider";

interface Props {
  companies: string[];
  variant?: 'bar' | 'grid' | 'marquee';
}

const SectionClientLogos = ({ companies, variant = 'bar' }: Props) => {
  const theme = usePortfolioTheme();

  if (!companies.length) return null;

  const LogoItem = ({ name, size = 28 }: { name: string; size?: number }) => (
    <div className="flex flex-col items-center gap-1.5 shrink-0 group/logo">
      <div
        className="flex items-center justify-center transition-all duration-300"
        style={{ width: size * 2, height: size * 1.5 }}
      >
        <CompanyLogo companyName={name} size={size} grayscale />
      </div>
      <span
        className="text-[9px] font-medium uppercase tracking-widest text-center transition-colors duration-200"
        style={{ color: theme.textTertiary }}
      >
        {name}
      </span>
    </div>
  );

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
        {companies.map(name => (
          <LogoItem key={name} name={name} size={32} />
        ))}
      </div>
    );
  }

  if (variant === 'marquee') {
    const doubled = [...companies, ...companies, ...companies];
    return (
      <div className="relative overflow-hidden py-3">
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${theme.bgPrimary}, transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${theme.bgPrimary}, transparent)` }}
        />
        <div className="flex gap-10 animate-[client-marquee_25s_linear_infinite]">
          {doubled.map((name, i) => (
            <LogoItem key={`${name}-${i}`} name={name} size={24} />
          ))}
        </div>
      </div>
    );
  }

  // bar (default)
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 py-2">
      {companies.map(name => (
        <LogoItem key={name} name={name} />
      ))}
    </div>
  );
};

export default SectionClientLogos;
