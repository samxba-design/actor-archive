import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProfileEditor from "@/pages/dashboard/ProfileEditor";
import ProjectsManager from "@/pages/dashboard/ProjectsManager";
import GalleryManager from "@/pages/dashboard/GalleryManager";
import SocialLinksManager from "@/pages/dashboard/SocialLinksManager";
import ContactInbox from "@/pages/dashboard/ContactInbox";
import AnalyticsOverview from "@/pages/dashboard/AnalyticsOverview";
import SettingsPage from "@/pages/dashboard/SettingsPage";

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<ProfileEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="social" element={<SocialLinksManager />} />
        <Route path="inbox" element={<ContactInbox />} />
        <Route path="analytics" element={<AnalyticsOverview />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
