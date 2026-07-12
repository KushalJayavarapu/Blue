import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EnvironmentalPage from "@/pages/environmental/EnvironmentalPage";
import SocialPage from "@/pages/social/SocialPage";
import GovernancePage from "@/pages/governance/GovernancePage";
import GamificationPage from "@/pages/gamification/GamificationPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AppShell from "@/components/AppShell";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/environmental", element: <EnvironmentalPage /> },
      { path: "/social", element: <SocialPage /> },
      { path: "/governance", element: <GovernancePage /> },
      { path: "/gamification", element: <GamificationPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
