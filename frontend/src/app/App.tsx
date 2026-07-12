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
import { SimulatorPage } from './components/pages/SimulatorPage';
import { RoleContext, EMPLOYEE_PROFILE, MANAGER_PROFILE } from './context/RoleContext';
import type { UserRole, UserProfile } from './context/RoleContext';

function toInitials(name: string) {
  return name.trim().split(/\s+/).map(p => p[0] ?? '').join('').toUpperCase().slice(0, 2);
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<UserRole>('manager');
  const [page, setPage] = useState<Page>('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [employeeProfile, setEmployeeProfile] = useState<UserProfile>(EMPLOYEE_PROFILE);
  const [managerProfile, setManagerProfile] = useState<UserProfile>(MANAGER_PROFILE);

  const theme = isDark ? 'dark' : 'light';
  const user = role === 'employee' ? employeeProfile : managerProfile;

  const handleLogin = (loginRole: UserRole) => {
    setRole(loginRole);
    setAuthed(true);
    setPage(loginRole === 'employee' ? 'gamification' : 'dashboard');
  };

  const handleLogout = () => {
    setAuthed(false);
    setRole('manager');
    setPage('dashboard');
  };

  const handleUpdateProfile = (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'dept' | 'avatarUrl'>>) => {
    const patch: Partial<UserProfile> = { ...updates };
    if (updates.name) patch.initials = toInitials(updates.name);
    if (role === 'employee') {
      setEmployeeProfile(p => ({ ...p, ...patch }));
    } else {
      setManagerProfile(p => ({ ...p, ...patch }));
    }
  };

  if (!authed) {
    return (
      <div data-theme={theme}>
        <LoginPage onLogin={handleLogin} />
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
    simulator: <SimulatorPage />,
  };

  return (
    <RoleContext.Provider value={{
      user,
      isManager: role === 'manager',
      isEmployee: role === 'employee',
      onNavigate: setPage,
      onUpdateProfile: handleUpdateProfile,
    }}>
      <div
        data-theme={theme}
        className="flex min-h-screen"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 18% 55%, rgba(113,75,103,0.24) 0%, transparent 52%), radial-gradient(ellipse at 82% 12%, rgba(113,75,103,0.13) 0%, transparent 42%), #1C1016'
            : 'radial-gradient(ellipse at 18% 55%, rgba(113,75,103,0.11) 0%, transparent 52%), radial-gradient(ellipse at 82% 12%, rgba(240,220,200,0.7) 0%, transparent 42%), #F4EBE2',
          color: isDark ? '#F0E5EB' : '#2D1B29',
          fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <Sidebar currentPage={page} onNavigate={setPage} isDark={isDark} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav
            onLogout={handleLogout}
            isDark={isDark}
            onToggleTheme={() => setIsDark(d => !d)}
          />
          <main className="flex-1 overflow-auto p-6" style={{ background: 'transparent' }}>
            <div className="max-w-[1200px] mx-auto">
              {pageMap[page]}
            </div>
          </main>
        </div>

        <Toaster theme={theme} position="bottom-right" />
      </div>
    </RoleContext.Provider>
  );
}
