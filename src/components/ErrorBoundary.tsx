import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)" }}>
          <div className="text-center max-w-lg space-y-6">
            {/* Cinematic error icon */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Scene Interrupted
              </h1>
              <p className="text-muted-foreground">
                Something unexpected happened. Don't worry — your data is safe.
              </p>
            </div>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-muted/50 rounded-lg p-4 text-xs">
                <summary className="cursor-pointer text-muted-foreground flex items-center gap-2">
                  <Bug className="h-3 w-3" />
                  Technical details
                </summary>
                <pre className="mt-2 overflow-auto text-destructive/80 whitespace-pre-wrap">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={() => window.location.reload()} size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/"}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If this keeps happening, try clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
