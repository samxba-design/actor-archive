import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProfileEditor from "@/pages/dashboard/ProfileEditor";
import ProjectsManager from "@/pages/dashboard/ProjectsManager";
import GalleryManager from "@/pages/dashboard/GalleryManager";
import SocialLinksManager from "@/pages/dashboard/SocialLinksManager";
import ContactInbox from "@/pages/dashboard/ContactInbox";
import AnalyticsOverview from "@/pages/dashboard/AnalyticsOverview";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import ServicesManager from "@/pages/dashboard/ServicesManager";
import AwardsManager from "@/pages/dashboard/AwardsManager";
import EducationManager from "@/pages/dashboard/EducationManager";
import EventsManager from "@/pages/dashboard/EventsManager";
import PressManager from "@/pages/dashboard/PressManager";
import TestimonialsManager from "@/pages/dashboard/TestimonialsManager";
import SkillsManager from "@/pages/dashboard/SkillsManager";
import RepresentationManager from "@/pages/dashboard/RepresentationManager";

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<ProfileEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="social" element={<SocialLinksManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="awards" element={<AwardsManager />} />
        <Route path="education" element={<EducationManager />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="press" element={<PressManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="representation" element={<RepresentationManager />} />
        <Route path="inbox" element={<ContactInbox />} />
        <Route path="analytics" element={<AnalyticsOverview />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
