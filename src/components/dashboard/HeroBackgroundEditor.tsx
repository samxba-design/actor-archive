import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageOff, Upload, Check, X, Minimize2, Maximize2 } from "lucide-react";

const PRESET_BACKGROUNDS = [
  { id: "cinematic-dark", label: "Cinematic Dark", gradient: "linear-gradient(135deg, #1a0a0f 0%, #2d1520 40%, #0d0d1a 100%)" },
  { id: "noir-smoke", label: "Noir Smoke", gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)" },
  { id: "golden-hour", label: "Golden Hour", gradient: "linear-gradient(135deg, #2d1b00 0%, #4a2c17 40%, #1a0e05 100%)" },
  { id: "ocean-deep", label: "Ocean Deep", gradient: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #0d1421 100%)" },
  { id: "forest-mist", label: "Forest Mist", gradient: "linear-gradient(135deg, #0b1a0b 0%, #1a2f1a 40%, #0d1a0d 100%)" },
  { id: "warm-clay", label: "Warm Clay", gradient: "linear-gradient(135deg, #2c1810 0%, #3d2419 40%, #1a0f0a 100%)" },
  { id: "arctic-light", label: "Arctic Light", gradient: "linear-gradient(135deg, #e8edf2 0%, #d4dce6 40%, #c2cdd9 100%)" },
  { id: "lavender-dusk", label: "Lavender Dusk", gradient: "linear-gradient(135deg, #1a0a2e 0%, #2d1548 40%, #0d0a1a 100%)" },
];

interface Props {
  userId: string;
  heroStyle: string;
  heroBackgroundPreset: string;
  bannerUrl: string;
  onUpdate: (fields: Record<string, string>) => void;
}

const HeroBackgroundEditor = ({ userId, heroStyle, heroBackgroundPreset, bannerUrl, onUpdate }: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("banners").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Upload error", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);
    onUpdate({ banner_url: urlData.publicUrl, hero_style: "full", hero_background_preset: "" });
    setUploading(false);
    toast({ title: "Uploaded", description: "Banner image set." });
  };

  const selectPreset = (presetId: string) => {
    onUpdate({ hero_background_preset: presetId, banner_url: "", hero_style: "full" });
  };

  const setStyle = (style: string) => {
    onUpdate({ hero_style: style });
  };

  const clearBackground = () => {
    onUpdate({ banner_url: "", hero_background_preset: "", hero_style: "full" });
  };

  const currentPreset = PRESET_BACKGROUNDS.find(p => p.id === heroBackgroundPreset);
  const hasCustomImage = !!bannerUrl;
  const hasPreset = !!heroBackgroundPreset;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Hero Background
          <div className="flex gap-1">
            <Button
              variant={heroStyle === "compact" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setStyle("compact")}
            >
              <Minimize2 className="h-3 w-3" /> Compact
            </Button>
            <Button
              variant={heroStyle === "full" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setStyle("full")}
            >
              <Maximize2 className="h-3 w-3" /> Full
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current preview */}
        <div
          className="relative w-full h-28 rounded-lg overflow-hidden border border-border"
          style={{
            backgroundImage: hasCustomImage ? `url(${bannerUrl})` : currentPreset ? currentPreset.gradient : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: !hasCustomImage && !hasPreset ? "hsl(var(--muted))" : undefined,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {!hasCustomImage && !hasPreset && (
              <span className="text-xs text-muted-foreground">No background — theme default will be used</span>
            )}
          </div>
          {(hasCustomImage || hasPreset) && (
            <button
              onClick={clearBackground}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              title="Remove background"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Upload custom */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Custom Image</Label>
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-border hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload image"}
              </div>
              <Input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <Button
              variant="outline"
              size="sm"
              className="h-auto text-xs gap-1"
              onClick={clearBackground}
              disabled={!hasCustomImage && !hasPreset}
            >
              <ImageOff className="h-3.5 w-3.5" /> None
            </Button>
          </div>
        </div>

        {/* Preset grid */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Preset Backgrounds</Label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_BACKGROUNDS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset.id)}
                className="relative rounded-md overflow-hidden aspect-[16/9] border-2 transition-all hover:scale-105"
                style={{
                  background: preset.gradient,
                  borderColor: heroBackgroundPreset === preset.id ? "hsl(var(--primary))" : "transparent",
                }}
                title={preset.label}
              >
                {heroBackgroundPreset === preset.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <span className="absolute bottom-0 inset-x-0 text-[8px] text-white/80 text-center py-0.5 bg-black/40">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {heroStyle === "compact" && (
          <p className="text-xs text-muted-foreground">Compact mode uses a shorter hero section — ideal for text-focused portfolios.</p>
        )}
      </CardContent>
    </Card>
  );
};

export { PRESET_BACKGROUNDS };
export default HeroBackgroundEditor;
