import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, RotateCcw, Image, User, FileText, Award, MessageSquare, Newspaper, Building2, GraduationCap, Clapperboard } from "lucide-react";
import { saveDemoOverride, resetDemoOverride } from "@/hooks/useDemoData";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import * as screenwriterData from "@/data/demoScreenwriterData";
import * as actorData from "@/data/demoActorData";
import * as copywriterData from "@/data/demoCopywriterData";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type ProfileType = "screenwriter" | "actor" | "copywriter";

interface DemoOverrides {
  mockProfile?: Record<string, any>;
  mockSocialLinks?: any[];
  mockCredits?: any[];
  mockAwards?: any[];
  mockPress?: any[];
  mockTestimonials?: any[];
  mockServices?: any[];
  mockClients?: string[];
  mockEducation?: any[];
  mockSkills?: any[];
  mockGallery?: any[];
  mockDemoReels?: any[];
  mockEvents?: any[];
  mockRepresentation?: any[];
  mockLoglines?: any[];
  mockScripts?: any[];
  mockProductions?: any[];
  mockCaseStudies?: any[];
  mockPublishedWork?: any[];
  mockActorStats?: Record<string, any>;
}

const SECTION_ICONS: Record<string, any> = {
  profile: User,
  credits: Clapperboard,
  awards: Award,
  testimonials: MessageSquare,
  press: Newspaper,
  clients: Building2,
  education: GraduationCap,
  gallery: Image,
};

function ArrayJsonEditor({ label, icon: Icon, value, onChange }: { label: string; icon?: any; value: any[]; onChange: (v: any[]) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("Must be an array");
      onChange(parsed);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between text-xs">
          <span className="flex items-center gap-1.5">
            {Icon && <Icon className="h-3 w-3" />}
            {label} ({value.length} items)
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          rows={Math.min(20, Math.max(5, text.split("\n").length))}
          className="font-mono text-xs"
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ObjectJsonEditor({ label, value, onChange }: { label: string; value: Record<string, any>; onChange: (v: Record<string, any>) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Must be an object");
      onChange(parsed);
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between text-xs">
          <span className="flex items-center gap-1.5">{label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          rows={Math.min(20, Math.max(5, text.split("\n").length))}
          className="font-mono text-xs"
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ImagePreviewField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="flex-1 text-xs" />
        {value && (
          <div className="w-10 h-10 rounded border border-border overflow-hidden shrink-0 bg-muted">
            <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileEditor({ type, overrides, onChange }: { type: ProfileType; overrides: DemoOverrides; onChange: (o: DemoOverrides) => void }) {
  const profile = overrides.mockProfile || {};

  const updateProfile = (key: string, value: any) => {
    onChange({ ...overrides, mockProfile: { ...profile, [key]: value } });
  };

  const updateArray = (key: keyof DemoOverrides, value: any[]) => {
    onChange({ ...overrides, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" /> Profile Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Display Name</Label>
              <Input value={profile.display_name || ""} onChange={(e) => updateProfile("display_name", e.target.value)} className="text-xs" />
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Input value={profile.location || ""} onChange={(e) => updateProfile("location", e.target.value)} className="text-xs" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Tagline</Label>
            <Input value={profile.tagline || ""} onChange={(e) => updateProfile("tagline", e.target.value)} className="text-xs" />
          </div>
          <div>
            <Label className="text-xs">Bio</Label>
            <Textarea value={profile.bio || ""} onChange={(e) => updateProfile("bio", e.target.value)} rows={4} className="text-xs" />
          </div>
          <ImagePreviewField label="Profile Photo URL" value={profile.profile_photo_url || ""} onChange={(v) => updateProfile("profile_photo_url", v)} />
          <ImagePreviewField label="Banner URL" value={profile.banner_url || ""} onChange={(v) => updateProfile("banner_url", v)} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">CTA Label</Label>
              <Input value={profile.cta_label || ""} onChange={(e) => updateProfile("cta_label", e.target.value)} className="text-xs" />
            </div>
            <div>
              <Label className="text-xs">CTA URL</Label>
              <Input value={profile.cta_url || ""} onChange={(e) => updateProfile("cta_url", e.target.value)} className="text-xs" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Data Editors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Section Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {overrides.mockCredits !== undefined && (
            <ArrayJsonEditor label="Credits / Projects" icon={Clapperboard} value={overrides.mockCredits || []} onChange={(v) => updateArray("mockCredits", v)} />
          )}
          {type === "screenwriter" && (
            <>
              <ArrayJsonEditor label="Loglines" icon={FileText} value={overrides.mockLoglines || []} onChange={(v) => updateArray("mockLoglines", v)} />
              <ArrayJsonEditor label="Scripts" icon={FileText} value={overrides.mockScripts || []} onChange={(v) => updateArray("mockScripts", v)} />
              <ArrayJsonEditor label="Productions" icon={Clapperboard} value={overrides.mockProductions || []} onChange={(v) => updateArray("mockProductions", v)} />
            </>
          )}
          {type === "copywriter" && (
            <>
              <ArrayJsonEditor label="Case Studies" icon={FileText} value={overrides.mockCaseStudies || []} onChange={(v) => updateArray("mockCaseStudies", v)} />
              <ArrayJsonEditor label="Published Work" icon={FileText} value={overrides.mockPublishedWork || []} onChange={(v) => updateArray("mockPublishedWork", v)} />
            </>
          )}
          {type === "actor" && overrides.mockActorStats && (
            <ObjectJsonEditor label="Actor Stats" value={overrides.mockActorStats || {}} onChange={(v) => onChange({ ...overrides, mockActorStats: v })} />
          )}
          <ArrayJsonEditor label="Awards" icon={Award} value={overrides.mockAwards || []} onChange={(v) => updateArray("mockAwards", v)} />
          <ArrayJsonEditor label="Testimonials" icon={MessageSquare} value={overrides.mockTestimonials || []} onChange={(v) => updateArray("mockTestimonials", v)} />
          <ArrayJsonEditor label="Press" icon={Newspaper} value={overrides.mockPress || []} onChange={(v) => updateArray("mockPress", v)} />
          <ArrayJsonEditor label="Services" icon={FileText} value={overrides.mockServices || []} onChange={(v) => updateArray("mockServices", v)} />
          <ArrayJsonEditor label="Education" icon={GraduationCap} value={overrides.mockEducation || []} onChange={(v) => updateArray("mockEducation", v)} />
          <ArrayJsonEditor label="Skills" icon={FileText} value={overrides.mockSkills || []} onChange={(v) => updateArray("mockSkills", v)} />
          <ArrayJsonEditor label="Gallery" icon={Image} value={overrides.mockGallery || []} onChange={(v) => updateArray("mockGallery", v)} />
          {overrides.mockDemoReels !== undefined && (
            <ArrayJsonEditor label="Demo Reels" icon={Clapperboard} value={overrides.mockDemoReels || []} onChange={(v) => updateArray("mockDemoReels", v)} />
          )}
          {overrides.mockEvents !== undefined && (
            <ArrayJsonEditor label="Events" icon={FileText} value={overrides.mockEvents || []} onChange={(v) => updateArray("mockEvents", v)} />
          )}
          <ArrayJsonEditor label="Social Links" icon={FileText} value={overrides.mockSocialLinks || []} onChange={(v) => updateArray("mockSocialLinks", v)} />
          <ArrayJsonEditor label="Representation" icon={Building2} value={overrides.mockRepresentation || []} onChange={(v) => updateArray("mockRepresentation", v)} />
        </CardContent>
      </Card>

      {/* Clients (simple string array) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4" /> Client Logos</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-xs">Company names (comma-separated)</Label>
          <Input
            value={(overrides.mockClients || []).join(", ")}
            onChange={(e) => onChange({ ...overrides, mockClients: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="Netflix, HBO, A24"
            className="text-xs mt-1"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function getDefaultOverrides(type: ProfileType): DemoOverrides {
  const defaults = type === "screenwriter"
    ? require("@/data/demoScreenwriterData")
    : type === "actor"
    ? require("@/data/demoActorData")
    : require("@/data/demoCopywriterData");

  const base: DemoOverrides = {
    mockProfile: { ...defaults.mockProfile },
    mockSocialLinks: [...defaults.mockSocialLinks],
    mockAwards: [...defaults.mockAwards],
    mockPress: [...defaults.mockPress],
    mockTestimonials: [...defaults.mockTestimonials],
    mockClients: [...defaults.mockClients],
    mockEducation: [...defaults.mockEducation],
    mockSkills: [...defaults.mockSkills],
  };

  if (defaults.mockCredits) base.mockCredits = [...defaults.mockCredits];
  if (defaults.mockServices) base.mockServices = [...defaults.mockServices];
  if (defaults.mockGallery) base.mockGallery = [...defaults.mockGallery];
  if (defaults.mockDemoReels) base.mockDemoReels = [...defaults.mockDemoReels];
  if (defaults.mockEvents) base.mockEvents = [...defaults.mockEvents];
  if (defaults.mockRepresentation) base.mockRepresentation = [...defaults.mockRepresentation];
  if (defaults.mockLoglines) base.mockLoglines = [...defaults.mockLoglines];
  if (defaults.mockScripts) base.mockScripts = [...defaults.mockScripts];
  if (defaults.mockProductions) base.mockProductions = [...defaults.mockProductions];
  if (defaults.mockCaseStudies) base.mockCaseStudies = [...defaults.mockCaseStudies];
  if (defaults.mockPublishedWork) base.mockPublishedWork = [...defaults.mockPublishedWork];
  if (defaults.mockActorStats) base.mockActorStats = { ...defaults.mockActorStats };

  return base;
}

const AdminDemoProfiles = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileType>("screenwriter");
  const [overrides, setOverrides] = useState<Record<ProfileType, DemoOverrides>>({
    screenwriter: getDefaultOverrides("screenwriter"),
    actor: getDefaultOverrides("actor"),
    copywriter: getDefaultOverrides("copywriter"),
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load existing overrides
  useEffect(() => {
    (async () => {
      const keys = ["demo_screenwriter", "demo_actor", "demo_copywriter"];
      const { data } = await supabase
        .from("platform_settings")
        .select("key, value")
        .in("key", keys);

      if (data) {
        const newOverrides = { ...overrides };
        for (const row of data) {
          const type = row.key.replace("demo_", "") as ProfileType;
          if (row.value && typeof row.value === "object") {
            newOverrides[type] = { ...getDefaultOverrides(type), ...(row.value as DemoOverrides) };
          }
        }
        setOverrides(newOverrides);
      }
      setLoaded(true);
    })();
  }, []);

  const handleSave = async (type: ProfileType) => {
    setSaving(true);
    const { error } = await saveDemoOverride(type, overrides[type]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `${type} demo profile updated.` });
    }
    setSaving(false);
  };

  const handleReset = async (type: ProfileType) => {
    setSaving(true);
    const { error } = await resetDemoOverride(type);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOverrides(prev => ({ ...prev, [type]: getDefaultOverrides(type) }));
      toast({ title: "Reset", description: `${type} demo profile reverted to defaults.` });
    }
    setSaving(false);
  };

  if (!loaded) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demo Profiles</h1>
        <p className="text-sm text-muted-foreground">Customize the content displayed on public demo pages. Changes are saved to the database and override hardcoded defaults.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProfileType)}>
        <TabsList>
          <TabsTrigger value="screenwriter">Screenwriter</TabsTrigger>
          <TabsTrigger value="actor">Actor</TabsTrigger>
          <TabsTrigger value="copywriter">Copywriter</TabsTrigger>
        </TabsList>

        {(["screenwriter", "actor", "copywriter"] as ProfileType[]).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="flex items-center gap-2 mb-4">
              <Button onClick={() => handleSave(type)} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save {type}
              </Button>
              <Button variant="outline" onClick={() => handleReset(type)} disabled={saving}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <a href={`/demo/${type === "screenwriter" ? "" : type}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-auto">
                Preview →
              </a>
            </div>
            <ProfileEditor
              type={type}
              overrides={overrides[type]}
              onChange={(o) => setOverrides(prev => ({ ...prev, [type]: o }))}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminDemoProfiles;
