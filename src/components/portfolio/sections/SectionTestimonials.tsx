import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import CompanyLogo from "@/components/CompanyLogo";

interface Props {
  items: any[];
  variant?: 'carousel' | 'cards' | 'wall' | 'single';
}

const SectionTestimonials = ({ items, variant = 'carousel' }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === 'wall') return <WallVariant items={items} theme={theme} />;
  if (variant === 'single') return <SingleVariant items={items} theme={theme} />;
  if (variant === 'cards') return <CardsVariant items={items} theme={theme} />;

  // Carousel (default) — use carousel if >2 items, else cards
  const useCarousel = items.length > 2;
  if (useCarousel) return <CarouselView items={items} theme={theme} />;
  return <CardsVariant items={items} theme={theme} />;
};

/* ── Carousel view ── */
const CarouselView = ({ items, theme }: { items: any[]; theme: any }) => {
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setActive(i => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const t = items[active];
  return (
    <div className="relative max-w-2xl mx-auto text-center py-4">
      <span className="block text-5xl leading-none select-none mb-1" style={{ color: `${theme.accentPrimary}20`, fontFamily: theme.fontDisplay }} aria-hidden="true">"</span>
      <p className="text-base sm:text-lg italic leading-relaxed mb-4 transition-opacity duration-300" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }} key={active}>{t.quote}</p>
      <AuthorBlock t={t} theme={theme} centered />
      <NavDots items={items} active={active} setActive={setActive} prev={prev} next={next} theme={theme} />
    </div>
  );
};

/* ── Cards variant: grid of cards ── */
const CardsVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.map((t) => (
      <div key={t.id} className="p-4 space-y-2.5 relative" style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        borderRadius: theme.cardRadius,
      }}>
        <span className="text-3xl leading-none select-none absolute top-2 left-3" style={{ color: `${theme.accentPrimary}15`, fontFamily: theme.fontDisplay }} aria-hidden="true">"</span>
        <p className="text-[13px] italic leading-relaxed pt-4" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}>{t.quote}</p>
        <AuthorBlock t={t} theme={theme} />
      </div>
    ))}
  </div>
);

/* ── Wall variant: masonry-like stacked quotes ── */
const WallVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="columns-1 sm:columns-2 gap-3 space-y-3">
    {items.map((t, i) => (
      <div key={t.id} className="break-inside-avoid p-4 space-y-2.5" style={{
        backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        borderRadius: theme.cardRadius,
        fontSize: i === 0 ? '15px' : '13px',
      }}>
        <span className="text-4xl leading-none select-none" style={{ color: `${theme.accentPrimary}20`, fontFamily: theme.fontDisplay }} aria-hidden="true">"</span>
        <p className="italic leading-relaxed" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}>{t.quote}</p>
        <AuthorBlock t={t} theme={theme} />
      </div>
    ))}
  </div>
);

/* ── Single variant: one large featured quote ── */
const SingleVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  const t = items[0];
  if (!t) return null;
  return (
    <div className="text-center py-8 max-w-2xl mx-auto space-y-4">
      <span className="block text-7xl leading-none select-none" style={{ color: `${theme.accentPrimary}15`, fontFamily: theme.fontDisplay }} aria-hidden="true">"</span>
      <p className="text-xl sm:text-2xl italic leading-relaxed" style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}>{t.quote}</p>
      <AuthorBlock t={t} theme={theme} centered large />
    </div>
  );
};

/* ── Shared: Author attribution ── */
const AuthorBlock = ({ t, theme, centered, large }: { t: any; theme: any; centered?: boolean; large?: boolean }) => (
  <div className={`flex items-center gap-${large ? '4' : '2.5'} ${centered ? 'justify-center' : ''}`}>
    {t.author_photo_url && (
      <img src={t.author_photo_url} alt={t.author_name}
        className={`${large ? 'w-12 h-12' : 'w-8 h-8'} rounded-full object-cover`}
        style={{ boxShadow: `0 0 0 ${large ? '2px' : '1.5px'} ${theme.accentPrimary}30` }} />
    )}
    <div className={centered ? 'text-left' : ''}>
      <p className={`${large ? 'text-sm' : 'text-[13px]'} font-semibold`} style={{ color: theme.textPrimary }}>{t.author_name}</p>
      <div className="flex items-center gap-2">
        <p className="text-[11px]" style={{ color: theme.textSecondary }}>
          {[t.author_role, t.author_company].filter(Boolean).join(", ")}
        </p>
        {t.author_company && <CompanyLogo companyName={t.author_company} size={large ? 18 : 16} grayscale={!centered} />}
      </div>
    </div>
  </div>
);

/* ── Shared: Navigation dots ── */
const NavDots = ({ items, active, setActive, prev, next, theme }: any) => (
  <div className="flex items-center justify-center gap-3 mt-4">
    <button type="button" onClick={prev} className="p-1.5 rounded-full transition-colors" style={{ color: theme.textTertiary, backgroundColor: theme.bgElevated }}>
      <ChevronLeft className="w-3.5 h-3.5" />
    </button>
    <div className="flex gap-1.5">
      {items.map((_: any, i: number) => (
        <button type="button" key={i} onClick={() => setActive(i)} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{ backgroundColor: i === active ? theme.accentPrimary : theme.borderDefault, transform: i === active ? "scale(1.5)" : "scale(1)" }} />
      ))}
    </div>
    <button type="button" onClick={next} className="p-1.5 rounded-full transition-colors" style={{ color: theme.textTertiary, backgroundColor: theme.bgElevated }}>
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default SectionTestimonials;
