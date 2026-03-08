import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditModeContextType {
  isOwner: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  sectionsVisible: Record<string, boolean>;
  toggleVisibility: (key: string) => void;
  saving: boolean;
  saveLayout: () => Promise<void>;
  hasChanges: boolean;
}

const EditModeContext = createContext<EditModeContextType>({
  isOwner: false,
  editMode: false,
  setEditMode: () => {},
  sectionOrder: [],
  setSectionOrder: () => {},
  sectionsVisible: {},
  toggleVisibility: () => {},
  saving: false,
  saveLayout: async () => {},
  hasChanges: false,
});

export const useEditMode = () => useContext(EditModeContext);

interface Props {
  profileId: string;
  initialSectionOrder: string[];
  initialSectionsVisible: Record<string, boolean>;
  children: ReactNode;
}

export const EditModeProvider = ({ profileId, initialSectionOrder, initialSectionsVisible, children }: Props) => {
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>(initialSectionOrder);
  const [sectionsVisible, setSectionsVisible] = useState<Record<string, boolean>>(initialSectionsVisible);
  const [saving, setSaving] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>(initialSectionOrder);
  const [originalVisible, setOriginalVisible] = useState<Record<string, boolean>>(initialSectionsVisible);

  // Check ownership
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwner(user?.id === profileId);
    };
    check();
  }, [profileId]);

  const hasChanges =
    JSON.stringify(sectionOrder) !== JSON.stringify(originalOrder) ||
    JSON.stringify(sectionsVisible) !== JSON.stringify(originalVisible);

  const toggleVisibility = useCallback((key: string) => {
    setSectionsVisible((prev) => ({ ...prev, [key]: prev[key] === false ? true : false }));
  }, []);

  const saveLayout = useCallback(async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        section_order: sectionOrder,
        sections_visible: sectionsVisible,
      })
      .eq("id", profileId);

    if (error) {
      toast.error("Failed to save layout");
    } else {
      toast.success("Layout saved");
      setOriginalOrder([...sectionOrder]);
      setOriginalVisible({ ...sectionsVisible });
    }
    setSaving(false);
  }, [profileId, sectionOrder, sectionsVisible]);

  return (
    <EditModeContext.Provider
      value={{
        isOwner,
        editMode,
        setEditMode,
        sectionOrder,
        setSectionOrder,
        sectionsVisible,
        toggleVisibility,
        saving,
        saveLayout,
        hasChanges,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
};
