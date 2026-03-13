import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ManagerErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ManagerErrorState = ({ message = "Failed to load data.", onRetry }: ManagerErrorStateProps) => (
  <Card className="border-destructive/30">
    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Try again
        </Button>
      )}
    </CardContent>
  </Card>
);

export default ManagerErrorState;
