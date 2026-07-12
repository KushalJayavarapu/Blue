import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const notifications = [
  { title: 'Carbon target exceeded', desc: 'Engineering dept exceeded monthly CO₂ limit', time: '2m ago', color: 'text-red-400', dot: 'bg-red-500' },
  { title: 'New policy published', desc: 'Data Privacy Policy v2.0 requires acknowledgement', time: '1h ago', color: 'text-violet-400', dot: 'bg-violet-500' },
  { title: 'Challenge completed', desc: 'Sarah Chen completed the Zero Waste Challenge', time: '3h ago', color: 'text-orange-400', dot: 'bg-orange-500' },
  { title: 'Audit scheduled', desc: 'ESG Disclosure Audit set for Jan 15, 2027', time: '5h ago', color: 'text-blue-400', dot: 'bg-blue-500' },
];

export function TopNav({ onLogout, isDark, onToggleTheme }: TopNavProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unread, setUnread] = useState(3);
  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-14 bg-[#0b0f1a] border-b border-[#1a2035] flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
          <input
            type="text"
            placeholder="Search modules, reports, goals..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#111827] border border-[#1a2035] rounded-lg text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-[#2a3550] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`
            relative flex items-center gap-1 px-1 py-1 rounded-xl transition-all duration-300 group
            ${isDark
              ? 'bg-[#111827] border border-[#1a2035] hover:border-[#2a3550]'
              : 'bg-[#111827] border border-[#1a2035] hover:border-[#2a3550]'
            }
          `}
          style={{ minWidth: 60 }}
        >
          {/* Sun */}
          <span className={`
            flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300
            ${!isDark ? 'bg-amber-500/20 text-amber-400' : 'text-gray-600 hover:text-gray-400'}
          `}>
            <Sun className="w-3.5 h-3.5" />
          </span>
          {/* Moon */}
          <span className={`
            flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-300
            ${isDark ? 'bg-blue-500/20 text-blue-400' : 'text-gray-600 hover:text-gray-400'}
          `}>
            <Moon className="w-3.5 h-3.5" />
          </span>
          {/* Sliding indicator pill */}
          <span
            className={`
              absolute top-1 w-6 h-6 rounded-lg transition-all duration-300 pointer-events-none
              ${isDark ? 'translate-x-[30px] bg-blue-500/15 border border-blue-500/30' : 'translate-x-[2px] bg-amber-500/15 border border-amber-500/30'}
            `}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1a2035] mx-1" />

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) setUnread(0); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#111827] text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-[#111827] border border-[#1a2035] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a2035] flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-200">Notifications</span>
                <span className="text-xs text-gray-600">{notifications.length} total</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-[#1a2035] transition-colors cursor-pointer border-b border-[#1a2035]/50 last:border-0">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                      <div>
                        <div className={`text-xs font-medium ${n.color}`}>{n.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</div>
                        <div className="text-[10px] text-gray-700 mt-1">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1a2035] mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#111827] transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-emerald-400">JD</span>
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-300">John Doe</div>
              <div className="text-[10px] text-gray-600">ESG Admin</div>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-11 w-44 bg-[#111827] border border-[#1a2035] rounded-xl shadow-2xl z-50 p-1">
              <div className="px-3 py-2 border-b border-[#1a2035] mb-1">
                <div className="text-xs font-medium text-gray-300">John Doe</div>
                <div className="text-[10px] text-gray-600">john@acmecorp.com</div>
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-[#1a2035] hover:text-gray-200 rounded-lg transition-colors">
                <User className="w-3.5 h-3.5" /> My Profile
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
