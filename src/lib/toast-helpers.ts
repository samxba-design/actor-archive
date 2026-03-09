import { toast } from "sonner";

/**
 * Standardized toast helpers for consistent UX
 */
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },

  // Specialized toasts for common actions
  saved: () => toast.success("Changes saved"),
  deleted: (item = "Item") => toast.success(`${item} deleted`),
  created: (item = "Item") => toast.success(`${item} created`),
  copied: () => toast.success("Copied to clipboard"),
  
  // Error variations
  networkError: () => toast.error("Network error", { description: "Please check your connection and try again." }),
  permissionDenied: () => toast.error("Permission denied", { description: "You don't have access to perform this action." }),
  validationError: (field?: string) => toast.error("Validation error", { description: field ? `Please check the ${field} field.` : "Please check your input." }),
};
