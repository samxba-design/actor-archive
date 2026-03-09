import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { Shortcut } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: Shortcut[];
}

export default function KeyboardShortcutsHelp({ open, onOpenChange, shortcuts }: KeyboardShortcutsHelpProps) {
  const categories = {
    navigation: shortcuts.filter(s => s.category === "navigation"),
    actions: shortcuts.filter(s => s.category === "actions"),
    general: shortcuts.filter(s => s.category === "general"),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {Object.entries(categories).map(([category, items]) => (
            items.length > 0 && (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((shortcut) => (
                    <div key={shortcut.key} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border">
                        {shortcut.key.replace(" ", " then ")}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">?</kbd> anytime to show this help
        </p>
      </DialogContent>
    </Dialog>
  );
}
