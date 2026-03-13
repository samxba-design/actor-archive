import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Ban, CheckCircle, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Filter, X, Crown } from "lucide-react";
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
  location: string | null;
  bio: string | null;
}

const PAGE_SIZE = 20;

export default function AdminUsers() {
  const { user: adminUser } = useAdmin();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [suspendReason, setSuspendReason] = useState("");
  const [detailSheet, setDetailSheet] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [tierDialog, setTierDialog] = useState<{ open: boolean; profile: Profile | null }>({ open: false, profile: null });
  const [selectedTier, setSelectedTier] = useState<string>("free");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProfiles = async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("id, display_name, slug, profile_type, subscription_tier, is_published, is_suspended, suspended_reason, created_at, location, bio", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (debouncedSearch) {
      query = query.or(`display_name.ilike.%${debouncedSearch}%,slug.ilike.%${debouncedSearch}%`);
    }

    if (tierFilter !== "all") {
      query = query.eq("subscription_tier", tierFilter as "free" | "pro" | "premium");
    }

    if (typeFilter !== "all") {
      query = query.eq("profile_type", typeFilter as Database["public"]["Enums"]["profile_type"]);
    }

    if (statusFilter === "published") {
      query = query.eq("is_published", true);
    } else if (statusFilter === "draft") {
      query = query.eq("is_published", false);
    } else if (statusFilter === "suspended") {
      query = query.eq("is_suspended", true);
    }

    const { data, error, count } = await query;
    if (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } else {
      setProfiles(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, [debouncedSearch, page, tierFilter, typeFilter, statusFilter]);

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

  const handleChangeTier = async () => {
    if (!tierDialog.profile || !adminUser) return;
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_tier: selectedTier as "free" | "pro" })
      .eq("id", tierDialog.profile.id);
    if (error) {
      toast.error("Failed to update tier");
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "change_tier",
        target_type: "profile",
        target_id: tierDialog.profile.id,
        details: { new_tier: selectedTier, old_tier: tierDialog.profile.subscription_tier },
      });
      toast.success(`Tier changed to ${selectedTier}`);
      setTierDialog({ open: false, profile: null });
      fetchProfiles();
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasFilters = tierFilter !== "all" || typeFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setTierFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage all user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>{totalCount} users found</CardDescription>
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

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="actor">Actor</SelectItem>
                  <SelectItem value="screenwriter">Screenwriter</SelectItem>
                  <SelectItem value="copywriter">Copywriter</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <>
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
                    <TableRow key={profile.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailSheet({ open: true, profile })}>
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
                          <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {profile.created_at ? format(new Date(profile.created_at), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {profile.slug && (
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`/p/${profile.slug}`, "_blank"); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                            )}
                            {profile.is_suspended ? (
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUnsuspend(profile); }}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Unsuspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); setSuspendDialog({ open: true, profile }); }}
                                className="text-destructive"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTier(profile.subscription_tier || "free"); setTierDialog({ open: true, profile }); }}>
                              <Crown className="mr-2 h-4 w-4" />
                              Change Tier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm px-2">
                      Page {page + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
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

      {/* User Detail Sheet */}
      <Sheet open={detailSheet.open} onOpenChange={(open) => setDetailSheet({ open, profile: open ? detailSheet.profile : null })}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{detailSheet.profile?.display_name || "User Details"}</SheetTitle>
            <SheetDescription>@{detailSheet.profile?.slug || "no-slug"}</SheetDescription>
          </SheetHeader>
          {detailSheet.profile && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Profile Type</div>
                  <div className="font-medium">{detailSheet.profile.profile_type || "Not set"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Subscription</div>
                  <div className="font-medium capitalize">{detailSheet.profile.subscription_tier || "free"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{detailSheet.profile.location || "Not set"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Joined</div>
                  <div className="font-medium">
                    {detailSheet.profile.created_at ? format(new Date(detailSheet.profile.created_at), "MMM d, yyyy") : "N/A"}
                  </div>
                </div>
              </div>

              {detailSheet.profile.bio && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Bio</div>
                  <p className="text-sm">{detailSheet.profile.bio}</p>
                </div>
              )}

              {detailSheet.profile.is_suspended && detailSheet.profile.suspended_reason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-sm font-medium text-destructive">Suspension Reason</div>
                  <p className="text-sm mt-1">{detailSheet.profile.suspended_reason}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {detailSheet.profile.slug && (
                  <Button variant="outline" size="sm" onClick={() => window.open(`/p/${detailSheet.profile!.slug}`, "_blank")}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Public Profile
                  </Button>
                )}
                {detailSheet.profile.is_suspended ? (
                  <Button variant="outline" size="sm" onClick={() => { handleUnsuspend(detailSheet.profile!); setDetailSheet({ open: false, profile: null }); }}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unsuspend
                  </Button>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => { setDetailSheet({ open: false, profile: null }); setSuspendDialog({ open: true, profile: detailSheet.profile }); }}>
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
