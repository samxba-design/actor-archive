import { useState } from "react";
import { usePortfolioTheme } from "@/themes/ThemeProvider";
import GlassCard from "@/components/portfolio/GlassCard";
import SectionPublishedWork from "./SectionPublishedWork";
import { FolderOpen, ChevronDown, ChevronUp } from "lucide-react";

interface PublishedWorkItem {
  id: string;
  title: string;
  summary?: string | null;
  cover_image_url?: string | null;
  pdf_thumbnail_url?: string | null;
  pdf_url?: string | null;
  article_url?: string | null;
  category?: string | null;
  publication?: string | null;
  date?: string | null;
  read_time?: string | null;
  is_featured?: boolean | null;
  show_text_overlay?: boolean | null;
  collection_id?: string | null;
}

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  cover_image_url?: string | null;
  is_expanded_default?: boolean | null;
}

interface Props {
  collections: Collection[];
  works: PublishedWorkItem[];
  variant?: "grid" | "accordion" | "tabs";
}

const SectionCollections = ({ collections, works, variant = "grid" }: Props) => {
  const theme = usePortfolioTheme();
  const [expandedId, setExpandedId] = useState<string | null>(
    collections.find(c => c.is_expanded_default)?.id || null
  );
  const [activeTab, setActiveTab] = useState<string>(collections[0]?.id || "uncollected");

  const uncollectedWorks = works.filter(w => !w.collection_id);
  const getWorksForCollection = (collectionId: string) => works.filter(w => w.collection_id === collectionId);

  if (variant === "tabs") {
    const tabs = [
      ...collections.map(c => ({ id: c.id, label: c.name, count: getWorksForCollection(c.id).length })),
      ...(uncollectedWorks.length > 0 ? [{ id: "uncollected", label: "Other", count: uncollectedWorks.length }] : []),
    ];

    const activeWorks = activeTab === "uncollected" ? uncollectedWorks : getWorksForCollection(activeTab);

    return (
      <div>
        <div className="flex gap-1 overflow-x-auto pb-3 mb-6 border-b" style={{ borderColor: theme.borderDefault }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? theme.accentPrimary : "transparent",
                color: activeTab === tab.id ? theme.textOnAccent : theme.textSecondary,
              }}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
        {activeWorks.length > 0 ? (
          <SectionPublishedWork items={activeWorks} />
        ) : (
          <p className="text-sm text-center py-8" style={{ color: theme.textTertiary }}>No pieces in this collection yet.</p>
        )}
      </div>
    );
  }

  if (variant === "accordion") {
    return (
      <div className="space-y-2">
        {collections.map(collection => {
          const collectionWorks = getWorksForCollection(collection.id);
          const isOpen = expandedId === collection.id;
          return (
            <GlassCard key={collection.id} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : collection.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
              >
                {collection.cover_image_url ? (
                  <img src={collection.cover_image_url} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.accentPrimary}15` }}>
                    <FolderOpen className="h-5 w-5" style={{ color: theme.accentPrimary }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ fontFamily: theme.fontDisplay, color: isOpen ? theme.accentPrimary : theme.textPrimary }}>
                    {collection.name}
                  </h3>
                  <p className="text-xs" style={{ color: theme.textTertiary }}>
                    {collectionWorks.length} piece{collectionWorks.length !== 1 ? "s" : ""}
                    {collection.description ? ` · ${collection.description}` : ""}
                  </p>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: theme.textTertiary }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: theme.textTertiary }} />}
              </button>
              <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? "2000px" : "0", opacity: isOpen ? 1 : 0 }}>
                <div className="px-5 pb-5">
                  {collectionWorks.length > 0 ? (
                    <SectionPublishedWork items={collectionWorks} />
                  ) : (
                    <p className="text-sm py-4" style={{ color: theme.textTertiary }}>No pieces in this collection yet.</p>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
        {uncollectedWorks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: theme.textSecondary }}>Other Work</h3>
            <SectionPublishedWork items={uncollectedWorks} />
          </div>
        )}
      </div>
    );
  }

  // Default: grid variant — show collection cards, click to expand
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {collections.map(collection => {
          const collectionWorks = getWorksForCollection(collection.id);
          const isOpen = expandedId === collection.id;
          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => setExpandedId(isOpen ? null : collection.id)}
              className="text-left rounded-xl overflow-hidden transition-all hover:scale-[1.01] group border"
              style={{
                borderColor: isOpen ? theme.accentPrimary : theme.borderDefault,
                boxShadow: isOpen ? `0 0 0 1px ${theme.accentPrimary}` : undefined,
              }}
            >
              {collection.cover_image_url ? (
                <div className="h-32 w-full overflow-hidden relative">
                  <img src={collection.cover_image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-sm" style={{ fontFamily: theme.fontDisplay }}>{collection.name}</h3>
                    <p className="text-xs text-white/70">{collectionWorks.length} piece{collectionWorks.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex items-center gap-3" style={{ backgroundColor: theme.bgElevated }}>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${theme.accentPrimary}15` }}>
                    <FolderOpen className="h-6 w-6" style={{ color: theme.accentPrimary }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm" style={{ fontFamily: theme.fontDisplay, color: theme.textPrimary }}>{collection.name}</h3>
                    <p className="text-xs" style={{ color: theme.textTertiary }}>
                      {collectionWorks.length} piece{collectionWorks.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded collection content */}
      {expandedId && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: theme.accentPrimary }}>
              {collections.find(c => c.id === expandedId)?.name}
            </h3>
            <button onClick={() => setExpandedId(null)} className="text-xs underline" style={{ color: theme.textTertiary }}>Close</button>
          </div>
          {getWorksForCollection(expandedId).length > 0 ? (
            <SectionPublishedWork items={getWorksForCollection(expandedId)} />
          ) : (
            <p className="text-sm py-4" style={{ color: theme.textTertiary }}>No pieces in this collection yet.</p>
          )}
        </div>
      )}

      {/* Uncollected works */}
      {uncollectedWorks.length > 0 && (
        <div>
          {collections.length > 0 && (
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: theme.textSecondary }}>Other Work</h3>
          )}
          <SectionPublishedWork items={uncollectedWorks} />
        </div>
      )}
    </div>
  );
};

export default SectionCollections;
