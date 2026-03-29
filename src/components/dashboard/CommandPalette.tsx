import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Home,
  User,
  FolderOpen,
  Image,
  BarChart3,
  Settings,
  Inbox,
  FileText,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const COMMANDS = [
  { id: "home", label: "Go to Home", icon: Home, path: "/dashboard" },
  { id: "profile", label: "Edit Profile", icon: User, path: "/dashboard/profile" },
  { id: "projects", label: "Manage Projects", icon: FolderOpen, path: "/dashboard/projects" },
  { id: "gallery", label: "Manage Gallery", icon: Image, path: "/dashboard/gallery" },
  { id: "analytics", label: "View Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { id: "inbox", label: "Open Inbox", icon: Inbox, path: "/dashboard/inbox" },
  { id: "scripts", label: "Scripts & Docs", icon: FileText, path: "/dashboard/scripts" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("slug")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.slug) setSlug(data.slug);
        });
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const run = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Portfolio URL copied!" });
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {COMMANDS.map((cmd) => (
            <CommandItem key={cmd.id} onSelect={() => run(cmd.path)}>
              <cmd.icon className="mr-2 h-4 w-4" />
              {cmd.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {slug && (
          <CommandGroup heading="Portfolio">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.open(`/p/${slug}`, "_blank");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View my portfolio
            </CommandItem>
            <CommandItem onSelect={copyUrl}>
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy portfolio URL
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
