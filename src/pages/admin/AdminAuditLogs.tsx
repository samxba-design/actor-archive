import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, History, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, any> | null;
  created_at: string | null;
}

const PAGE_SIZE = 25;

const actionTypeColors: Record<string, string> = {
  user_suspend: "bg-red-500",
  user_unsuspend: "bg-green-500",
  role_assign: "bg-blue-500",
  role_remove: "bg-orange-500",
  setting_change: "bg-purple-500",
  content_flag_review: "bg-yellow-500",
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>("all");

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from("admin_audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (actionFilter !== "all") {
      query = query.eq("action_type", actionFilter);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("Failed to fetch audit logs:", error);
    } else {
      setLogs(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const formatDetails = (details: Record<string, any> | null): string => {
    if (!details) return "-";
    const entries = Object.entries(details);
    if (entries.length === 0) return "-";
    return entries.map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`).join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all admin actions and changes</p>
        </div>
        <Button variant="outline" onClick={fetchLogs}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Action History</CardTitle>
            </div>
            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(0); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user_suspend">User Suspend</SelectItem>
                <SelectItem value="user_unsuspend">User Unsuspend</SelectItem>
                <SelectItem value="role_assign">Role Assign</SelectItem>
                <SelectItem value="role_remove">Role Remove</SelectItem>
                <SelectItem value="setting_change">Setting Change</SelectItem>
                <SelectItem value="content_flag_review">Flag Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>{totalCount} total entries</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Admin ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {log.created_at ? format(new Date(log.created_at), "MMM d, yyyy HH:mm") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${actionTypeColors[log.action_type] || "bg-gray-500"} text-white`}>
                          {log.action_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.target_type && (
                          <div>
                            <span className="text-xs text-muted-foreground uppercase">{log.target_type}</span>
                            {log.target_id && (
                              <div className="font-mono text-xs">{log.target_id.slice(0, 8)}...</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={formatDetails(log.details)}>
                        {formatDetails(log.details)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.admin_id.slice(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
    </div>
  );
}
