import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProfileTypeContextType {
  profileType: string | null;
  setProfileType: (type: string | null) => void;
  slug: string | null;
  setSlug: (slug: string | null) => void;
  isLoading: boolean;
  refreshProfile: () => void;
}

const ProfileTypeContext = createContext<ProfileTypeContextType>({
  profileType: null,
  setProfileType: () => {},
  slug: null,
  setSlug: () => {},
  isLoading: true,
  refreshProfile: () => {},
});

export const useProfileTypeContext = () => useContext(ProfileTypeContext);

export const ProfileTypeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profileType, setProfileType] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("profile_type, slug")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfileType(data.profile_type || null);
      setSlug(data.slug || null);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileTypeContext.Provider
      value={{
        profileType,
        setProfileType,
        slug,
        setSlug,
        isLoading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileTypeContext.Provider>
  );
};
