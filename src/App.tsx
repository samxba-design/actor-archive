import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

/* ── Lazy-loaded route components ── */
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const ProjectPitchPage = lazy(() => import("./pages/ProjectPitchPage"));
const DemoScreenwriter = lazy(() => import("./pages/DemoScreenwriter"));
const DemoActor = lazy(() => import("./pages/DemoActor"));
const DemoCopywriter = lazy(() => import("./pages/DemoCopywriter"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Explore = lazy(() => import("./pages/Explore"));
const TestimonialRequest = lazy(() => import("./pages/TestimonialRequest"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Explore = lazy(() => import("./pages/Explore"));
const TestimonialRequest = lazy(() => import("./pages/TestimonialRequest"));

/* ── Admin lazy-loaded routes ── */
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminModeration = lazy(() => import("./pages/admin/AdminModeration"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminDemoProfiles = lazy(() => import("./pages/admin/AdminDemoProfiles"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--landing-bg))" }}>
    <div className="h-8 w-8 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(var(--landing-accent))", borderTopColor: "transparent" }} />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* ── Admin Routes ── */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="demo-profiles" element={<AdminDemoProfiles />} />
              </Route>
              <Route path="/p/:slug" element={<PublicProfile />} />
              <Route path="/p/:slug/:projectSlug" element={<ProjectPitchPage />} />
              <Route path="/demo" element={<DemoScreenwriter />} />
              <Route path="/demo/screenwriter" element={<DemoScreenwriter />} />
              <Route path="/demo/actor" element={<DemoActor />} />
              <Route path="/demo/copywriter" element={<DemoCopywriter />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/t/:slug" element={<TestimonialRequest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
