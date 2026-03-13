import { useEffect, useState, useCallback } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import PageHeader from "@/components/dashboard/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Tables } from "@/integrations/supabase/types";
import { useSubscription, FREE_GALLERY_LIMIT } from "@/hooks/useSubscription";
import { getTypeAwareLabels } from "@/lib/typeAwareLabels";
import { useProfileTypeContext } from "@/contexts/ProfileTypeContext";
import ManagerErrorState from "@/components/dashboard/ManagerErrorState";

type GalleryImage = Tables<"gallery_images">;

const IMAGE_TYPES = ["headshot", "production_still", "behind_the_scenes", "poster", "artwork", "event_photo", "book_cover", "campaign_creative", "other"];

const SortableGalleryItem = ({ img, onDelete }: { img: GalleryImage; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
      <div {...attributes} {...listeners} className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing touch-none rounded bg-black/50 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-white" />
      </div>
      <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <Button variant="destructive" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(img.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {img.image_type.replace(/_/g, " ")}
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPro } = useSubscription();
  const { profileType } = useProfileTypeContext();
  const labels = getTypeAwareLabels(profileType);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageType, setImageType] = useState("headshot");

  const atGalleryLimit = !isPro && images.length >= FREE_GALLERY_LIMIT;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex(i => i.id === active.id);
    const newIndex = images.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...images];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setImages(reordered);
    await Promise.all(reordered.map((img, i) =>
      supabase.from("gallery_images").update({ display_order: i }).eq("id", img.id)
    ));
  };

  const fetchImages = async () => {
    if (!user) return;
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("profile_id", user.id)
      .order("display_order", { ascending: true });
    if (fetchError) setError(fetchError.message);
    else setImages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadErr) {
        toast({ title: "Upload error", description: uploadErr.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
      await supabase.from("gallery_images").insert({
        profile_id: user.id,
        image_url: urlData.publicUrl,
        image_type: imageType,
        display_order: images.length,
      });
    }
    await fetchImages();
    setUploading(false);
    toast({ title: "Uploaded", description: `${files.length} image(s) added.` });
  };

  const [pendingDeleteImg, setPendingDeleteImg] = useState<GalleryImage | null>(null);
  const performDeleteImg = useCallback(async (id: string) => {
    const img = images.find(i => i.id === id);
    await supabase.from("gallery_images").delete().eq("id", id);
    if (img) {
      try {
        const urlParts = img.image_url.split("/gallery/");
        if (urlParts[1]) await supabase.storage.from("gallery").remove([urlParts[1]]);
      } catch {}
    }
    fetchImages();
  }, [images, user]);
  const { requestDelete, DeleteConfirmDialog } = useDeleteConfirmation(performDeleteImg, { title: "Delete this image?", description: "This image will be permanently removed from your gallery." });

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={labels.galleryTitle}
        description={labels.galleryDescription}
      />

      <Card>
        <CardContent className="py-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Image Type</Label>
              <Select value={imageType} onValueChange={setImageType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IMAGE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gallery-upload" className="cursor-pointer">
                <Button asChild disabled={uploading || atGalleryLimit}>
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {atGalleryLimit ? `Limit reached (${FREE_GALLERY_LIMIT})` : "Upload Images"}
                  </label>
                </Button>
              </Label>
              <Input id="gallery-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={atGalleryLimit} />
            </div>
          </div>
        </CardContent>
      </Card>

      {images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No images yet. Upload some above.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <SortableGalleryItem key={img.id} img={img} onDelete={requestDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <DeleteConfirmDialog />
    </div>
  );
};

export default GalleryManager;
