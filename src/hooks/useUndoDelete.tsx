import { useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Provides an undo-able delete pattern. Deletes the row, then shows a toast
 * with an "Undo" button that re-inserts the data within 5 seconds.
 */
export function useUndoDelete<T extends Record<string, any>>(
  tableName: string,
  options: {
    idField?: string;
    onComplete?: () => void;
    itemLabel?: string;
  } = {}
) {
  const { toast } = useToast();
  const { idField = "id", onComplete, itemLabel = "Item" } = options;
  const undoRef = useRef<{ data: T; undone: boolean } | null>(null);

  const deleteWithUndo = useCallback(async (item: T) => {
    const id = item[idField];
    if (!id) return;

    // Delete from DB
    const { error } = await supabase.from(tableName).delete().eq(idField, id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Track for undo
    undoRef.current = { data: item, undone: false };
    onComplete?.();

    // Show toast with undo
    toast({
      title: `${itemLabel} deleted`,
      description: "This action can be undone.",
      action: (
        <button
          className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          onClick={async () => {
            if (!undoRef.current || undoRef.current.undone) return;
            undoRef.current.undone = true;
            // Re-insert — strip any generated fields
            const { [idField]: _id, created_at, updated_at, ...rest } = undoRef.current.data;
            await supabase.from(tableName).insert({ [idField]: _id, ...rest } as any);
            onComplete?.();
          }}
        >
          Undo
        </button>
      ),
    });
  }, [tableName, idField, onComplete, itemLabel, toast]);

  return { deleteWithUndo };
}
