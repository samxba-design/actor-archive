import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UseDeleteConfirmationOptions {
  title?: string;
  description?: string;
}

export function useDeleteConfirmation(
  onConfirm: (id: string) => Promise<void>,
  options: UseDeleteConfirmationOptions = {}
) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const requestDelete = useCallback((id: string) => {
    setPendingId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (pendingId) {
      await onConfirm(pendingId);
      setPendingId(null);
    }
  }, [pendingId, onConfirm]);

  const cancelDelete = useCallback(() => {
    setPendingId(null);
  }, []);

  const DeleteConfirmDialog = () => (
    <AlertDialog open={!!pendingId} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description || "This action cannot be undone. This will permanently delete this item."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { requestDelete, DeleteConfirmDialog };
}
