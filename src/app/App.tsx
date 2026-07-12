import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar, type Page } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { EnvironmentalPage } from './components/pages/EnvironmentalPage';
import { SocialPage } from './components/pages/SocialPage';
import { GovernancePage } from './components/pages/GovernancePage';
import { GamificationPage } from './components/pages/GamificationPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { SettingsPage } from './components/pages/SettingsPage';

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');

  if (!authed) {
    return (
      <>
        <LoginPage onLogin={() => setAuthed(true)} />
        <Toaster theme="dark" position="bottom-right" />
      </>
    );
  }

  const pageMap: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage onNavigate={setPage} />,
    environmental: <EnvironmentalPage />,
    social: <SocialPage />,
    governance: <GovernancePage />,
    gamification: <GamificationPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: '#0b0f1a',
        color: '#f1f5f9',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Sidebar currentPage={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav onLogout={() => setAuthed(false)} />

        <main className="flex-1 overflow-auto p-6 bg-[#0b0f1a]">
          <div className="max-w-[1200px] mx-auto">
            {pageMap[page]}
          </div>
        </main>
      </div>

      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
