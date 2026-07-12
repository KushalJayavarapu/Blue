import { LayoutDashboard, Leaf, Users, Shield, Trophy, FileText, Settings, ChevronDown, Building2 } from 'lucide-react';

export type Page = 'dashboard' | 'environmental' | 'social' | 'governance' | 'gamification' | 'reports' | 'settings';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  activeColor: string;
  activeBg: string;
  activeDot: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, iconColor: 'text-gray-500', activeColor: 'text-white', activeBg: 'bg-[#1e2533]', activeDot: 'bg-gray-400' },
  { id: 'environmental', label: 'Environmental', icon: Leaf, iconColor: 'text-emerald-600', activeColor: 'text-emerald-400', activeBg: 'bg-emerald-500/10', activeDot: 'bg-emerald-400' },
  { id: 'social', label: 'Social', icon: Users, iconColor: 'text-blue-600', activeColor: 'text-blue-400', activeBg: 'bg-blue-500/10', activeDot: 'bg-blue-400' },
  { id: 'governance', label: 'Governance', icon: Shield, iconColor: 'text-violet-600', activeColor: 'text-violet-400', activeBg: 'bg-violet-500/10', activeDot: 'bg-violet-400' },
  { id: 'gamification', label: 'Gamification', icon: Trophy, iconColor: 'text-orange-600', activeColor: 'text-orange-400', activeBg: 'bg-orange-500/10', activeDot: 'bg-orange-400' },
  { id: 'reports', label: 'Reports', icon: FileText, iconColor: 'text-gray-600', activeColor: 'text-gray-300', activeBg: 'bg-gray-700/40', activeDot: 'bg-gray-400' },
  { id: 'settings', label: 'Settings', icon: Settings, iconColor: 'text-slate-600', activeColor: 'text-slate-300', activeBg: 'bg-slate-700/40', activeDot: 'bg-slate-400' },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-[220px] min-h-screen bg-[#0b0f1a] border-r border-[#1a2035] flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#1a2035]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">EcoSphere</div>
            <div className="text-[10px] text-gray-600 leading-tight mt-0.5">ESG Platform</div>
          </div>
        </div>
      </div>

      {/* Org Selector */}
      <div className="px-3 py-3 border-b border-[#1a2035]">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827] border border-[#1a2035] hover:border-[#2a3550] transition-colors group">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">Acme Corporation</span>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? `${item.activeBg} ${item.activeColor}`
                  : 'text-gray-500 hover:bg-[#111827] hover:text-gray-300'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.activeColor : item.iconColor} group-hover:text-gray-300 transition-colors`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${item.activeDot}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1a2035]">
        <div className="text-[10px] text-gray-700">EcoSphere v2.4.1</div>
      </div>
    </div>
  );
}
