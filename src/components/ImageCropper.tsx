import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  aspectRatio: number; // width:height ratio (e.g., 1 for square, 16/9 for banner)
  aspectLabel: string; // e.g. "Square (1:1)", "Banner (16:9)"
  onCropComplete: (croppedDataUrl: string) => void;
}

const ImageCropper = ({
  open,
  onOpenChange,
  imageUrl,
  aspectRatio,
  aspectLabel,
  onCropComplete,
}: ImageCropperProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleCrop = () => {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate crop area
    const img = imgRef.current;
    const containerWidth = 400;
    const containerHeight = containerWidth / aspectRatio;

    // Center crop
    const displayedWidth = img.naturalWidth * zoom;
    const displayedHeight = img.naturalHeight * zoom;
    const offsetX = (containerWidth - displayedWidth) / 2;
    const offsetY = (containerHeight - displayedHeight) / 2;

    // Set canvas size
    canvas.width = 800; // High resolution export
    canvas.height = 800 / aspectRatio;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      img,
      (-displayedWidth * (800 / containerWidth)) / 2,
      (-displayedHeight * (800 / containerHeight)) / 2,
      displayedWidth * (800 / containerWidth),
      displayedHeight * (800 / containerHeight)
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCropComplete(dataUrl);
    onOpenChange(false);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>Adjust zoom and rotation. The area inside the frame will be used.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview area with aspect ratio frame */}
          <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden" style={{ aspectRatio }}>
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.1s",
              }}
            />
          </div>

          {/* Aspect ratio label */}
          <div className="text-xs text-muted-foreground text-center">{aspectLabel}</div>

          {/* Zoom control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} min={0.8} max={2} step={0.1} className="flex-1" />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground text-right">{(zoom * 100).toFixed(0)}%</div>
          </div>

          {/* Rotation control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rotation</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">0°</span>
              <Slider value={[rotation]} onValueChange={(v) => setRotation(v[0])} min={0} max={360} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground">{rotation}°</span>
            </div>
          </div>

          {/* Reset button */}
          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Canvas for rendering (hidden) */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop & Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
