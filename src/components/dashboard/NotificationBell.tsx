import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ContactMessage {
  id: string;
  sender_name: string | null;
  message: string | null;
  created_at: string | null;
  is_read: boolean | null;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("contact_submissions")
      .select("id, sender_name, message, created_at, is_read")
      .eq("profile_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        const msgs = (data as ContactMessage[]) || [];
        setMessages(msgs);
        setUnread(msgs.length);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contact_submissions",
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [payload.new as ContactMessage, ...prev].slice(0, 5));
          setUnread((c) => c + 1);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No unread messages
            </p>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboard/inbox");
                }}
                className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0 bg-accent/20"
              >
                <p className="text-sm font-medium truncate">
                  Message from {msg.sender_name || "Someone"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {msg.message ? msg.message.slice(0, 60) + (msg.message.length > 60 ? "…" : "") : ""}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {msg.created_at
                    ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })
                    : ""}
                </p>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-border">
          <button
            className="text-xs text-primary hover:underline w-full text-center"
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/inbox");
            }}
          >
            View all in Inbox
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
