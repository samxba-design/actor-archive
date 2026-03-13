import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "contact" | "download";
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;

    const [contacts, downloads] = await Promise.all([
      supabase
        .from("contact_submissions")
        .select("id, sender_name, sender_email, subject, created_at, is_read")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("download_logs")
        .select("id, downloader_name, downloader_email, document_url, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const items: Notification[] = [];

    (contacts.data || []).forEach((c) => {
      items.push({
        id: c.id,
        type: "contact",
        title: `Message from ${c.sender_name}`,
        subtitle: c.subject || c.sender_email,
        time: c.created_at || "",
        read: c.is_read || false,
      });
    });

    (downloads.data || []).forEach((d) => {
      items.push({
        id: d.id,
        type: "download",
        title: `Script downloaded`,
        subtitle: d.downloader_name || d.downloader_email || "Anonymous",
        time: d.created_at || "",
        read: true, // downloads don't have read state
      });
    });

    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifications(items.slice(0, 12));
    setUnreadCount((contacts.data || []).filter((c) => !c.is_read).length);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Realtime on contact_submissions
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions", filter: `profile_id=eq.${user.id}` },
        () => fetchNotifications()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleClick = (n: Notification) => {
    setOpen(false);
    if (n.type === "contact") {
      navigate("/dashboard/inbox");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="text-sm font-semibold">Notifications</h4>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-0 ${!n.read ? "bg-accent/20" : ""}`}
              >
                <p className="text-sm font-medium truncate">{n.title}</p>
                <p className="text-xs text-muted-foreground truncate">{n.subtitle}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {n.time ? formatDistanceToNow(new Date(n.time), { addSuffix: true }) : ""}
                </p>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
