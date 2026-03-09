import { useAdmin } from "@/hooks/useAdmin";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
