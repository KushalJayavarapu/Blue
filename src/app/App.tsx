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
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? 'dark' : 'light';

  if (!authed) {
    return (
      <div data-theme={theme}>
        <LoginPage onLogin={() => setAuthed(true)} />
        <Toaster theme={theme} position="bottom-right" />
      </div>
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
      data-theme={theme}
      className="flex min-h-screen"
      style={{
        background: isDark ? '#0b0f1a' : '#f1f5f9',
        color: isDark ? '#f1f5f9' : '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Sidebar currentPage={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          onLogout={() => setAuthed(false)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
        />

        <main className="flex-1 overflow-auto p-6 bg-[#0b0f1a]">
          <div className="max-w-[1200px] mx-auto">
            {pageMap[page]}
          </div>
        </main>
      </div>

      <Toaster theme={theme} position="bottom-right" />
    </div>
  );
}
