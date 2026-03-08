// Company domain mapping for Clearbit logo auto-fetch
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

  // Brands (for copywriter clients)
  "Nike": "nike.com",
  "Adidas": "adidas.com",
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
  "Coca-Cola": "coca-cola.com",
  "Pepsi": "pepsi.com",
  "McDonald's": "mcdonalds.com",
  "Starbucks": "starbucks.com",
  "Tesla": "tesla.com",
  "Samsung": "samsung.com",
  "IBM": "ibm.com",
  "Oracle": "oracle.com",
  "Salesforce": "salesforce.com",
  "Adobe": "adobe.com",
  "Binance": "binance.com",

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
 * Get logo URL for a company using Clearbit, with Google Favicon fallback
 */
export function getCompanyLogoUrl(companyName: string, size = 200): string {
  const domain = COMPANY_DOMAINS[companyName];
  if (domain) {
    return `https://logo.clearbit.com/${domain}?size=${size}`;
  }
  // Try to guess domain from company name
  const guessedDomain = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    + ".com";
  return `https://logo.clearbit.com/${guessedDomain}?size=${size}`;
}

/**
 * Get fallback favicon URL via Google
 */
export function getFaviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Try Clearbit first, fall back to Google favicon
 */
export async function fetchCompanyLogo(
  companyName: string
): Promise<{ url: string; source: "clearbit" | "google_favicon" | "none" }> {
  const domain = COMPANY_DOMAINS[companyName];
  
  if (domain) {
    const clearbitUrl = `https://logo.clearbit.com/${domain}?size=200`;
    try {
      const res = await fetch(clearbitUrl, { method: "HEAD" });
      if (res.ok) {
        return { url: clearbitUrl, source: "clearbit" };
      }
    } catch {}
    
    return { url: getFaviconUrl(domain), source: "google_favicon" };
  }

  return { url: "", source: "none" };
}
