import { useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Provides an undo-able delete pattern for any Supabase table.
 */
export function useUndoDelete(
  tableName: string,
  options: {
    onComplete?: () => void;
    itemLabel?: string;
  } = {}
) {
  const { toast } = useToast();
  const { onComplete, itemLabel = "Item" } = options;
  const undoRef = useRef<{ data: Record<string, any>; undone: boolean } | null>(null);

  const deleteWithUndo = useCallback(async (item: Record<string, any>) => {
    const id = item.id;
    if (!id) return;

    const { error } = await (supabase as any).from(tableName).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    undoRef.current = { data: item, undone: false };
    onComplete?.();

    toast({
      title: `${itemLabel} deleted`,
      description: "This action can be undone.",
      action: (
        <button
          className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          onClick={async () => {
            if (!undoRef.current || undoRef.current.undone) return;
            undoRef.current.undone = true;
            await (supabase as any).from(tableName).insert(undoRef.current.data);
            onComplete?.();
          }}
        >
          Undo
        </button>
      ),
    });
  }, [tableName, onComplete, itemLabel, toast]);

  return { deleteWithUndo };
}
