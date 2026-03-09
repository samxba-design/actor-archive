import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, UserPlus, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "moderator" | "user";
  profile?: {
    display_name: string | null;
    slug: string | null;
  };
}

interface Profile {
  id: string;
  display_name: string | null;
  slug: string | null;
}

export default function AdminRoles() {
  const { user: adminUser } = useAdmin();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialog, setAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator">("moderator");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search users
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setSearching(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, slug")
        .or(`display_name.ilike.%${debouncedSearch}%,slug.ilike.%${debouncedSearch}%`)
        .limit(10);
      setSearchResults(data || []);
      setSearching(false);
    };

    searchUsers();
  }, [debouncedSearch]);

  const fetchRoles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("role", { ascending: true });

    if (error) {
      toast.error("Failed to fetch roles");
      console.error(error);
    } else {
      // Fetch profiles for each role
      const userIds = data?.map(r => r.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, slug")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]));
      const rolesWithProfiles = data?.map(r => ({
        ...r,
        profile: profileMap.get(r.user_id),
      })) || [];

      setRoles(rolesWithProfiles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUser || !adminUser) return;

    // Check if user already has this role
    const existing = roles.find(r => r.user_id === selectedUser.id && r.role === selectedRole);
    if (existing) {
      toast.error("User already has this role");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: selectedUser.id,
        role: selectedRole,
      });

    if (error) {
      toast.error("Failed to assign role");
      console.error(error);
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "role_assign",
        target_type: "user",
        target_id: selectedUser.id,
        details: { role: selectedRole },
      });

      toast.success(`${selectedRole} role assigned`);
      setAddDialog(false);
      setSelectedUser(null);
      setSearchQuery("");
      fetchRoles();
    }
  };

  const handleRemoveRole = async (role: UserRole) => {
    if (!adminUser) return;

    // Prevent removing your own admin role
    if (role.user_id === adminUser.id && role.role === "admin") {
      toast.error("You cannot remove your own admin role");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", role.id);

    if (error) {
      toast.error("Failed to remove role");
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "role_remove",
        target_type: "user",
        target_id: role.user_id,
        details: { role: role.role },
      });

      toast.success("Role removed");
      fetchRoles();
    }
  };

  const adminRoles = roles.filter(r => r.role === "admin");
  const moderatorRoles = roles.filter(r => r.role === "moderator");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Manage admin and moderator permissions</p>
        </div>
        <Button onClick={() => setAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admins */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              <CardTitle>Administrators</CardTitle>
            </div>
            <CardDescription>Full platform access</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : adminRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No administrators assigned</p>
            ) : (
              <div className="space-y-2">
                {adminRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{role.profile?.display_name || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">@{role.profile?.slug || "N/A"}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRole(role)}
                      disabled={role.user_id === adminUser?.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderators */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle>Moderators</CardTitle>
            </div>
            <CardDescription>Content moderation access</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : moderatorRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No moderators assigned</p>
            ) : (
              <div className="space-y-2">
                {moderatorRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{role.profile?.display_name || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">@{role.profile?.slug || "N/A"}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRole(role)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Role Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Search for a user and assign them admin or moderator access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {searching && (
              <div className="text-sm text-muted-foreground">Searching...</div>
            )}

            {searchResults.length > 0 && !selectedUser && (
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {searchResults.map((profile) => (
                  <button
                    key={profile.id}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedUser(profile)}
                  >
                    <div className="font-medium">{profile.display_name || "Unnamed"}</div>
                    <div className="text-sm text-muted-foreground">@{profile.slug || "no-slug"}</div>
                  </button>
                ))}
              </div>
            )}

            {selectedUser && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="font-medium">{selectedUser.display_name || "Unnamed"}</div>
                <div className="text-sm text-muted-foreground">@{selectedUser.slug || "no-slug"}</div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => setSelectedUser(null)}
                >
                  Change user
                </Button>
              </div>
            )}

            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as "admin" | "moderator")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!selectedUser}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
