import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, CalendarDays, Trophy, FileText, BookOpen } from "lucide-react";
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
  // Literary contests
  { name: "PEN/Faulkner Award", org: "PEN America", deadline: "October 31", type: "literary", url: "https://www.penfaulkner.org" },
  { name: "National Book Award", org: "National Book Foundation", deadline: "June (publisher submit)", type: "literary", url: "https://www.nationalbook.org" },
  { name: "Pushcart Prize", org: "Pushcart Press", deadline: "December 1", type: "literary", url: "https://www.pushcartprize.com" },
  { name: "Reedsy Short Story Contest", org: "Reedsy", deadline: "Weekly", type: "literary", url: "https://blog.reedsy.com/short-story-contest" },
  { name: "Graywolf Press Nonfiction Prize", org: "Graywolf Press", deadline: "June–August", type: "literary", url: "https://www.graywolfpress.org" },
  { name: "Dzanc Books Prize", org: "Dzanc Books", deadline: "Varies", type: "literary", url: "https://www.dzancbooks.org" },
  { name: "Restless Books Prize for New Immigrant Writing", org: "Restless Books", deadline: "March", type: "literary", url: "https://restlessbooks.org" },
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

const QUERY_SEASON_CHECKLIST = [
  { task: "Polish your query letter", desc: "Concise hook, comp titles, bio — under one page" },
  { task: "Prepare a 1-page synopsis", desc: "Beginning, middle, and end with emotional beats" },
  { task: "Update your comp titles", desc: "2-3 recent, successful titles in your genre" },
  { task: "Format sample chapters", desc: "First 3 chapters or 50 pages, properly formatted" },
  { task: "Research target agents/editors", desc: "Build a submission list of 15-20 matches" },
  { task: "Update your author bio", desc: "Publications, awards, relevant credentials" },
  { task: "Prepare a book blurb", desc: "Back-cover-style pitch paragraph" },
  { task: "Share your portfolio link", desc: "Send your CreativeSlate link to agents and editors" },
];

const IndustryTools = () => {
  const { user } = useAuth();
  const [profileType, setProfileType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [checkedQueryItems, setCheckedQueryItems] = useState<Set<number>>(new Set());

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

  const toggleQueryCheck = (idx: number) => {
    setCheckedQueryItems((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  const isWriter = ["screenwriter", "tv_writer", "playwright"].includes(profileType || "");
  const isAuthor = profileType === "author";

  const relevantContests = CONTEST_DEADLINES.filter((c) => {
    if (isAuthor) return c.type === "literary";
    if (profileType === "playwright") return c.type === "playwriting";
    if (isWriter) return c.type === "screenwriting";
    return true;
  });

  const activeChecklist = isAuthor ? QUERY_SEASON_CHECKLIST : STAFFING_CHECKLIST;
  const activeCheckState = isAuthor ? checkedQueryItems : checkedItems;
  const activeToggle = isAuthor ? toggleQueryCheck : toggleCheck;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Industry Tools</h1>
        <p className="text-muted-foreground mt-1">Deadlines, checklists, and resources for your career.</p>
      </div>

      {/* Checklist — writers & authors */}
      {(isWriter || isAuthor) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {isAuthor ? <BookOpen className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
              {isAuthor ? "Query Season Prep" : "Staffing Season Prep"}
            </CardTitle>
            <CardDescription>
              {activeCheckState.size}/{activeChecklist.length} completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeChecklist.map((item, i) => (
              <button
                key={i}
                onClick={() => activeToggle(i)}
                className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors text-left"
              >
                {activeCheckState.has(i)
                  ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  : <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-medium ${activeCheckState.has(i) ? "line-through text-muted-foreground" : ""}`}>{item.task}</p>
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
            {isAuthor ? "Literary Prizes & Contests" : "Contest & Fellowship Deadlines"}
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
