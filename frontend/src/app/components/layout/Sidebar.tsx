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
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'environmental', label: 'Environmental',      icon: Leaf,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'social',        label: 'Explore Activities', icon: Users,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'governance',    label: 'Governance',         icon: Shield,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'gamification',  label: 'Challenges',         icon: Trophy,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'simulator',     label: 'Simulator',          icon: FlaskConical,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'reports',       label: 'Reports',            icon: FileText,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
  { id: 'settings',      label: 'Settings',           icon: Settings, managerOnly: true,
    activeColor: '#704B6A', activeBg: 'rgba(112,75,106,0.14)' },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { isManager, user } = useRole();
  const visible = NAV_ITEMS.filter(item => !item.managerOnly || isManager);

  const glass   = 'linear-gradient(160deg, rgba(255,255,255,0.68) 0%, rgba(250,240,232,0.60) 100%)';
  const divider = '1px solid rgba(112,75,106,0.14)';

  const textPrimary = '#2D1B29';
  const textSub     = '#7A5568';
  const textMuted   = '#7D5C70';
  const navInactive = '#6B4A5A';
  const navHover    = 'rgba(112,75,106,0.07)';
  const orgBg       = 'rgba(112,75,106,0.06)';
  const orgBorder   = 'rgba(112,75,106,0.16)';
  const orgHover    = 'rgba(112,75,106,0.11)';
  const managerColor = '#704B6A';

  return (
    <div
      className="w-[220px] min-h-screen flex flex-col shrink-0"
      style={{
        background: glass,
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderRight: divider,
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.5)',
      }}
    >
      {/* Brand */}
      <div className="px-4 py-5" style={{ borderBottom: divider }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(112,75,106,0.16)', border: '1px solid rgba(112,75,106,0.32)' }}>
            <Leaf className="w-4 h-4" style={{ color: '#704B6A' }} />
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
            <Building2 className="w-3.5 h-3.5" style={{ color: '#704B6A' }} />
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
            ? { color: managerColor, background: 'rgba(112,75,106,0.1)', border: '1px solid rgba(112,75,106,0.22)' }
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
