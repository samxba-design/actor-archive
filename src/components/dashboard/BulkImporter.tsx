import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Check, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ImportTable = "skills" | "education" | "awards" | "press" | "projects";

const TABLE_SCHEMAS: Record<ImportTable, { columns: string[]; required: string[] }> = {
  skills: { columns: ["name", "category", "proficiency"], required: ["name"] },
  education: { columns: ["institution", "degree_or_certificate", "field_of_study", "year_start", "year_end"], required: ["institution"] },
  awards: { columns: ["name", "organization", "year", "result", "category"], required: ["name"] },
  press: { columns: ["title", "publication", "date", "article_url", "excerpt"], required: ["title"] },
  projects: { columns: ["title", "project_type", "description", "role_name", "year", "client"], required: ["title", "project_type"] },
};

interface BulkImporterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTable?: ImportTable;
  onComplete?: () => void;
}

export const BulkImporter = ({ open, onOpenChange, defaultTable, onComplete }: BulkImporterProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [table, setTable] = useState<ImportTable>(defaultTable || "skills");
  const [rawInput, setRawInput] = useState("");
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [step, setStep] = useState<"input" | "preview" | "saving" | "done">("input");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => { setStep("input"); setRawInput(""); setParsedRows([]); setError(null); };

  const parseInput = () => {
    setError(null);
    try {
      // Try JSON first
      let rows: any[];
      const trimmed = rawInput.trim();
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        const parsed = JSON.parse(trimmed.startsWith("{") ? `[${trimmed}]` : trimmed);
        rows = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // CSV parsing
        const lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("CSV needs a header row and at least one data row");
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));
        rows = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { if (values[i]) obj[h] = values[i]; });
          return obj;
        });
      }

      const schema = TABLE_SCHEMAS[table];
      // Validate required fields
      const invalid = rows.filter(r => !schema.required.every(f => r[f]));
      if (invalid.length > 0) {
        throw new Error(`${invalid.length} rows missing required fields: ${schema.required.join(", ")}`);
      }

      setParsedRows(rows);
      setStep("preview");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImport = async () => {
    if (!user || !parsedRows.length) return;
    setSaving(true);
    setStep("saving");

    try {
      const insertRows = parsedRows.map((row, i) => ({
        ...row,
        profile_id: user.id,
        display_order: i,
        year: row.year ? parseInt(row.year) : undefined,
        year_start: row.year_start ? parseInt(row.year_start) : undefined,
        year_end: row.year_end ? parseInt(row.year_end) : undefined,
      }));

      const { error } = await supabase.from(table).insert(insertRows as any);
      if (error) throw error;

      toast({ title: "Bulk import complete!", description: `Imported ${parsedRows.length} ${table} items.` });
      setStep("done");
      onComplete?.();
      setTimeout(() => { onOpenChange(false); reset(); }, 1500);
    } catch (err: any) {
      setError(err.message);
      setStep("preview");
    } finally {
      setSaving(false);
    }
  };

  const schema = TABLE_SCHEMAS[table];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Bulk Import</DialogTitle>
          <DialogDescription>Paste CSV or JSON data to import multiple items at once.</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div>
              <Label>Import to</Label>
              <Select value={table} onValueChange={(v) => setTable(v as ImportTable)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="skills">Skills</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="awards">Awards</SelectItem>
                  <SelectItem value="press">Press</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data (CSV or JSON)</Label>
              <Textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={8}
                placeholder={`CSV example:\n${schema.columns.join(",")}\nValue1,Value2,...\n\nOr JSON:\n[{"${schema.columns[0]}": "value"}]`}
              />
              <p className="text-xs text-muted-foreground mt-1">Required columns: {schema.required.join(", ")}</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />{error}
              </div>
            )}

            <Button onClick={parseInput} disabled={!rawInput.trim()} className="w-full">Parse & Preview</Button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{parsedRows.length} rows ready to import into {table}.</p>
            <div className="max-h-60 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(parsedRows[0] || {}).slice(0, 5).map(col => (
                      <TableHead key={col} className="text-xs">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).slice(0, 5).map((val, j) => (
                        <TableCell key={j} className="text-xs truncate max-w-[150px]">{String(val)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedRows.length > 10 && <p className="text-xs text-muted-foreground">Showing 10 of {parsedRows.length} rows</p>}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />{error}
              </div>
            )}
          </div>
        )}

        {step === "saving" && (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Importing {parsedRows.length} items...</p>
          </div>
        )}

        {step === "done" && (
          <div className="py-8 text-center">
            <Check className="h-10 w-10 mx-auto text-primary" />
            <p className="text-sm font-medium mt-3">Import complete!</p>
          </div>
        )}

        {step === "preview" && (
          <DialogFooter>
            <Button variant="outline" onClick={reset}>Back</Button>
            <Button onClick={handleImport} disabled={saving}>Import {parsedRows.length} items</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
