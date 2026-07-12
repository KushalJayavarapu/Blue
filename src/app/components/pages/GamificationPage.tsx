import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

type GameTab = 'challenges' | 'participation' | 'badges' | 'rewards' | 'leaderboard';

type Challenge = {
  id: number;
  name: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: string;
  col: string;
  participants: number;
};

const kanbanCols = [
  { id: 'draft', label: 'Draft', color: 'text-gray-400', border: 'border-gray-500/15', bg: 'bg-gray-500/3' },
  { id: 'active', label: 'Active', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
  { id: 'review', label: 'Under Review', color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
  { id: 'completed', label: 'Completed', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
  { id: 'archived', label: 'Archived', color: 'text-gray-600', border: 'border-gray-500/10', bg: 'bg-gray-500/3' },
];

const initialChallenges: Challenge[] = [
  { id: 1, name: 'Zero Waste Week', xp: 500, difficulty: 'Medium', deadline: 'Jul 31', col: 'active', participants: 42 },
  { id: 2, name: 'Bike to Work Month', xp: 300, difficulty: 'Easy', deadline: 'Aug 31', col: 'active', participants: 28 },
  { id: 3, name: 'Carbon Calculator', xp: 200, difficulty: 'Easy', deadline: 'Jul 20', col: 'draft', participants: 0 },
  { id: 4, name: 'Solar Project', xp: 1000, difficulty: 'Hard', deadline: 'Dec 31', col: 'review', participants: 8 },
  { id: 5, name: 'Tree Planting Drive', xp: 750, difficulty: 'Medium', deadline: 'Sep 30', col: 'active', participants: 65 },
  { id: 6, name: 'Green Commute', xp: 250, difficulty: 'Easy', deadline: 'Jun 30', col: 'completed', participants: 91 },
  { id: 7, name: 'Energy Audit', xp: 600, difficulty: 'Hard', deadline: 'Nov 30', col: 'draft', participants: 0 },
  { id: 8, name: 'Water Conservation', xp: 400, difficulty: 'Medium', deadline: 'Aug 31', col: 'archived', participants: 37 },
];

const badges = [
  { name: 'Eco Warrior', desc: 'Complete 5 environmental challenges', emoji: '🌿', rarity: 'Rare', earned: 234 },
  { name: 'Carbon Saver', desc: 'Reduce personal carbon footprint by 20%', emoji: '💨', rarity: 'Epic', earned: 89 },
  { name: 'Community Hero', desc: 'Participate in 3 CSR activities', emoji: '🦸', rarity: 'Common', earned: 412 },
  { name: 'Policy Champion', desc: 'Acknowledge all required policies', emoji: '📋', rarity: 'Common', earned: 356 },
  { name: 'Green Pioneer', desc: 'First to complete a new challenge', emoji: '🏅', rarity: 'Legendary', earned: 12 },
  { name: 'ESG Master', desc: 'Achieve 90+ on all ESG dimensions', emoji: '⭐', rarity: 'Legendary', earned: 5 },
];

const initialRewards = [
  { id: 1, name: 'Extra Day Off', desc: 'One additional paid leave day', points: 1500, category: 'Leave', emoji: '🏖️' },
  { id: 2, name: 'Eco Gift Hamper', desc: 'Premium sustainable products set', points: 800, category: 'Gift', emoji: '🎁' },
  { id: 3, name: 'Training Voucher', desc: '$200 online learning credit', points: 1000, category: 'Learning', emoji: '📚' },
  { id: 4, name: 'Green Team Lunch', desc: 'Team lunch at an eco restaurant', points: 500, category: 'Experience', emoji: '🍃' },
  { id: 5, name: 'Charity Donation', desc: 'Donate $100 in your name', points: 600, category: 'Charity', emoji: '💚' },
  { id: 6, name: 'Plant a Tree', desc: 'Official tree planted in your name', points: 200, category: 'Environment', emoji: '🌳' },
];

const topDepts = [
  { rank: 1, name: 'HR', score: 9840, change: '+120', up: true },
  { rank: 2, name: 'Engineering', score: 8720, change: '+85', up: true },
  { rank: 3, name: 'Marketing', score: 7630, change: '+210', up: true },
  { rank: 4, name: 'Finance', score: 6910, change: '-30', up: false },
  { rank: 5, name: 'Operations', score: 5840, change: '+45', up: true },
];

const topEmployees = [
  { rank: 1, name: 'Sarah Chen', dept: 'HR', points: 4280, initials: 'SC' },
  { rank: 2, name: 'Marcus Johnson', dept: 'Engineering', points: 3940, initials: 'MJ' },
  { rank: 3, name: 'Emma Williams', dept: 'Marketing', points: 3710, initials: 'EW' },
  { rank: 4, name: 'James Lee', dept: 'Engineering', points: 3200, initials: 'JL' },
  { rank: 5, name: 'Aria Patel', dept: 'HR', points: 2990, initials: 'AP' },
];

function DiffBadge({ d }: { d: string }) {
  const map: Record<string, string> = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${map[d]}`}>{d}</span>;
}

function RarityBadge({ r }: { r: string }) {
  const map: Record<string, string> = {
    Common: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    Rare: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Epic: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    Legendary: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded border ${map[r]}`}>{r}</span>;
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-base">🥇</span>;
  if (rank === 2) return <span className="text-base">🥈</span>;
  if (rank === 3) return <span className="text-base">🥉</span>;
  return <span className="text-xs font-bold text-gray-600">#{rank}</span>;
}

type NewChallengeForm = { name: string; xp: string; difficulty: 'Easy' | 'Medium' | 'Hard'; deadline: string };
const emptyChallenge: NewChallengeForm = { name: '', xp: '200', difficulty: 'Easy', deadline: '' };

function NewChallengeModal({ onClose, onSave }: { onClose: () => void; onSave: (data: NewChallengeForm) => void }) {
  const [form, setForm] = useState<NewChallengeForm>(emptyChallenge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Challenge name is required'); return; }
    if (!form.deadline) { toast.error('Deadline is required'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">New Challenge</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Challenge Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Solar Panel Initiative"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-orange-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">XP Reward</label>
              <input
                type="number"
                value={form.xp}
                onChange={e => setForm(p => ({ ...p, xp: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500/40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(p => ({ ...p, difficulty: e.target.value as NewChallengeForm['difficulty'] }))}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-orange-500/40"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Deadline *</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-orange-500/40"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors">Create Challenge</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GamificationPage() {
  const [activeTab, setActiveTab] = useState<GameTab>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());
  const [showNewChallenge, setShowNewChallenge] = useState(false);
  const [redeemedIds, setRedeemedIds] = useState<Set<number>>(new Set());

  const tabs = [
    { id: 'challenges' as GameTab, label: 'Challenges' },
    { id: 'participation' as GameTab, label: 'Participation' },
    { id: 'badges' as GameTab, label: 'Badges' },
    { id: 'rewards' as GameTab, label: 'Rewards' },
    { id: 'leaderboard' as GameTab, label: 'Leaderboard' },
  ];

  const handleJoin = (id: number, name: string, xp: number) => {
    if (joinedIds.has(id)) return;
    setJoinedIds(prev => new Set([...prev, id]));
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, participants: c.participants + 1 } : c));
    toast.success(`Joined "${name}"! +${xp} XP on completion`);
  };

  const handleSaveChallenge = (data: NewChallengeForm) => {
    const formatted = new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newChallenge: Challenge = {
      id: Date.now(),
      name: data.name,
      xp: parseInt(data.xp) || 100,
      difficulty: data.difficulty,
      deadline: formatted,
      col: 'draft',
      participants: 0,
    };
    setChallenges(prev => [...prev, newChallenge]);
    toast.success(`Challenge "${data.name}" created`);
  };

  const handleRedeem = (id: number, name: string, points: number) => {
    if (redeemedIds.has(id)) return;
    setRedeemedIds(prev => new Set([...prev, id]));
    toast.success(`"${name}" redemption request submitted! −${points} pts`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Gamification</h1>
        <p className="text-xs text-gray-500 mt-0.5">Engage employees with ESG challenges, badges, and rewards</p>
      </div>

      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-orange-600/90 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Click a card to view details or join an active challenge</p>
            <button
              onClick={() => setShowNewChallenge(true)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Challenge
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {kanbanCols.map((col) => {
              const colCards = challenges.filter(c => c.col === col.id);
              return (
                <div key={col.id} className={`min-w-[200px] w-[200px] shrink-0 ${col.bg} border ${col.border} rounded-2xl p-3`}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className={`text-[11px] font-semibold ${col.color}`}>{col.label}</span>
                    <span className="text-[10px] text-gray-600 bg-[#1a2035] px-1.5 py-0.5 rounded-full">{colCards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colCards.map((c) => {
                      const joined = joinedIds.has(c.id);
                      return (
                        <div key={c.id} className={`bg-[#0d1222] border rounded-xl p-3 transition-all ${joined ? 'border-orange-500/40' : 'border-[#1a2035] hover:border-orange-500/30'}`}>
                          <h3 className="text-[11px] font-semibold text-gray-200 mb-2 leading-tight">{c.name}</h3>
                          <div className="flex items-center gap-1.5 mb-2">
                            <DiffBadge d={c.difficulty} />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-orange-400 font-semibold">+{c.xp} XP</span>
                            <span className="text-gray-600">{c.deadline}</span>
                          </div>
                          {col.id === 'active' && (
                            <button
                              onClick={() => handleJoin(c.id, c.name, c.xp)}
                              disabled={joined}
                              className={`mt-2.5 w-full py-1.5 text-[10px] font-medium rounded-lg transition-colors ${
                                joined
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                                  : 'bg-orange-600/20 border border-orange-500/20 text-orange-400 hover:bg-orange-600/30'
                              }`}
                            >
                              {joined ? `✓ Joined · ${c.participants}` : `Join · ${c.participants} joined`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {colCards.length === 0 && (
                      <div className="py-6 text-center text-[11px] text-gray-700">Empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'participation' && (
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2035]">
                {['Employee', 'Challenge', 'Joined', 'Progress', 'XP Earned', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { emp: 'Sarah Chen', challenge: 'Zero Waste Week', joined: '2026-07-01', progress: 80, xp: 400, done: false },
                { emp: 'Marcus Johnson', challenge: 'Bike to Work Month', joined: '2026-07-05', progress: 100, xp: 300, done: true },
                { emp: 'Emma Williams', challenge: 'Tree Planting Drive', joined: '2026-06-20', progress: 65, xp: 487, done: false },
                { emp: 'James Lee', challenge: 'Zero Waste Week', joined: '2026-07-01', progress: 45, xp: 225, done: false },
                { emp: 'Aria Patel', challenge: 'Bike to Work Month', joined: '2026-07-08', progress: 100, xp: 300, done: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{row.emp}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{row.challenge}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{row.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${row.progress === 100 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${row.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-500">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-orange-400">+{row.xp} XP</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${row.done ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}`}>
                      {row.done ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.name} className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5 hover:border-orange-500/25 transition-all text-center">
              <div className="text-4xl mb-3">{b.emoji}</div>
              <div className="flex justify-center mb-2"><RarityBadge r={b.rarity} /></div>
              <h3 className="text-sm font-semibold text-gray-100 mb-1">{b.name}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{b.desc}</p>
              <p className="text-[11px] text-gray-600">{b.earned.toLocaleString()} employees earned</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-3 gap-4">
          {initialRewards.map((r) => {
            const redeemed = redeemedIds.has(r.id);
            return (
              <div key={r.id} className={`bg-[#0d1222] border rounded-2xl p-4 transition-all ${redeemed ? 'border-emerald-500/30' : 'border-[#1a2035] hover:border-orange-500/25'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{r.emoji}</div>
                  <span className="text-[11px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">{r.category}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mb-1">{r.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-orange-400">{r.points.toLocaleString()} pts</span>
                  <button
                    onClick={() => handleRedeem(r.id, r.name, r.points)}
                    disabled={redeemed}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                      redeemed
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                    }`}
                  >
                    {redeemed ? 'Redeemed ✓' : 'Redeem'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a2035]">
              <h3 className="text-sm font-semibold text-white">Top Departments</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Ranked by total XP — Q3 2026</p>
            </div>
            <div className="p-3 space-y-1">
              {topDepts.map((d) => (
                <div key={d.rank} className={`flex items-center gap-3 px-3 py-3 rounded-xl ${d.rank <= 3 ? 'bg-orange-500/5' : ''}`}>
                  <div className="w-8 flex justify-center shrink-0"><RankMedal rank={d.rank} /></div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-200">{d.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">{d.score.toLocaleString()}</div>
                    <div className={`text-[10px] ${d.up ? 'text-emerald-400' : 'text-red-400'}`}>{d.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a2035]">
              <h3 className="text-sm font-semibold text-white">Top Employees</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Ranked by total XP — Q3 2026</p>
            </div>
            <div className="p-3 space-y-1">
              {topEmployees.map((e) => (
                <div key={e.rank} className={`flex items-center gap-3 px-3 py-3 rounded-xl ${e.rank <= 3 ? 'bg-orange-500/5' : ''}`}>
                  <div className="w-8 flex justify-center shrink-0"><RankMedal rank={e.rank} /></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-[11px] font-bold text-orange-400 shrink-0">
                    {e.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-200 truncate">{e.name}</div>
                    <div className="text-[10px] text-gray-600">{e.dept}</div>
                  </div>
                  <span className="text-sm font-bold text-orange-400 shrink-0">{e.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showNewChallenge && (
        <NewChallengeModal onClose={() => setShowNewChallenge(false)} onSave={handleSaveChallenge} />
      )}
    </div>
  );
}
