import {
  LayoutDashboard, Leaf, Users, Shield, Trophy,
  FileText, Settings, ChevronDown, Building2, FlaskConical,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export type Page =
  | 'dashboard' | 'environmental' | 'social' | 'governance'
  | 'gamification' | 'reports' | 'settings' | 'simulator';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  managerOnly?: boolean;
  activeColor: string;
  activeBg: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',         icon: LayoutDashboard, managerOnly: true,
    activeColor: '#714B67', activeBg: 'rgba(113,75,103,0.14)' },
  { id: 'environmental', label: 'Environmental',      icon: Leaf,
    activeColor: '#10B981', activeBg: 'rgba(16,185,129,0.12)' },
  { id: 'social',        label: 'Explore Activities', icon: Users,
    activeColor: '#3B82F6', activeBg: 'rgba(59,130,246,0.12)' },
  { id: 'governance',    label: 'Governance',         icon: Shield,
    activeColor: '#8B5CF6', activeBg: 'rgba(139,92,246,0.12)' },
  { id: 'gamification',  label: 'Challenges',         icon: Trophy,
    activeColor: '#F59E0B', activeBg: 'rgba(245,158,11,0.12)' },
  { id: 'simulator',     label: 'Simulator',          icon: FlaskConical,
    activeColor: '#714B67', activeBg: 'rgba(113,75,103,0.14)' },
  { id: 'reports',       label: 'Reports',            icon: FileText,
    activeColor: '#9CA3AF', activeBg: 'rgba(156,163,175,0.12)' },
  { id: 'settings',      label: 'Settings',           icon: Settings, managerOnly: true,
    activeColor: '#714B67', activeBg: 'rgba(113,75,103,0.14)' },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
}

export function Sidebar({ currentPage, onNavigate, isDark }: SidebarProps) {
  const { isManager, user } = useRole();
  const visible = NAV_ITEMS.filter(item => !item.managerOnly || isManager);

  const glass   = isDark ? 'rgba(20,10,18,0.84)' : 'rgba(255,251,249,0.78)';
  const divider = isDark ? '1px solid rgba(113,75,103,0.22)' : '1px solid rgba(113,75,103,0.13)';

  const textPrimary = isDark ? '#F0E5EB' : '#2D1B29';
  const textSub     = isDark ? '#9A7888' : '#9B7A8C';
  const textMuted   = isDark ? '#50384A' : '#C0A0B4';
  const navInactive = isDark ? '#7A6072' : '#9B7A8C';
  const navHover    = isDark ? 'rgba(113,75,103,0.15)' : 'rgba(113,75,103,0.07)';
  const orgBg       = isDark ? 'rgba(113,75,103,0.13)' : 'rgba(113,75,103,0.06)';
  const orgBorder   = isDark ? 'rgba(113,75,103,0.28)' : 'rgba(113,75,103,0.16)';
  const orgHover    = isDark ? 'rgba(113,75,103,0.22)' : 'rgba(113,75,103,0.11)';
  const managerColor = isDark ? '#C490B0' : '#714B67';

  return (
    <div
      className="w-[220px] min-h-screen flex flex-col shrink-0"
      style={{
        background: glass,
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderRight: divider,
      }}
    >
      {/* Brand */}
      <div className="px-4 py-5" style={{ borderBottom: divider }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(113,75,103,0.16)', border: '1px solid rgba(113,75,103,0.32)' }}>
            <Leaf className="w-4 h-4" style={{ color: '#714B67' }} />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight" style={{ color: textPrimary }}>EcoSphere</div>
            <div className="text-[10px] leading-tight mt-0.5" style={{ color: textSub }}>ESG Platform</div>
          </div>
        </div>
      </div>

      {/* Org selector */}
      <div className="px-3 py-3" style={{ borderBottom: divider }}>
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all"
          style={{ background: orgBg, border: `1px solid ${orgBorder}` }}
          onMouseEnter={e => (e.currentTarget.style.background = orgHover)}
          onMouseLeave={e => (e.currentTarget.style.background = orgBg)}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" style={{ color: '#714B67' }} />
            <span className="text-xs font-medium" style={{ color: textPrimary }}>Acme Corporation</span>
          </div>
          <ChevronDown className="w-3 h-3" style={{ color: navInactive }} />
        </button>
      </div>

      {/* Role chip */}
      <div className="px-3 pt-3 pb-1">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
          style={isManager
            ? { color: managerColor, background: 'rgba(113,75,103,0.1)', border: '1px solid rgba(113,75,103,0.22)' }
            : { color: '#3B82F6',    background: 'rgba(59,130,246,0.1)',  border: '1px solid rgba(59,130,246,0.22)' }
          }
        >
          <span>{user.roleIcon}</span>
          <span>{user.roleLabel}</span>
          <span className="ml-auto" style={{ color: textMuted }}>{user.dept}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {visible.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
              style={{ background: isActive ? item.activeBg : 'transparent' }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = navHover; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? item.activeColor : navInactive }} />
              <span className="text-xs font-medium" style={{ color: isActive ? item.activeColor : navInactive }}>
                {item.label}
              </span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.activeColor }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: divider }}>
        <div className="text-[10px]" style={{ color: textMuted }}>EcoSphere v2.4.1</div>
      </div>
    </div>
  );
}
