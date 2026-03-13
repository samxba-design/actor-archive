// Company domain mapping for logo auto-fetch
// Maps common entertainment/media company names to their domains

export const COMPANY_DOMAINS: Record<string, string> = {
  // Studios & Streamers
  "Netflix": "netflix.com",
  "Amazon Studios": "studios.amazon.com",
  "Amazon": "amazon.com",
  "Apple TV+": "apple.com",
  "Apple": "apple.com",
  "Disney": "disney.com",
  "Disney+": "disney.com",
  "Walt Disney": "disney.com",
  "Paramount": "paramount.com",
  "Paramount+": "paramount.com",
  "Warner Bros": "warnerbros.com",
  "Warner Bros.": "warnerbros.com",
  "Warner Brothers": "warnerbros.com",
  "Universal": "universalpictures.com",
  "Universal Pictures": "universalpictures.com",
  "Sony Pictures": "sonypictures.com",
  "Sony": "sony.com",
  "Lionsgate": "lionsgate.com",
  "A24": "a24films.com",
  "HBO": "hbo.com",
  "HBO Max": "hbo.com",
  "Max": "hbo.com",
  "Hulu": "hulu.com",
  "Peacock": "peacocktv.com",
  "MGM": "mgm.com",
  "Focus Features": "focusfeatures.com",
  "Searchlight": "searchlightpictures.com",
  "20th Century": "20thcenturystudios.com",
  "Miramax": "miramax.com",
  "STX": "stxentertainment.com",
  "Neon": "neonrated.com",
  "Bleecker Street": "bleeckerstreetmedia.com",
  "IFC Films": "ifcfilms.com",

  // UK Broadcasters
  "BBC": "bbc.co.uk",
  "BBC Studios": "bbcstudios.com",
  "ITV": "itv.com",
  "Channel 4": "channel4.com",
  "Channel 5": "channel5.com",
  "Sky": "sky.com",
  "Sky Atlantic": "sky.com",
  "BritBox": "britbox.com",

  // Talent Agencies
  "CAA": "caa.com",
  "WME": "wmeagency.com",
  "UTA": "unitedtalent.com",
  "ICM": "icmpartners.com",
  "APA": "apa-agency.com",
  "Paradigm": "paradigmagency.com",
  "Gersh": "gershagency.com",
  "Verve": "verveagency.com",
  "Curtis Brown": "curtisbrown.co.uk",
  "United Agents": "unitedagents.co.uk",
  "Independent Talent": "independenttalent.com",
  "Hamilton Hodell": "hamiltonhodell.co.uk",
  "Troika": "troikatalent.com",

  // Publications & Media
  "Variety": "variety.com",
  "Deadline": "deadline.com",
  "Hollywood Reporter": "hollywoodreporter.com",
  "The Hollywood Reporter": "hollywoodreporter.com",
  "IndieWire": "indiewire.com",
  "Screen Daily": "screendaily.com",
  "The Guardian": "theguardian.com",
  "Guardian": "theguardian.com",
  "New York Times": "nytimes.com",
  "NYT": "nytimes.com",
  "The New York Times": "nytimes.com",
  "Washington Post": "washingtonpost.com",
  "LA Times": "latimes.com",
  "Los Angeles Times": "latimes.com",
  "Vulture": "vulture.com",
  "The Wrap": "thewrap.com",
  "Collider": "collider.com",
  "Empire": "empireonline.com",
  "Total Film": "gamesradar.com",
  "Sight and Sound": "bfi.org.uk",
  "Dazed": "dazeddigital.com",
  "i-D": "i-d.vice.com",
  "Vogue": "vogue.com",
  "GQ": "gq.com",
  "Esquire": "esquire.com",
  "Vanity Fair": "vanityfair.com",
  "The Atlantic": "theatlantic.com",
  "The New Yorker": "newyorker.com",
  "Wired": "wired.com",
  "Forbes": "forbes.com",
  "Bloomberg": "bloomberg.com",
  "Reuters": "reuters.com",
  "AP": "apnews.com",
  "Associated Press": "apnews.com",
  "Vice": "vice.com",
  "BuzzFeed": "buzzfeed.com",
  "Huffington Post": "huffpost.com",
  "HuffPost": "huffpost.com",
  "Rolling Stone": "rollingstone.com",
  "Billboard": "billboard.com",
  "Pitchfork": "pitchfork.com",
  "NME": "nme.com",
  "Time": "time.com",
  "Time Magazine": "time.com",
  "Newsweek": "newsweek.com",

  // Tech & SaaS
  "Google": "google.com",
  "Meta": "meta.com",
  "Facebook": "meta.com",
  "Microsoft": "microsoft.com",
  "Spotify": "spotify.com",
  "Airbnb": "airbnb.com",
  "Uber": "uber.com",
  "Slack": "slack.com",
  "Shopify": "shopify.com",
  "Stripe": "stripe.com",
  "Notion": "notion.so",
  "Figma": "figma.com",
  "Adobe": "adobe.com",
  "Salesforce": "salesforce.com",
  "Oracle": "oracle.com",
  "IBM": "ibm.com",
  "LinkedIn": "linkedin.com",
  "Twitter": "x.com",
  "X": "x.com",
  "TikTok": "tiktok.com",
  "Pinterest": "pinterest.com",
  "Reddit": "reddit.com",
  "Snap": "snap.com",
  "Snapchat": "snap.com",
  "HubSpot": "hubspot.com",
  "Mailchimp": "mailchimp.com",
  "Zendesk": "zendesk.com",
  "Twilio": "twilio.com",
  "Datadog": "datadoghq.com",
  "Snowflake": "snowflake.com",
  "Palantir": "palantir.com",
  "Intuit": "intuit.com",
  "Square": "squareup.com",
  "Zoom": "zoom.us",
  "Dropbox": "dropbox.com",
  "DocuSign": "docusign.com",
  "Asana": "asana.com",
  "Monday.com": "monday.com",
  "Canva": "canva.com",
  "Webflow": "webflow.com",
  "Squarespace": "squarespace.com",
  "Wix": "wix.com",
  "Atlassian": "atlassian.com",
  "Jira": "atlassian.com",
  "GitHub": "github.com",
  "GitLab": "gitlab.com",

  // Finance & Consulting
  "SoFi": "sofi.com",
  "Deloitte": "deloitte.com",
  "McKinsey": "mckinsey.com",
  "McKinsey & Company": "mckinsey.com",
  "Accenture": "accenture.com",
  "PwC": "pwc.com",
  "PWC": "pwc.com",
  "PricewaterhouseCoopers": "pwc.com",
  "EY": "ey.com",
  "Ernst & Young": "ey.com",
  "KPMG": "kpmg.com",
  "Bain & Company": "bain.com",
  "BCG": "bcg.com",
  "Boston Consulting Group": "bcg.com",
  "Goldman Sachs": "goldmansachs.com",
  "JPMorgan": "jpmorgan.com",
  "JP Morgan": "jpmorgan.com",
  "JPMorgan Chase": "jpmorganchase.com",
  "Morgan Stanley": "morganstanley.com",
  "Citibank": "citigroup.com",
  "Citi": "citigroup.com",
  "American Express": "americanexpress.com",
  "Amex": "americanexpress.com",
  "Visa": "visa.com",
  "Mastercard": "mastercard.com",
  "PayPal": "paypal.com",
  "Coinbase": "coinbase.com",
  "Robinhood": "robinhood.com",
  "Binance": "binance.com",
  "Fidelity": "fidelity.com",
  "Charles Schwab": "schwab.com",
  "Vanguard": "vanguard.com",

  // Consumer & Retail
  "Nike": "nike.com",
  "Adidas": "adidas.com",
  "Puma": "puma.com",
  "New Balance": "newbalance.com",
  "Under Armour": "underarmour.com",
  "Lululemon": "lululemon.com",
  "Peloton": "onepeloton.com",
  "Coca-Cola": "coca-cola.com",
  "Pepsi": "pepsi.com",
  "McDonald's": "mcdonalds.com",
  "Starbucks": "starbucks.com",
  "Red Bull": "redbull.com",
  "Monster Energy": "monsterenergy.com",
  "Target": "target.com",
  "Walmart": "walmart.com",
  "Costco": "costco.com",
  "Home Depot": "homedepot.com",
  "Lowe's": "lowes.com",
  "IKEA": "ikea.com",
  "Sephora": "sephora.com",
  "Nordstrom": "nordstrom.com",
  "Zara": "zara.com",
  "H&M": "hm.com",

  // Food & Delivery
  "DoorDash": "doordash.com",
  "Instacart": "instacart.com",
  "Lyft": "lyft.com",
  "Grubhub": "grubhub.com",

  // Healthcare & Pharma
  "CVS": "cvs.com",
  "Walgreens": "walgreens.com",
  "Johnson & Johnson": "jnj.com",
  "J&J": "jnj.com",
  "Pfizer": "pfizer.com",
  "Moderna": "modernatx.com",
  "AstraZeneca": "astrazeneca.com",
  "Abbott": "abbott.com",
  "UnitedHealth": "unitedhealthgroup.com",

  // CPG & Beauty
  "Unilever": "unilever.com",
  "P&G": "pg.com",
  "Procter & Gamble": "pg.com",
  "L'Oréal": "loreal.com",
  "L'Oreal": "loreal.com",
  "Nestlé": "nestle.com",
  "Nestle": "nestle.com",
  "Colgate": "colgatepalmolive.com",
  "Dove": "dove.com",

  // Hardware & Semiconductors
  "Tesla": "tesla.com",
  "Samsung": "samsung.com",
  "Intel": "intel.com",
  "AMD": "amd.com",
  "Nvidia": "nvidia.com",
  "NVIDIA": "nvidia.com",
  "Cisco": "cisco.com",
  "Dell": "dell.com",
  "HP": "hp.com",
  "Lenovo": "lenovo.com",
  "General Electric": "ge.com",
  "GE": "ge.com",
  "Siemens": "siemens.com",
  "Qualcomm": "qualcomm.com",
  "Broadcom": "broadcom.com",

  // Telecom
  "Verizon": "verizon.com",
  "AT&T": "att.com",
  "T-Mobile": "t-mobile.com",
  "Comcast": "comcast.com",
  "Vodafone": "vodafone.com",

  // Theatre
  "National Theatre": "nationaltheatre.org.uk",
  "Royal Court": "royalcourttheatre.com",
  "Donmar Warehouse": "donmarwarehouse.com",
  "Old Vic": "oldvictheatre.com",
  "Young Vic": "youngvic.org",
  "Almeida Theatre": "almeida.co.uk",
  "Bush Theatre": "bushtheatre.co.uk",
  "Hampstead Theatre": "hampsteadtheatre.com",
  "Shakespeare's Globe": "shakespearesglobe.com",
  "RSC": "rsc.org.uk",
  "Royal Shakespeare Company": "rsc.org.uk",
  "Lincoln Center": "lincolncenter.org",
  "Manhattan Theatre Club": "mtc-nyc.org",
  "Roundabout Theatre": "roundabouttheatre.org",
  "The Public Theater": "publictheater.org",
  "Playwrights Horizons": "playwrightshorizons.org",

  // Publishers
  "Penguin Random House": "penguinrandomhouse.com",
  "HarperCollins": "harpercollins.com",
  "Simon & Schuster": "simonandschuster.com",
  "Hachette": "hachettebookgroup.com",
  "Macmillan": "macmillan.com",
  "Faber & Faber": "faber.co.uk",
  "Bloomsbury": "bloomsbury.com",
  "Vintage Books": "vintage-books.co.uk",
};

/**
 * SimpleIcons slug mapping for high-quality SVG logos
 * See: https://simpleicons.org/
 */
export const SIMPLE_ICONS_SLUGS: Record<string, string> = {
  // Studios & Streamers
  "Netflix": "netflix",
  "Amazon Studios": "amazon",
  "Amazon": "amazon",
  "Apple TV+": "appletv",
  "Apple": "apple",
  "Disney": "waltdisneyworld",
  "Disney+": "disneyplus",
  "Walt Disney": "waltdisneyworld",
  "Paramount+": "paramount",
  "Paramount": "paramount",
  "Hulu": "hulu",
  "HBO": "hbo",
  "HBO Max": "hbo",
  "Max": "hbo",
  "Sony": "sony",
  "Sony Pictures": "sony",

  // UK Broadcasters
  "BBC": "bbc",
  "BBC Studios": "bbc",
  "ITV": "itv",
  "Channel 4": "channel4",
  "Sky": "sky",

  // Publications & Media
  "The Guardian": "theguardian",
  "Guardian": "theguardian",
  "New York Times": "nytimes",
  "NYT": "nytimes",
  "The New York Times": "nytimes",
  "Washington Post": "washingtonpost",
  "Wired": "wired",
  "Forbes": "forbes",
  "Bloomberg": "bloomberg",
  "Vice": "vice",
  "BuzzFeed": "buzzfeed",
  "Rolling Stone": "rollingstone",

  // Tech & SaaS
  "Google": "google",
  "Meta": "meta",
  "Facebook": "facebook",
  "Microsoft": "microsoft",
  "Spotify": "spotify",
  "Airbnb": "airbnb",
  "Uber": "uber",
  "Slack": "slack",
  "Shopify": "shopify",
  "Stripe": "stripe",
  "Notion": "notion",
  "Figma": "figma",
  "Adobe": "adobe",
  "Salesforce": "salesforce",
  "Oracle": "oracle",
  "IBM": "ibm",
  "LinkedIn": "linkedin",
  "Twitter": "x",
  "X": "x",
  "TikTok": "tiktok",
  "Pinterest": "pinterest",
  "Reddit": "reddit",
  "Snap": "snapchat",
  "Snapchat": "snapchat",
  "HubSpot": "hubspot",
  "Mailchimp": "mailchimp",
  "Zendesk": "zendesk",
  "Twilio": "twilio",
  "Datadog": "datadog",
  "Snowflake": "snowflake",
  "Zoom": "zoom",
  "Dropbox": "dropbox",
  "Asana": "asana",
  "Canva": "canva",
  "Webflow": "webflow",
  "Squarespace": "squarespace",
  "Wix": "wix",
  "Atlassian": "atlassian",
  "Jira": "jira",
  "GitHub": "github",
  "GitLab": "gitlab",

  // Finance & Consulting
  "Deloitte": "deloitte",
  "Accenture": "accenture",
  "Goldman Sachs": "goldmansachs",
  "Visa": "visa",
  "Mastercard": "mastercard",
  "PayPal": "paypal",
  "Coinbase": "coinbase",
  "Robinhood": "robinhood",
  "Binance": "binance",

  // Consumer & Retail
  "Nike": "nike",
  "Adidas": "adidas",
  "Puma": "puma",
  "New Balance": "newbalance",
  "Under Armour": "underarmour",
  "Lululemon": "lululemon",
  "Coca-Cola": "cocacola",
  "Pepsi": "pepsi",
  "McDonald's": "mcdonalds",
  "Starbucks": "starbucks",
  "Red Bull": "redbull",
  "IKEA": "ikea",
  "Zara": "zara",

  // Food & Delivery
  "DoorDash": "doordash",
  "Instacart": "instacart",
  "Lyft": "lyft",
  "Grubhub": "grubhub",

  // Hardware & Semiconductors
  "Tesla": "tesla",
  "Samsung": "samsung",
  "Intel": "intel",
  "AMD": "amd",
  "Nvidia": "nvidia",
  "NVIDIA": "nvidia",
  "Cisco": "cisco",
  "Dell": "dell",
  "Lenovo": "lenovo",
  "Siemens": "siemens",
  "Qualcomm": "qualcomm",

  // Telecom
  "Verizon": "verizon",
  "T-Mobile": "tmobile",
  "Vodafone": "vodafone",
};

export type LogoColorMode = 'original' | 'grayscale' | 'white' | 'dark' | 'theme';

/**
 * Get the SimpleIcons slug for a company name
 */
export function getSimpleIconSlug(companyName: string): string | null {
  return SIMPLE_ICONS_SLUGS[companyName] || null;
}

/**
 * Get SimpleIcons CDN URL with optional color
 * Color can be a hex (without #) or named color like "white"
 */
export function getSimpleIconUrl(slug: string, color?: string): string {
  const base = `https://cdn.simpleicons.org/${slug}`;
  return color ? `${base}/${color}` : base;
}

/**
 * Get the domain for a company name (exported for fallback logic)
 */
export function getCompanyDomain(companyName: string): string {
  const domain = COMPANY_DOMAINS[companyName];
  if (domain) return domain;
  return companyName.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";
}

/**
 * Get primary logo URL — tries SimpleIcons first, falls back to Hunter.io
 */
export function getCompanyLogoUrl(companyName: string, _size = 200): string {
  const slug = getSimpleIconSlug(companyName);
  if (slug) return getSimpleIconUrl(slug);
  const domain = getCompanyDomain(companyName);
  return `https://logos.hunter.io/${domain}`;
}

/**
 * Get logo URL with color mode applied (for SimpleIcons)
 */
export function getCompanyLogoUrlWithColor(
  companyName: string,
  colorMode: LogoColorMode = 'original',
  themeAccentHex?: string
): { url: string; isSimpleIcon: boolean } {
  const slug = getSimpleIconSlug(companyName);

  if (slug) {
    let color: string | undefined;
    switch (colorMode) {
      case 'white': color = 'white'; break;
      case 'dark': color = '000000'; break;
      case 'grayscale': color = '999999'; break;
      case 'theme': color = themeAccentHex?.replace('#', '') || undefined; break;
      case 'original': default: color = undefined; break;
    }
    return { url: getSimpleIconUrl(slug, color), isSimpleIcon: true };
  }

  // Fallback to Hunter.io (no native color control)
  const domain = getCompanyDomain(companyName);
  return { url: `https://logos.hunter.io/${domain}`, isSimpleIcon: false };
}

/**
 * Get fallback favicon URL via Google (high-res)
 */
export function getFaviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Try SimpleIcons first, then Hunter.io, fall back to Google favicon
 */
export async function fetchCompanyLogo(
  companyName: string
): Promise<{ url: string; source: "simpleicon" | "hunter" | "google_favicon" | "none" }> {
  const slug = getSimpleIconSlug(companyName);
  if (slug) {
    const siUrl = getSimpleIconUrl(slug);
    try {
      const res = await fetch(siUrl, { method: "HEAD" });
      if (res.ok) return { url: siUrl, source: "simpleicon" };
    } catch {}
  }

  const domain = getCompanyDomain(companyName);
  const hunterUrl = `https://logos.hunter.io/${domain}`;
  try {
    const res = await fetch(hunterUrl, { method: "HEAD" });
    if (res.ok) return { url: hunterUrl, source: "hunter" };
  } catch {}

  return { url: getFaviconUrl(domain), source: "google_favicon" };
}
