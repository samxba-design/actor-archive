import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageOff, Upload, Check, X, Minimize2, Maximize2, Palette, Video, Sparkles, Circle, ImageIcon } from "lucide-react";
import { STOCK_HERO_IMAGES } from "@/components/demo/DemoShared";

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

type BgMode = 'preset' | 'solid' | 'bokeh' | 'video' | 'gradient' | 'image';

const BG_MODES: { id: BgMode; label: string; icon: React.ReactNode }[] = [
  { id: 'preset', label: 'Preset', icon: <Palette className="h-3.5 w-3.5" /> },
  { id: 'image', label: 'Image', icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { id: 'solid', label: 'Solid', icon: <Circle className="h-3.5 w-3.5" /> },
  { id: 'bokeh', label: 'Bokeh', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'video', label: 'Video', icon: <Video className="h-3.5 w-3.5" /> },
  { id: 'gradient', label: 'Animated', icon: <Sparkles className="h-3.5 w-3.5" /> },
];

interface Props {
  userId: string;
  heroStyle: string;
  heroBackgroundPreset: string;
  bannerUrl: string;
  heroBgType: string;
  heroBgSolidColor: string;
  heroBgVideoUrl: string;
  heroBgImageUrl?: string;
  onUpdate: (fields: Record<string, string>) => void;
}

const HeroBackgroundEditor = ({ userId, heroStyle, heroBackgroundPreset, bannerUrl, heroBgType, heroBgSolidColor, heroBgVideoUrl, heroBgImageUrl, onUpdate }: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const currentMode = (heroBgType || 'preset') as BgMode;

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
    onUpdate({ banner_url: urlData.publicUrl, hero_style: "classic", hero_background_preset: "", hero_bg_type: "preset" });
    setUploading(false);
    toast({ title: "Uploaded", description: "Banner image set." });
  };

  const selectPreset = (presetId: string) => {
    onUpdate({ hero_background_preset: presetId, banner_url: "", hero_style: "classic", hero_bg_type: "preset" });
  };

  const setStyle = (style: string) => {
    onUpdate({ hero_style: style });
  };

  const setMode = (mode: BgMode) => {
    const updates: Record<string, string> = { hero_bg_type: mode };
    if (mode !== 'preset') {
      updates.banner_url = "";
      updates.hero_background_preset = "";
    }
    onUpdate(updates);
  };

  const clearBackground = () => {
    onUpdate({ banner_url: "", hero_background_preset: "", hero_style: "full", hero_bg_type: "preset", hero_bg_solid_color: "", hero_bg_video_url: "" });
  };

  const currentPreset = PRESET_BACKGROUNDS.find(p => p.id === heroBackgroundPreset);
  const hasCustomImage = !!bannerUrl;
  const hasPreset = !!heroBackgroundPreset;

  const previewStyle = (): React.CSSProperties => {
    if (currentMode === 'image' && heroBgImageUrl) return { backgroundImage: `url(${heroBgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    if (currentMode === 'solid' && heroBgSolidColor) return { backgroundColor: heroBgSolidColor };
    if (currentMode === 'bokeh') return { background: 'linear-gradient(135deg, #0a0a0a, #1a0a2e, #0a0a0a)' };
    if (currentMode === 'video') return { background: 'linear-gradient(135deg, #111, #222)' };
    if (currentMode === 'gradient') return { background: 'linear-gradient(135deg, #1a0a0f, #2d1520, #0d0d1a)' };
    if (hasCustomImage) return { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    if (currentPreset) return { background: currentPreset.gradient };
    return { backgroundColor: 'hsl(var(--muted))' };
  };

  const previewLabel = (): string => {
    if (currentMode === 'image') return heroBgImageUrl ? 'Stock Image' : 'Select an image below';
    if (currentMode === 'solid') return heroBgSolidColor ? `Solid: ${heroBgSolidColor}` : 'Solid Color — pick below';
    if (currentMode === 'bokeh') return 'Bokeh + Spotlight';
    if (currentMode === 'video') return heroBgVideoUrl ? 'Video Loop' : 'Video Loop — paste URL below';
    if (currentMode === 'gradient') return 'Animated Gradient';
    if (hasCustomImage) return 'Custom Image';
    if (currentPreset) return currentPreset.label;
    return 'Theme default';
  };

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
        {/* Background mode selector */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Background Type</Label>
          <div className="flex flex-wrap gap-1.5">
            {BG_MODES.map((mode) => (
              <Button
                key={mode.id}
                variant={currentMode === mode.id ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setMode(mode.id)}
              >
                {mode.icon} {mode.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Current preview */}
        <div
          className="relative w-full h-28 rounded-lg overflow-hidden border border-border"
          style={previewStyle()}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded">{previewLabel()}</span>
          </div>
          {(hasCustomImage || hasPreset || currentMode !== 'preset') && (
            <button
              onClick={clearBackground}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              title="Remove background"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mode-specific controls */}
        {currentMode === 'preset' && (
          <>
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
          </>
        )}

        {currentMode === 'solid' && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Background Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={heroBgSolidColor || '#1a1a2e'}
                onChange={(e) => onUpdate({ hero_bg_solid_color: e.target.value })}
                className="w-10 h-10 rounded-md border border-border cursor-pointer"
              />
              <Input
                value={heroBgSolidColor || ''}
                onChange={(e) => onUpdate({ hero_bg_solid_color: e.target.value })}
                placeholder="#1a1a2e"
                className="flex-1"
              />
            </div>
          </div>
        )}

        {currentMode === 'video' && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Video URL (MP4 recommended)</Label>
            <Input
              value={heroBgVideoUrl || ''}
              onChange={(e) => onUpdate({ hero_bg_video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-xs text-muted-foreground mt-1">Use a short, looping MP4 for best results. Video plays muted with a dark overlay.</p>
          </div>
        )}

        {currentMode === 'bokeh' && (
          <p className="text-xs text-muted-foreground">Bokeh mode renders animated light circles with a radial spotlight — a cinematic, eye-catching look.</p>
        )}

        {currentMode === 'gradient' && (
          <p className="text-xs text-muted-foreground">Animated gradient uses your theme's accent color with drifting radial overlays for a dynamic background.</p>
        )}

        {currentMode === 'image' && (
          <>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Stock Background Images</Label>
              <div className="grid grid-cols-4 gap-2">
                {STOCK_HERO_IMAGES.map((img) => (
                  <button
                    key={img.key}
                    onClick={() => onUpdate({ hero_bg_image_url: img.url, hero_bg_type: 'image' })}
                    className="relative rounded-md overflow-hidden aspect-[16/9] border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: heroBgImageUrl === img.url ? "hsl(var(--primary))" : "transparent",
                    }}
                    title={img.label}
                  >
                    <img src={`${img.url}&w=192&q=40`} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    {heroBgImageUrl === img.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 text-[8px] text-white/80 text-center py-0.5 bg-black/40">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Or paste custom image URL</Label>
              <Input
                value={heroBgImageUrl || ''}
                onChange={(e) => onUpdate({ hero_bg_image_url: e.target.value, hero_bg_type: 'image' })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </>
        )}

        {heroStyle === "compact" && (
          <p className="text-xs text-muted-foreground">Compact mode uses a shorter hero section — ideal for text-focused portfolios.</p>
        )}
      </CardContent>
    </Card>
  );
};

export { PRESET_BACKGROUNDS };
export default HeroBackgroundEditor;
