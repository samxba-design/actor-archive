import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ContentFlag {
  id: string;
  content_type: string;
  content_id: string;
  profile_id: string | null;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  profiles?: { display_name: string | null; slug: string | null } | null;
}

export default function AdminModeration() {
  const { user: adminUser } = useAdmin();
  const [flags, setFlags] = useState<ContentFlag[]>([]);
  const [allFlags, setAllFlags] = useState<ContentFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; flag: ContentFlag | null; content: any }>({ open: false, flag: null, content: null });
  const [loadingPreview, setLoadingPreview] = useState(false);

  const fetchFlags = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_flags")
      .select(`
        *,
        profiles:profile_id (display_name, slug)
      `)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      toast.error("Failed to fetch flags");
      console.error(error);
    } else {
      setAllFlags(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  // Filter flags based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFlags(allFlags);
    } else {
      setFlags(allFlags.filter(f => f.status === activeTab));
    }
    setSelectedFlags(new Set());
  }, [activeTab, allFlags]);

  const updateFlagStatus = async (flagId: string, newStatus: string) => {
    if (!adminUser) return;

    const { error } = await supabase
      .from("content_flags")
      .update({
        status: newStatus,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", flagId);

    if (error) {
      toast.error("Failed to update flag");
    } else {
      await supabase.from("admin_audit_logs").insert({
        admin_id: adminUser.id,
        action_type: "content_flag_review",
        target_type: "content_flag",
        target_id: flagId,
        details: { new_status: newStatus },
      });

      toast.success(`Flag marked as ${newStatus}`);
      fetchFlags();
    }
  };

  const handleBulkAction = async (newStatus: string) => {
    if (selectedFlags.size === 0 || !adminUser) return;

    const flagIds = Array.from(selectedFlags);
    const { error } = await supabase
      .from("content_flags")
      .update({
        status: newStatus,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .in("id", flagIds);

    if (error) {
      toast.error("Failed to update flags");
    } else {
      for (const id of flagIds) {
        await supabase.from("admin_audit_logs").insert({
          admin_id: adminUser.id,
          action_type: "content_flag_review",
          target_type: "content_flag",
          target_id: id,
          details: { new_status: newStatus, bulk: true },
        });
      }

      toast.success(`${flagIds.length} flags updated`);
      setSelectedFlags(new Set());
      fetchFlags();
    }
  };

  const handlePreview = async (flag: ContentFlag) => {
    setPreviewDialog({ open: true, flag, content: null });
    setLoadingPreview(true);

    // Fetch the content based on type
    const tableMap: Record<string, string> = {
      project: "projects",
      testimonial: "testimonials",
      profile: "profiles",
      press: "press",
      service: "services",
    };

    const table = tableMap[flag.content_type];
    if (table) {
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", flag.content_id)
        .single();
      setPreviewDialog(prev => ({ ...prev, content: data }));
    }
    setLoadingPreview(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-orange-500 border-orange-500"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="text-blue-500 border-blue-500"><Eye className="mr-1 h-3 w-3" />Reviewed</Badge>;
      case "resolved":
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Resolved</Badge>;
      case "dismissed":
        return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedFlags);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedFlags(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedFlags.size === flags.length) {
      setSelectedFlags(new Set());
    } else {
      setSelectedFlags(new Set(flags.map(f => f.id)));
    }
  };

  // Correct pending count from all flags
  const pendingCount = allFlags.filter(f => f.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground">Review and manage flagged content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Flagged Content
          </CardTitle>
          <CardDescription>
            {pendingCount > 0 ? `${pendingCount} items need review` : "No pending items"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="pending">Pending ({allFlags.filter(f => f.status === "pending").length})</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              {selectedFlags.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedFlags.size} selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("resolved")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve All
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkAction("dismissed")}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss All
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : flags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No flagged content in this category
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedFlags.size === flags.length && flags.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flags.map((flag) => (
                      <TableRow key={flag.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFlags.has(flag.id)}
                            onCheckedChange={() => toggleSelect(flag.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline">{flag.content_type}</Badge>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">
                              {flag.content_id.slice(0, 8)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium">{flag.reason}</div>
                            {flag.details && (
                              <div className="text-sm text-muted-foreground truncate">{flag.details}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {flag.profiles ? (
                            <div>
                              <div className="font-medium">{flag.profiles.display_name || "Unnamed"}</div>
                              <div className="text-sm text-muted-foreground">@{flag.profiles.slug}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(flag.status)}</TableCell>
                        <TableCell>
                          {format(new Date(flag.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(flag)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {flag.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateFlagStatus(flag.id, "resolved")}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateFlagStatus(flag.id, "dismissed")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Dismiss
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Content Preview Dialog */}
      <Dialog open={previewDialog.open} onOpenChange={(open) => setPreviewDialog({ open, flag: null, content: null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              {previewDialog.flag?.content_type} • {previewDialog.flag?.content_id.slice(0, 8)}...
            </DialogDescription>
          </DialogHeader>

          {loadingPreview ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : previewDialog.content ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-sm font-medium text-destructive">Flag Reason: {previewDialog.flag?.reason}</div>
                {previewDialog.flag?.details && (
                  <p className="text-sm mt-1">{previewDialog.flag.details}</p>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(previewDialog.content, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Content not found or has been deleted.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
