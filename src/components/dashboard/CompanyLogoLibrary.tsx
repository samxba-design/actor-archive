import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, Plus } from "lucide-react";
import { COMPANY_DOMAINS, getCompanyLogoUrl } from "@/lib/companyLogos";

// Deduplicate by domain to get unique companies
const UNIQUE_COMPANIES = Object.entries(COMPANY_DOMAINS).reduce<{ name: string; domain: string }[]>((acc, [name, domain]) => {
  if (!acc.find(c => c.domain === domain)) {
    acc.push({ name, domain });
  }
  return acc;
}, []).sort((a, b) => a.name.localeCompare(b.name));

const CATEGORIES: Record<string, string[]> = {
  "Studios & Streamers": ["netflix.com", "studios.amazon.com", "apple.com", "disney.com", "paramount.com", "warnerbros.com", "universalpictures.com", "sonypictures.com", "lionsgate.com", "a24films.com", "hbo.com", "hulu.com", "mgm.com"],
  "Talent Agencies": ["caa.com", "wmeagency.com", "unitedtalent.com", "icmpartners.com", "apa-agency.com", "gershagency.com", "curtisbrown.co.uk", "unitedagents.co.uk", "independenttalent.com"],
  "Tech": ["google.com", "meta.com", "microsoft.com", "apple.com", "amazon.com", "spotify.com", "airbnb.com", "stripe.com", "shopify.com", "adobe.com", "figma.com", "notion.so"],
  "Publications": ["variety.com", "deadline.com", "hollywoodreporter.com", "nytimes.com", "vogue.com", "forbes.com", "wired.com", "vanityfair.com", "rollingstone.com"],
  "Finance": ["goldmansachs.com", "jpmorgan.com", "deloitte.com", "mckinsey.com", "accenture.com", "pwc.com", "visa.com", "mastercard.com"],
  "Consumer Brands": ["nike.com", "coca-cola.com", "starbucks.com", "redbull.com", "ikea.com", "tesla.com", "samsung.com"],
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCompanies: string[];
  onAddCompany: (name: string, logoUrl: string) => void;
}

const CompanyLogoLibrary = ({ open, onOpenChange, existingCompanies, onAddCompany }: Props) => {
  const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return UNIQUE_COMPANIES;
    const q = search.toLowerCase();
    return UNIQUE_COMPANIES.filter(c => c.name.toLowerCase().includes(q));
  }, [search]);

  const isAdded = (name: string) => existingCompanies.some(c => c.toLowerCase() === name.toLowerCase()) || addedIds.has(name);

  const handleAdd = (company: { name: string; domain: string }) => {
    if (isAdded(company.name)) return;
    const logoUrl = getCompanyLogoUrl(company.name);
    onAddCompany(company.name, logoUrl);
    setAddedIds(prev => new Set([...prev, company.name]));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Browse Company Logos</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 200+ companies..."
            className="pl-9"
          />
        </div>
        <div className="overflow-y-auto flex-1 -mx-2 px-2 space-y-6">
          {/* Recently used / already added */}
          {existingCompanies.length > 0 && !search.trim() && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Recently Added</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {existingCompanies.slice(0, 10).map((name) => {
                  const company = UNIQUE_COMPANIES.find(c => c.name.toLowerCase() === name.toLowerCase());
                  if (!company) return null;
                  return <CompanyCard key={"recent-" + name} company={company} added onAdd={() => {}} />;
                })}
              </div>
            </div>
          )}
          {search.trim() ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {filtered.map((company) => (
                <CompanyCard key={company.domain + company.name} company={company} added={isAdded(company.name)} onAdd={() => handleAdd(company)} />
              ))}
              {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">No companies match "{search}"</p>}
            </div>
          ) : (
            Object.entries(CATEGORIES).map(([category, domains]) => {
              const companies = UNIQUE_COMPANIES.filter(c => domains.includes(c.domain));
              if (companies.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{category}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {companies.map((company) => (
                      <CompanyCard key={company.domain + company.name} company={company} added={isAdded(company.name)} onAdd={() => handleAdd(company)} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CompanyCard = ({ company, added, onAdd }: { company: { name: string; domain: string }; added: boolean; onAdd: () => void }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={onAdd}
      disabled={added}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center ${
        added
          ? "border-primary/30 bg-primary/5 opacity-60"
          : "border-border hover:border-primary/40 hover:bg-accent/50 cursor-pointer"
      }`}
    >
      <div className="w-10 h-10 rounded bg-white flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={getCompanyLogoUrl(company.name, 80)}
            alt={company.name}
            className="max-w-full max-h-full object-contain p-0.5"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[10px] font-bold text-muted-foreground">{company.name.slice(0, 2)}</span>
        )}
      </div>
      <span className="text-[10px] font-medium text-foreground truncate w-full">{company.name}</span>
      {added && (
        <div className="absolute top-1 right-1">
          <Check className="h-3 w-3 text-primary" />
        </div>
      )}
    </button>
  );
};

export default CompanyLogoLibrary;
