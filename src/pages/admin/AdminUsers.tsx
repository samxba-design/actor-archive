import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Ban, CheckCircle, Eye, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface Profile {
  id: string;
  display_name: string | null;
  slug: string | null;
  profile_type: string | null;
  subscription_tier: string | null;
  is_published: boolean | null;
  is_suspended: boolean | null;
  suspended_reason: string | null;
  created_at: string | null;
}

export default function AdminUsers() {
  const { user: adminUser } = useAdmin();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [suspendReason, setSuspendReason] = useState("");

  const fetchProfiles = async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("id, display_name, slug, profile_type, subscription_tier, is_published, is_suspended, suspended_reason, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, [search]);

  const handleSuspend = async () => {
    if (!suspendDialog.profile || !adminUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        is_suspended: true,
        suspended_reason: suspendReason,
        suspended_at: new Date().toISOString(),
        suspended_by: adminUser.id,
      })
      .eq("id", suspendDialog.profile.id);

    if (error) {
      toast.error("Failed to suspend user");
    } else {
      // Log the action
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "user_suspend",
        target_type: "profile",
        target_id: suspendDialog.profile.id,
        details: { reason: suspendReason },
      });

      toast.success("User suspended");
      setSuspendDialog({ open: false, profile: null });
      setSuspendReason("");
      fetchProfiles();
    }
  };

  const handleUnsuspend = async (profile: Profile) => {
    if (!adminUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        is_suspended: false,
        suspended_reason: null,
        suspended_at: null,
        suspended_by: null,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to unsuspend user");
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "user_unsuspend",
        target_type: "profile",
        target_id: profile.id,
      });

      toast.success("User unsuspended");
      fetchProfiles();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage all user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{profiles.length} users found</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{profile.display_name || "Unnamed"}</div>
                        <div className="text-sm text-muted-foreground">@{profile.slug || "no-slug"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{profile.profile_type || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.subscription_tier === "pro" ? "default" : "secondary"}>
                        {profile.subscription_tier || "free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {profile.is_suspended ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : profile.is_published ? (
                        <Badge variant="default" className="bg-green-500">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.created_at ? format(new Date(profile.created_at), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {profile.slug && (
                            <DropdownMenuItem onClick={() => window.open(`/p/${profile.slug}`, "_blank")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                          )}
                          {profile.is_suspended ? (
                            <DropdownMenuItem onClick={() => handleUnsuspend(profile)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unsuspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => setSuspendDialog({ open: true, profile })}
                              className="text-destructive"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={suspendDialog.open} onOpenChange={(open) => setSuspendDialog({ open, profile: open ? suspendDialog.profile : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspend {suspendDialog.profile?.display_name || "this user"}? They won't be able to access their account.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for suspension..."
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialog({ open: false, profile: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
