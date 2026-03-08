import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, CalendarDays, Trophy, FileText, Users } from "lucide-react";
import { Loader2 } from "lucide-react";

const CONTEST_DEADLINES = [
  { name: "Nicholl Fellowship", org: "Academy of Motion Picture Arts", deadline: "May 1", type: "screenwriting", url: "https://www.oscars.org/nicholl" },
  { name: "Austin Film Festival", org: "AFF", deadline: "June 1", type: "screenwriting", url: "https://austinfilmfestival.com" },
  { name: "PAGE Awards", org: "PAGE International", deadline: "March 1", type: "screenwriting", url: "https://pageawards.com" },
  { name: "BlueCat Screenplay Competition", org: "BlueCat", deadline: "Multiple", type: "screenwriting", url: "https://www.bluecatscreenplay.com" },
  { name: "Sundance Screenwriters Lab", org: "Sundance Institute", deadline: "June (varies)", type: "screenwriting", url: "https://www.sundance.org" },
  { name: "The Blacklist", org: "The Black List", deadline: "Rolling", type: "screenwriting", url: "https://blcklst.com" },
  { name: "Samuel French OAP Festival", org: "Samuel French", deadline: "September", type: "playwriting", url: "https://www.concordtheatricals.com" },
  { name: "O'Neill Playwrights Conference", org: "Eugene O'Neill Theater Center", deadline: "October 1", type: "playwriting" },
];

const STAFFING_CHECKLIST = [
  { task: "Update your logline portfolio", desc: "Make sure every pilot/spec has a polished logline" },
  { task: "Refresh your bio for the season", desc: "Highlight your most recent credits" },
  { task: "Update representation info", desc: "Confirm agent/manager contact details are current" },
  { task: "Polish your spec & original samples", desc: "Ensure your best 2-3 samples are ready to send" },
  { task: "Prepare a 'What I'm Working On' blurb", desc: "Shows you're active and engaged" },
  { task: "Review your comp titles", desc: "Run the Comp Matcher on your projects" },
  { task: "Run coverage on your top project", desc: "Use the Coverage Simulator to pressure-test" },
  { task: "Share your portfolio link", desc: "Send your link to reps and contacts" },
];

const IndustryTools = () => {
  const { user } = useAuth();
  const [profileType, setProfileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("profile_type").eq("id", user.id).single()
      .then(({ data }) => { setProfileType(data?.profile_type || null); setLoading(false); });
  }, [user]);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const isWriter = ["screenwriter", "tv_writer", "playwright"].includes(profileType || "");
  const relevantContests = CONTEST_DEADLINES.filter((c) => {
    if (profileType === "playwright") return c.type === "playwriting";
    if (isWriter) return c.type === "screenwriting";
    return true;
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Industry Tools</h1>
        <p className="text-muted-foreground mt-1">Deadlines, checklists, and resources for your career.</p>
      </div>

      {/* Staffing Season Checklist */}
      {isWriter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Staffing Season Prep
            </CardTitle>
            <CardDescription>
              {checkedItems.size}/{STAFFING_CHECKLIST.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {STAFFING_CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors text-left"
              >
                {checkedItems.has(i)
                  ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  : <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-medium ${checkedItems.has(i) ? "line-through text-muted-foreground" : ""}`}>{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Contest Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Contest & Fellowship Deadlines
          </CardTitle>
          <CardDescription>Key upcoming deadlines for {profileType || "creatives"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {relevantContests.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-md border">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.org}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {c.deadline}
                </Badge>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    Visit →
                  </a>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryTools;
