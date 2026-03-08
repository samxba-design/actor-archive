import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Briefcase, CheckCircle2 } from "lucide-react";
import type { OnboardingData } from "@/pages/Onboarding";

interface Props {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ServiceSuggestion {
  name: string;
  description: string;
}

const SERVICE_SUGGESTIONS: Record<string, ServiceSuggestion[]> = {
  screenwriter: [
    { name: "Script Coverage", description: "Professional feedback on screenplays with detailed notes and scoring" },
    { name: "Script Doctoring", description: "Rewriting and polishing existing scripts to improve structure and dialogue" },
    { name: "Ghostwriting", description: "Write screenplays or teleplays on behalf of clients" },
    { name: "Adaptation", description: "Adapt books, articles, or IP into screenplay format" },
    { name: "Logline & Synopsis", description: "Craft compelling loglines and synopses for pitching" },
  ],
  tv_writer: [
    { name: "Spec Script Writing", description: "Write spec episodes for existing shows to showcase your voice" },
    { name: "Series Bible Development", description: "Create comprehensive series bibles for original TV concepts" },
    { name: "Script Coverage", description: "Professional feedback on TV pilots and episodes" },
    { name: "Story Room Consulting", description: "Freelance story consulting for writers rooms" },
  ],
  playwright: [
    { name: "Script Coverage", description: "Dramaturgical feedback on stage plays" },
    { name: "Commissioned Plays", description: "Write original plays for theatre companies or festivals" },
    { name: "Adaptation", description: "Adapt novels, films, or stories for the stage" },
    { name: "Workshop Facilitation", description: "Lead playwriting workshops and masterclasses" },
  ],
  author: [
    { name: "Manuscript Editing", description: "Developmental and line editing for novels and non-fiction" },
    { name: "Ghostwriting", description: "Write books on behalf of clients across genres" },
    { name: "Book Coaching", description: "One-on-one mentoring for aspiring authors" },
    { name: "Beta Reading", description: "Detailed feedback on unpublished manuscripts" },
  ],
  journalist: [
    { name: "Freelance Articles", description: "Commission articles, features, and investigative pieces" },
    { name: "Content Strategy", description: "Editorial planning and content calendar development" },
    { name: "Fact-Checking", description: "Research verification and fact-checking services" },
    { name: "Interviewing", description: "Professional interview and profile writing" },
  ],
  copywriter: [
    { name: "Web Copy", description: "Website copy that converts — landing pages, about pages, CTAs" },
    { name: "Email Campaigns", description: "Email sequences, newsletters, and drip campaigns" },
    { name: "SEO Content", description: "Search-optimized blog posts and articles" },
    { name: "Brand Messaging", description: "Brand voice guidelines, taglines, and positioning" },
    { name: "Ad Copy", description: "Social media ads, Google Ads, and display advertising copy" },
  ],
  actor: [
    { name: "Self-Tape Service", description: "Professional self-tape recording and editing" },
    { name: "Private Coaching", description: "One-on-one acting coaching sessions" },
    { name: "Audition Prep", description: "Scene study and audition preparation" },
    { name: "Dialect Coaching", description: "Accent and dialect training for roles" },
  ],
  director_producer: [
    { name: "Music Video Direction", description: "Direct music videos from concept to final cut" },
    { name: "Commercial Production", description: "End-to-end commercial and branded content production" },
    { name: "Short Film Production", description: "Produce or direct short films for festivals" },
    { name: "Production Consulting", description: "Line producing, budgeting, and scheduling consultation" },
  ],
  corporate_video: [
    { name: "Corporate Video Production", description: "Internal comms, training, and brand videos" },
    { name: "Event Coverage", description: "Multi-camera live event filming and editing" },
    { name: "Motion Graphics", description: "Animated explainers and motion design" },
    { name: "Social Media Video", description: "Short-form video content for social platforms" },
  ],
  multi_hyphenate: [
    { name: "Creative Consulting", description: "Multi-disciplinary creative strategy and guidance" },
    { name: "Content Creation", description: "End-to-end content across mediums" },
    { name: "Workshops & Masterclasses", description: "Teaching across your areas of expertise" },
  ],
};

export interface SelectedService {
  name: string;
  description: string;
  enabled: boolean;
  isCustom?: boolean;
}

const StepServices = ({ data, updateData, onNext, onBack }: Props) => {
  const profileType = data.profileType || "screenwriter";
  const suggestions = SERVICE_SUGGESTIONS[profileType] || SERVICE_SUGGESTIONS.multi_hyphenate;

  const [services, setServices] = useState<SelectedService[]>(
    suggestions.map((s) => ({ ...s, enabled: false }))
  );
  const [customName, setCustomName] = useState("");
  const [availableForHire, setAvailableForHire] = useState(data.availableForHire ?? false);

  const toggleService = (index: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const addCustomService = () => {
    if (!customName.trim()) return;
    setServices((prev) => [
      ...prev,
      { name: customName.trim(), description: "Custom service", enabled: true, isCustom: true },
    ]);
    setCustomName("");
  };

  const removeCustom = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const enabled = services.filter((s) => s.enabled);
    updateData({
      selectedServices: enabled.map((s) => ({ name: s.name, description: s.description })),
      availableForHire,
    });
    onNext();
  };

  const enabledCount = services.filter((s) => s.enabled).length;

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Services & Availability</h2>
        <p className="text-muted-foreground">
          Select services you offer — these appear on your portfolio so visitors know what you do.
        </p>
      </div>

      {/* Available for hire toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Available for Hire</Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Shows a prominent badge on your portfolio so people know you're open to work
            </p>
          </div>
          <Switch checked={availableForHire} onCheckedChange={setAvailableForHire} />
        </div>
      </Card>

      {/* Service suggestions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Suggested for {profileType.replace(/_/g, " ")}s
        </Label>
        {services.map((service, i) => (
          <Card
            key={i}
            className={`p-4 cursor-pointer transition-all border-2 ${
              service.enabled
                ? "border-primary bg-primary/5"
                : "border-transparent hover:border-border"
            }`}
            onClick={() => !service.isCustom && toggleService(i)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{service.name}</span>
                  {service.isCustom && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Custom</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {service.isCustom && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => { e.stopPropagation(); removeCustom(i); }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
                {service.enabled ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add custom service */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a custom service..."
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomService()}
        />
        <Button variant="outline" size="icon" onClick={addCustomService} disabled={!customName.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <div className="flex items-center gap-3">
          {enabledCount > 0 && (
            <span className="text-sm text-muted-foreground">{enabledCount} selected</span>
          )}
          <Button onClick={handleNext}>
            {enabledCount > 0 ? "Continue" : "Skip for now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepServices;
