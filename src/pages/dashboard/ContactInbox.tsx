import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Mail, MailOpen, Star, StarOff, Archive, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Submission = Tables<"contact_submissions">;

const ContactInbox = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<"inbox" | "starred" | "archived">("inbox");

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [user]);

  const filtered = messages.filter((m) => {
    if (filter === "starred") return m.is_starred && !m.is_archived;
    if (filter === "archived") return m.is_archived;
    return !m.is_archived;
  });

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length;

  const toggleField = async (id: string, field: "is_read" | "is_starred" | "is_archived", value: boolean) => {
    await supabase.from("contact_submissions").update({ [field]: value }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  };

  const openMessage = (m: Submission) => {
    setSelected(m);
    if (!m.is_read) toggleField(m.id, "is_read", true);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Inbox {unreadCount > 0 && <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>}
        </h1>
      </div>

      <div className="flex gap-2">
        {(["inbox", "starred", "archived"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {filter === "inbox" ? "No messages yet." : `No ${filter} messages.`}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <Card key={m.id} className={`group cursor-pointer transition-colors ${!m.is_read ? "bg-primary/5 border-primary/20" : ""}`}
              onClick={() => openMessage(m)}>
              <CardContent className="flex items-start gap-3 py-3">
                {m.is_read ? <MailOpen className="h-4 w-4 text-muted-foreground mt-1 shrink-0" /> : <Mail className="h-4 w-4 text-primary mt-1 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!m.is_read ? "font-semibold" : "font-medium"} text-foreground`}>{m.sender_name}</span>
                    {m.subject_type && m.subject_type !== "general" && (
                      <Badge variant="outline" className="text-[10px]">{m.subject_type.replace(/_/g, " ")}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground truncate">{m.subject || "(No subject)"}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{m.created_at ? format(new Date(m.created_at), "MMM d") : ""}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleField(m.id, "is_starred", !m.is_starred)}>
                      {m.is_starred ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> : <StarOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleField(m.id, "is_archived", !m.is_archived)}>
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject || "(No subject)"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">{selected.sender_name}</p>
                    <p className="text-muted-foreground">{selected.sender_email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {selected.created_at ? format(new Date(selected.created_at), "MMM d, yyyy h:mm a") : ""}
                  </span>
                </div>
                {selected.subject_type && selected.subject_type !== "general" && (
                  <Badge variant="secondary">{selected.subject_type.replace(/_/g, " ")}</Badge>
                )}
                <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
                  {selected.message}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${selected.sender_email}?subject=Re: ${selected.subject || ""}`}>Reply via Email</a>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleField(selected.id, "is_starred", !selected.is_starred)}>
                    {selected.is_starred ? <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="mr-1 h-4 w-4" />}
                    {selected.is_starred ? "Unstar" : "Star"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { toggleField(selected.id, "is_archived", true); setSelected(null); }}>
                    <Archive className="mr-1 h-4 w-4" /> Archive
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(selected.id)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactInbox;
