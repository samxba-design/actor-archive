import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, UserPlus, MessageSquare, Star } from "lucide-react";

interface SocialProofEvent {
  type: "view" | "signup" | "contact" | "testimonial";
  name?: string;
  location?: string;
  time?: string;
}

const MOCK_EVENTS: SocialProofEvent[] = [
  { type: "view", name: "Someone from Los Angeles", time: "2 minutes ago" },
  { type: "signup", name: "A new writer", location: "New York", time: "5 minutes ago" },
  { type: "contact", name: "A casting director", time: "12 minutes ago" },
  { type: "view", name: "Someone from London", time: "15 minutes ago" },
  { type: "testimonial", name: "A producer", time: "1 hour ago" },
];

interface SocialProofToastProps {
  /** Enable/disable the feature */
  enabled?: boolean;
  /** Minimum delay between toasts (ms) */
  minDelay?: number;
  /** Maximum delay between toasts (ms) */
  maxDelay?: number;
  /** Maximum number of toasts to show per session */
  maxPerSession?: number;
  /** Custom events to display (otherwise uses realistic mock data) */
  events?: SocialProofEvent[];
}

const SocialProofToast = ({
  enabled = true,
  minDelay = 30000, // 30 seconds
  maxDelay = 90000, // 90 seconds
  maxPerSession = 5,
  events = MOCK_EVENTS,
}: SocialProofToastProps) => {
  const { toast } = useToast();
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    if (!enabled || shownCount >= maxPerSession) return;

    const showToast = () => {
      const event = events[Math.floor(Math.random() * events.length)];
      
      const icons = {
        view: Eye,
        signup: UserPlus,
        contact: MessageSquare,
        testimonial: Star,
      };
      
      const messages = {
        view: `${event.name || "Someone"} viewed a portfolio`,
        signup: `${event.name || "A creative"} just joined${event.location ? ` from ${event.location}` : ""}`,
        contact: `${event.name || "Someone"} sent a message`,
        testimonial: `${event.name || "Someone"} left a review`,
      };

      const Icon = icons[event.type];

      toast({
        description: (
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: "hsl(var(--landing-accent) / 0.12)" }}
            >
              <Icon className="h-4 w-4" style={{ color: "hsl(var(--landing-accent))" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: "hsl(var(--landing-fg))" }}>{messages[event.type]}</p>
              <p className="text-xs" style={{ color: "hsl(var(--landing-muted))" }}>{event.time || "Just now"}</p>
            </div>
          </div>
        ),
        duration: 4000,
      });

      setShownCount((c) => c + 1);
    };

    // Random delay between min and max
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    const timer = setTimeout(showToast, delay);

    return () => clearTimeout(timer);
  }, [enabled, shownCount, maxPerSession, events, minDelay, maxDelay, toast]);

  // Reset count periodically to allow more toasts
  useEffect(() => {
    const resetTimer = setInterval(() => {
      setShownCount(0);
    }, maxDelay * maxPerSession * 2);

    return () => clearInterval(resetTimer);
  }, [maxDelay, maxPerSession]);

  return null; // This component only produces side effects
};

export default SocialProofToast;
