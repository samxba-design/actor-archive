import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
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
import ProfileInsights from "@/pages/dashboard/ProfileInsights";
import CoverageSimulator from "@/pages/dashboard/CoverageSimulator";
import CompTitleMatcher from "@/pages/dashboard/CompTitleMatcher";
import CaseStudyBuilder from "@/pages/dashboard/CaseStudyBuilder";
import EndorsementRequests from "@/pages/dashboard/EndorsementRequests";
import IndustryTools from "@/pages/dashboard/IndustryTools";
import PipelineTracker from "@/pages/dashboard/PipelineTracker";
import SmartFollowUp from "@/pages/dashboard/SmartFollowUp";
import EmbedAndShare from "@/pages/dashboard/EmbedAndShare";
import ScriptManager from "@/pages/dashboard/ScriptManager";
import ClientManager from "@/pages/dashboard/ClientManager";
import PitchEmailGenerator from "@/pages/dashboard/PitchEmailGenerator";
import PublishedWorkManager from "@/pages/dashboard/PublishedWorkManager";
import CollectionsManager from "@/pages/dashboard/CollectionsManager";
import CustomSectionsManager from "@/pages/dashboard/CustomSectionsManager";
import ReelManager from "@/pages/dashboard/ReelManager";

const Dashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="scripts" element={<ScriptManager />} />
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
        <Route path="insights" element={<ProfileInsights />} />
        <Route path="coverage" element={<CoverageSimulator />} />
        <Route path="comps" element={<CompTitleMatcher />} />
        <Route path="case-study" element={<CaseStudyBuilder />} />
        <Route path="endorsements" element={<EndorsementRequests />} />
        <Route path="industry" element={<IndustryTools />} />
        <Route path="pipeline" element={<PipelineTracker />} />
        <Route path="follow-up" element={<SmartFollowUp />} />
        <Route path="embed" element={<EmbedAndShare />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="clients" element={<ClientManager />} />
        <Route path="pitch-email" element={<PitchEmailGenerator />} />
        <Route path="published-work" element={<PublishedWorkManager />} />
        <Route path="collections" element={<CollectionsManager />} />
        <Route path="custom-sections" element={<CustomSectionsManager />} />
        <Route path="reels" element={<ReelManager />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
