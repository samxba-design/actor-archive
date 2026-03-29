import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import CompanyLogo from "@/components/CompanyLogo";

interface Props {
  items: any[];
  variant?: "carousel" | "cards" | "wall" | "single";
}

const SectionTestimonials = ({ items, variant = "carousel" }: Props) => {
  const theme = usePortfolioTheme();

  if (variant === "wall")   return <WallVariant   items={items} theme={theme} />;
  if (variant === "single") return <SingleVariant  items={items} theme={theme} />;
  if (variant === "cards")  return <CardsVariant   items={items} theme={theme} />;

  // Auto: carousel for >2, else cards
  return items.length > 2
    ? <CarouselView items={items} theme={theme} />
    : <CardsVariant items={items} theme={theme} />;
};

/* ─── Author attribution ───────────────────────────────────────────────────── */
const AuthorBlock = ({
  t, theme, centered, large,
}: { t: any; theme: any; centered?: boolean; large?: boolean }) => (
  <div
    className={`flex items-center gap-${large ? "4" : "3"} ${centered ? "justify-center" : ""}`}
  >
    {t.author_photo_url ? (
      <img
        src={t.author_photo_url}
        alt={t.author_name}
        className={`${large ? "w-12 h-12" : "w-9 h-9"} rounded-full object-cover shrink-0`}
        style={{
          boxShadow: `0 0 0 2px ${theme.bgPrimary}, 0 0 0 4px ${theme.accentPrimary}35`,
        }}
      />
    ) : (
      <div
        className={`${large ? "w-12 h-12" : "w-9 h-9"} rounded-full flex items-center justify-center shrink-0 font-semibold`}
        style={{
          backgroundColor: theme.accentSubtle,
          color: theme.accentPrimary,
          fontSize: large ? "16px" : "13px",
        }}
      >
        {(t.author_name || "?")[0].toUpperCase()}
      </div>
    )}
    <div>
      <p
        className={`${large ? "text-sm" : "text-[13px]"} font-semibold`}
        style={{ color: theme.textPrimary }}
      >
        {t.author_name}
      </p>
      <div className={`flex items-center gap-2 ${centered ? "" : "flex-wrap"}`}>
        <p className="text-[11px]" style={{ color: theme.textSecondary }}>
          {[t.author_role, t.author_company].filter(Boolean).join(", ")}
        </p>
        {t.author_company && (
          <CompanyLogo companyName={t.author_company} size={large ? 18 : 14} grayscale />
        )}
      </div>
    </div>
  </div>
);

/* ─── Carousel ─────────────────────────────────────────────────────────────── */
const CarouselView = ({ items, theme }: { items: any[]; theme: any }) => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [anim, setAnim] = useState(false);

  const goTo = useCallback((next: number, direction: 1 | -1) => {
    setDir(direction);
    setAnim(true);
    setTimeout(() => {
      setActive(next);
      setAnim(false);
    }, 200);
  }, []);

  const next = useCallback(() => goTo((active + 1) % items.length, 1), [active, items.length, goTo]);
  const prev = useCallback(() => goTo((active - 1 + items.length) % items.length, -1), [active, items.length, goTo]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const t = items[active];

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
      style={{
        background: theme.glassEnabled
          ? theme.glassBackground
          : `linear-gradient(135deg, ${theme.bgSecondary}, ${theme.bgElevated})`,
        backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
        border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
        borderRadius: theme.cardRadius,
      }}
    >
      {/* Decorative large quote */}
      <span
        className="absolute -top-2 left-4 text-[120px] leading-none select-none pointer-events-none"
        style={{
          color: `${theme.accentPrimary}08`,
          fontFamily: theme.fontDisplay,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        "
      </span>

      {/* Quote */}
      <div
        style={{
          opacity: anim ? 0 : 1,
          transform: anim
            ? `translateX(${dir * 20}px)`
            : "translateX(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <p
          className="text-base sm:text-[17px] italic leading-[1.75] relative"
          style={{
            color: theme.textPrimary,
            fontFamily: theme.fontLogline,
          }}
        >
          {t.quote}
        </p>
        <div className="mt-5">
          <AuthorBlock t={t} theme={theme} />
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={prev}
          className="p-1.5 rounded-full transition-all hover:scale-105"
          style={{
            backgroundColor: `${theme.accentPrimary}15`,
            color: theme.accentPrimary,
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i, i > active ? 1 : -1)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                backgroundColor: i === active ? theme.accentPrimary : theme.borderDefault,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="p-1.5 rounded-full transition-all hover:scale-105 ml-auto"
          style={{
            backgroundColor: `${theme.accentPrimary}15`,
            color: theme.accentPrimary,
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ─── Cards variant ────────────────────────────────────────────────────────── */
const CardsVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.map((t) => (
      <div
        key={t.id}
        className="p-5 space-y-3 relative flex flex-col"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
        }}
      >
        {/* Subtle quote decoration */}
        <span
          className="absolute top-3 left-4 text-5xl leading-none select-none pointer-events-none"
          style={{ color: `${theme.accentPrimary}12`, fontFamily: theme.fontDisplay }}
          aria-hidden="true"
        >
          "
        </span>
        <p
          className="text-[13px] italic leading-relaxed flex-1 relative"
          style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}
        >
          {t.quote}
        </p>
        <div
          className="pt-3"
          style={{ borderTop: `1px solid ${theme.borderDefault}` }}
        >
          <AuthorBlock t={t} theme={theme} />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Wall variant ─────────────────────────────────────────────────────────── */
const WallVariant = ({ items, theme }: { items: any[]; theme: any }) => (
  <div className="columns-1 sm:columns-2 gap-3 space-y-3">
    {items.map((t, i) => (
      <div
        key={t.id}
        className="break-inside-avoid p-5 space-y-3"
        style={{
          backgroundColor: theme.glassEnabled ? theme.glassBackground : theme.bgSecondary,
          backdropFilter: theme.glassEnabled ? `blur(${theme.glassBlur})` : undefined,
          border: `${theme.cardBorderWidth} solid ${theme.borderDefault}`,
          borderRadius: theme.cardRadius,
          fontSize: i === 0 ? "15px" : "13px",
        }}
      >
        <span
          className="text-4xl leading-none select-none"
          style={{ color: `${theme.accentPrimary}18`, fontFamily: theme.fontDisplay }}
          aria-hidden="true"
        >
          "
        </span>
        <p
          className="italic leading-relaxed"
          style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}
        >
          {t.quote}
        </p>
        <div
          className="pt-2"
          style={{ borderTop: `1px solid ${theme.borderDefault}` }}
        >
          <AuthorBlock t={t} theme={theme} />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Single variant ───────────────────────────────────────────────────────── */
const SingleVariant = ({ items, theme }: { items: any[]; theme: any }) => {
  const t = items[0];
  if (!t) return null;
  return (
    <div className="text-center py-6 max-w-2xl mx-auto space-y-5">
      <span
        className="block text-8xl leading-none select-none"
        style={{ color: `${theme.accentPrimary}12`, fontFamily: theme.fontDisplay }}
        aria-hidden="true"
      >
        "
      </span>
      <p
        className="text-xl sm:text-2xl italic leading-[1.65]"
        style={{ color: theme.textPrimary, fontFamily: theme.fontLogline }}
      >
        {t.quote}
      </p>
      <div
        className="w-10 h-px mx-auto"
        style={{ backgroundColor: `${theme.accentPrimary}50` }}
      />
      <AuthorBlock t={t} theme={theme} centered large />
    </div>
  );
};

export default SectionTestimonials;
