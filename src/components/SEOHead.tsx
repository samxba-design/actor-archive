import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, any>;
  profileSlug?: string; // For dynamic OG images
  noIndex?: boolean;
}

const DEFAULT_SITE_URL = "https://actor-archive.lovable.app";
const SITE_NAME = "CreativeSlate";
const CONFIGURED_SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
const resolveBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return CONFIGURED_SITE_URL || DEFAULT_SITE_URL;
};

const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const SEOHead = ({
  title,
  description,
  path = "/",
  type = "website",
  image,
  jsonLd,
  profileSlug,
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const baseUrl = resolveBaseUrl();
  const canonical = new URL(path, `${baseUrl}/`).toString();
  
  // Use dynamic OG image for profiles, fallback to provided image or default
  const ogImage = profileSlug 
    ? `${SUPABASE_URL}/functions/v1/og-image?slug=${profileSlug}`
    : (image ? new URL(image, `${baseUrl}/`).toString() : DEFAULT_IMAGE);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
