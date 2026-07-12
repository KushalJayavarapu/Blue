import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, User, ChevronDown, Star } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { ProfileModal } from '../ProfileModal';
import type { Page } from './Sidebar';

interface TopNavProps {
  onLogout: () => void;
}

type Notif = { title: string; desc: string; time: string; color: string; dot: string; page: Page };

const MANAGER_NOTIFS: Notif[] = [
  { title: 'Carbon target exceeded', desc: 'Engineering dept exceeded monthly CO₂ limit', time: '2m ago', color: 'text-red-400', dot: 'bg-red-500', page: 'environmental' },
  { title: 'New policy published', desc: 'Data Privacy Policy v2.0 requires acknowledgement', time: '1h ago', color: 'text-violet-400', dot: 'bg-violet-500', page: 'governance' },
  { title: 'Challenge completed', desc: 'Sarah Chen completed the Zero Waste Challenge', time: '3h ago', color: 'text-orange-400', dot: 'bg-orange-500', page: 'gamification' },
  { title: 'Audit scheduled', desc: 'ESG Disclosure Audit set for Jan 15, 2027', time: '5h ago', color: 'text-blue-400', dot: 'bg-blue-500', page: 'governance' },
];

const EMPLOYEE_NOTIFS: Notif[] = [
  { title: 'Participation approved!', desc: 'Your Tree Planting Drive submission was approved', time: '10m ago', color: 'text-emerald-400', dot: 'bg-emerald-500', page: 'social' },
  { title: 'New challenge available', desc: 'Zero Waste Week Challenge — 300 XP reward', time: '2h ago', color: 'text-orange-400', dot: 'bg-orange-500', page: 'gamification' },
  { title: 'Policy acknowledgement due', desc: 'Data Privacy Policy v2.0 — deadline Dec 15', time: '4h ago', color: 'text-violet-400', dot: 'bg-violet-500', page: 'governance' },
  { title: 'Points milestone', desc: 'You crossed 1,000 points — new badge unlocked!', time: '1d ago', color: 'text-orange-400', dot: 'bg-orange-500', page: 'gamification' },
];

const PAGE_LABELS: Partial<Record<Page, string>> = {
  environmental: 'Environmental',
  governance: 'Governance',
  gamification: 'Challenges',
  social: 'Explore Activities',
  reports: 'Reports',
};

export function TopNav({ onLogout }: TopNavProps) {
  const { user, onNavigate } = useRole();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [unread, setUnread] = useState(3);
  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifs = user.role === 'manager' ? MANAGER_NOTIFS : EMPLOYEE_NOTIFS;

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const handleNotifClick = (page: Page) => {
    setShowNotifs(false);
    onNavigate(page);
  };

  const avatarRing = user.role === 'manager'
    ? 'bg-emerald-500/20 border-emerald-500/30'
    : 'bg-blue-500/20 border-blue-500/30';
  const avatarText = user.role === 'manager' ? 'text-emerald-400' : 'text-blue-400';

  return (
    <>
    <header
      className="h-14 flex items-center px-6 gap-4 shrink-0"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(250,240,232,0.70) 100%)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderBottom: '1px solid rgba(112,75,106,0.12)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
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
        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => { setShowNotifs(v => !v); setUnread(0); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#111827] text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-[#111827] border border-[#1a2035] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1a2035] flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-200">Notifications</span>
                <span className="text-xs text-gray-600">{notifs.length} total</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => handleNotifClick(n.page)}
                    className="w-full px-4 py-3 hover:bg-[#1a2035] transition-colors border-b border-[#1a2035]/50 last:border-0 text-left"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-medium ${n.color}`}>{n.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.desc}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-700">{n.time}</span>
                          <span className="text-[10px] text-gray-600">→ {PAGE_LABELS[n.page] ?? n.page}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-[#1a2035] mx-1" />

        {/* Profile button — name + points visible inline */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(v => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#111827] transition-colors"
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 overflow-hidden ${avatarRing}`}>
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                : <span className={`text-[10px] font-bold ${avatarText}`}>{user.initials}</span>
              }
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-300 leading-tight">{user.name}</div>
              {/* Points row — always visible */}
              <div className="flex items-center gap-1 mt-px">
                <Star className="w-2.5 h-2.5 text-orange-500" style={{ minWidth: 10 }} />
                <span className="text-[10px] text-orange-500 font-semibold leading-none">{user.points.toLocaleString()} pts</span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-600 ml-0.5" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-52 bg-[#111827] border border-[#1a2035] rounded-xl shadow-2xl z-50 p-1">
              {/* Header */}
              <div className="px-3 py-2.5 border-b border-[#1a2035] mb-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 overflow-hidden ${avatarRing}`}>
                    {user.avatarUrl
                      ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      : <span className={`text-xs font-bold ${avatarText}`}>{user.initials}</span>
                    }
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-200">{user.name}</div>
                    <div className="text-[10px] text-gray-600">{user.email}</div>
                  </div>
                </div>
                {/* Role badge */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${
                  user.role === 'manager'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                }`}>
                  {user.roleIcon} {user.roleLabel}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-1 px-2 py-2 border-b border-[#1a2035] mb-1">
                {[
                  { label: 'Points', value: user.points.toLocaleString(), color: 'text-orange-400' },
                  { label: 'Level', value: `Lv ${user.level}`, color: 'text-blue-400' },
                  { label: 'Badges', value: String(user.badges), color: 'text-violet-400' },
                ].map(s => (
                  <div key={s.label} className="text-center py-0.5">
                    <div className={`text-xs font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[9px] text-gray-700 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-[#1a2035] hover:text-gray-200 rounded-lg transition-colors"
              >
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

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}
