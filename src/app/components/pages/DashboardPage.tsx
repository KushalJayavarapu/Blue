import { TrendingUp, TrendingDown, Leaf, Users, Shield, BarChart3, Target, Trophy, FileText, ArrowUpRight, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Page } from '../layout/Sidebar';

const carbonData = [
  { month: 'Jan', value: 420 }, { month: 'Feb', value: 385 }, { month: 'Mar', value: 450 },
  { month: 'Apr', value: 395 }, { month: 'May', value: 340 }, { month: 'Jun', value: 308 },
  { month: 'Jul', value: 290 }, { month: 'Aug', value: 275 }, { month: 'Sep', value: 258 },
  { month: 'Oct', value: 242 }, { month: 'Nov', value: 228 }, { month: 'Dec', value: 210 },
];

const deptData = [
  { dept: 'HR', score: 91 }, { dept: 'Eng', score: 84 }, { dept: 'Finance', score: 77 },
  { dept: 'Mktg', score: 72 }, { dept: 'Ops', score: 68 }, { dept: 'Sales', score: 63 },
];

const kpis = [
  { label: 'Environmental Score', value: 78, prev: 75.5, icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' },
  { label: 'Social Score', value: 82, prev: 80.5, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: 'bg-blue-500' },
  { label: 'Governance Score', value: 71, prev: 71.4, icon: Shield, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', bar: 'bg-violet-500' },
  { label: 'Overall ESG Score', value: 77, prev: 75.5, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500' },
];

const activities = [
  { text: 'Carbon data logged for Engineering Q3', time: '5m ago', dot: 'bg-emerald-500', page: 'environmental' as Page },
  { text: 'Privacy Policy v2.0 published for acknowledgement', time: '1h ago', dot: 'bg-violet-500', page: 'governance' as Page },
  { text: 'Tree Planting Drive — 24 new participants joined', time: '2h ago', dot: 'bg-blue-500', page: 'social' as Page },
  { text: 'Sarah Chen earned the Eco Warrior badge', time: '4h ago', dot: 'bg-orange-500', page: 'gamification' as Page },
  { text: 'Fleet Electrification goal marked completed', time: '6h ago', dot: 'bg-emerald-500', page: 'environmental' as Page },
];

const deadlines = [
  { label: 'Q4 Carbon Report', date: 'Dec 31, 2026', urgency: 'normal', page: 'reports' as Page },
  { label: 'Privacy Policy Acknowledgement', date: 'Dec 15, 2026', urgency: 'urgent', page: 'governance' as Page },
  { label: 'Diversity Survey', date: 'Jan 15, 2027', urgency: 'normal', page: 'social' as Page },
  { label: 'Annual ESG Audit', date: 'Feb 1, 2027', urgency: 'low', page: 'governance' as Page },
];

const deptRankings = [
  { rank: 1, dept: 'HR', env: 91, social: 94, gov: 88, overall: 91 },
  { rank: 2, dept: 'Engineering', env: 84, social: 79, gov: 82, overall: 82 },
  { rank: 3, dept: 'Finance', env: 72, social: 77, gov: 81, overall: 77 },
  { rank: 4, dept: 'Marketing', env: 68, social: 75, gov: 71, overall: 71 },
  { rank: 5, dept: 'Operations', env: 65, social: 70, gov: 71, overall: 69 },
  { rank: 6, dept: 'Sales', env: 61, social: 65, gov: 65, overall: 64 },
];

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-5 text-right">{value}</span>
      <div className="w-16 h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CarbonTrendChart({ data }: { data: typeof carbonData }) {
  const W = 500;
  const H = 175;
  const padL = 38, padR = 10, padT = 8, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const values = data.map(d => d.value);
  const maxV = Math.max(...values);
  const minV = Math.min(...values) * 0.9;

  const x = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - minV) / (maxV - minV)) * innerH;

  const linePoints = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' L ');
  const linePath = `M ${linePoints}`;
  const areaPath = `${linePath} L ${x(data.length - 1)},${H - padB} L ${x(0)},${H - padB} Z`;

  const gridYs = [maxV, maxV * 0.75 + minV * 0.25, maxV * 0.5 + minV * 0.5, minV * 1.1];

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {gridYs.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="#1a2035" strokeWidth={1} />
          <text x={padL - 5} y={y(v) + 4} textAnchor="end" fill="#4b5563" fontSize={9}>{Math.round(v)}</text>
        </g>
      ))}
      <path d={areaPath} fill="#10b981" fillOpacity={0.08} />
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={x(i)} cy={y(d.value)} r={3} fill="#10b981" fillOpacity={0.8} />
          <text x={x(i)} y={H - 8} textAnchor="middle" fill="#4b5563" fontSize={9}>{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

function DeptRankBarChart({ data }: { data: typeof deptData }) {
  const W = 300;
  const H = 175;
  const padL = 46, padR = 32, padT = 6, padB = 6;
  const innerH = H - padT - padB;
  const barH = 10;
  const gap = innerH / data.length;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const yPos = padT + i * gap + (gap - barH) / 2;
        const barW = (d.score / 100) * (W - padL - padR);
        return (
          <g key={d.dept}>
            <text x={padL - 6} y={yPos + barH - 1} textAnchor="end" fill="#6b7280" fontSize={10}>{d.dept}</text>
            <rect x={padL} y={yPos} width={W - padL - padR} height={barH} rx={5} fill="#1a2035" />
            <rect x={padL} y={yPos} width={barW} height={barH} rx={5} fill="#8b5cf6" />
            <text x={padL + barW + 4} y={yPos + barH - 1} fill="#8b5cf6" fontSize={9}>{d.score}</text>
          </g>
        );
      })}
    </svg>
  );
}

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const quickActions = [
    { label: 'Log Carbon Data', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20 hover:border-emerald-500/50', page: 'environmental' as Page },
    { label: 'Create Goal', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20 hover:border-blue-500/50', page: 'environmental' as Page },
    { label: 'Start Challenge', icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20 hover:border-orange-500/50', page: 'gamification' as Page },
    { label: 'Generate Report', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20 hover:border-violet-500/50', page: 'reports' as Page },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">ESG Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Q3 2026 · Acme Corporation · All Departments</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Live data
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const change = ((kpi.value - kpi.prev) / kpi.prev * 100).toFixed(1);
          const up = kpi.value >= kpi.prev;
          return (
            <div key={kpi.label} className={`bg-[#0d1222] border ${kpi.border} rounded-2xl p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${kpi.color}`} style={{ width: 18, height: 18 }} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? '+' : ''}{change}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">{kpi.value}</div>
              <div className="text-[11px] text-gray-500 mb-3">{kpi.label}</div>
              <div className="w-full h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                <div className={`h-full ${kpi.bar} rounded-full transition-all duration-700`} style={{ width: `${kpi.value}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Carbon Emission Trend</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">CO₂ equivalent (tonnes) — 2026</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingDown className="w-3 h-3" /> 50% YoY reduction
            </span>
          </div>
          <CarbonTrendChart data={carbonData} />
        </div>

        <div className="col-span-2 bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Dept ESG Ranking</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Overall score by department</p>
            </div>
          </div>
          <DeptRankBarChart data={deptData} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <button
              onClick={() => onNavigate('environmental')}
              className="text-[11px] text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors"
            >
              All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3.5">
            {activities.map((a, i) => (
              <button
                key={i}
                onClick={() => onNavigate(a.page)}
                className="w-full flex items-start gap-3 text-left hover:opacity-80 transition-opacity"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                <div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{a.text}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{a.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => onNavigate(a.page)}
                  className={`flex flex-col items-center gap-2.5 p-3.5 rounded-xl border ${a.border} ${a.bg} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <Icon className={`w-5 h-5 ${a.color}`} />
                  <span className={`text-[11px] font-medium leading-tight text-center ${a.color}`}>{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {deadlines.map((d, i) => (
              <button
                key={i}
                onClick={() => onNavigate(d.page)}
                className="w-full flex items-start gap-3 py-2 border-b border-[#1a2035] last:border-0 text-left hover:opacity-80 transition-opacity"
              >
                <Clock className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${d.urgency === 'urgent' ? 'text-red-400' : d.urgency === 'low' ? 'text-blue-400' : 'text-yellow-400'}`} />
                <div>
                  <p className="text-[11px] text-gray-300 font-medium">{d.label}</p>
                  <p className={`text-[10px] mt-0.5 ${d.urgency === 'urgent' ? 'text-red-400' : d.urgency === 'low' ? 'text-blue-400' : 'text-yellow-500'}`}>{d.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dept Rankings Table */}
      <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a2035] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Department ESG Rankings</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Score breakdown across all ESG dimensions</p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-[11px] text-gray-600 hover:text-gray-300 flex items-center gap-1 transition-colors"
          >
            View full report <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2035]">
              {['Rank', 'Department', 'Environmental', 'Social', 'Governance', 'Overall Score'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptRankings.map((row) => (
              <tr
                key={row.dept}
                className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors cursor-pointer"
                onClick={() => onNavigate('environmental')}
              >
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-bold ${row.rank === 1 ? 'text-yellow-400' : row.rank === 2 ? 'text-gray-300' : row.rank === 3 ? 'text-orange-400' : 'text-gray-600'}`}>
                    {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{row.dept}</td>
                <td className="px-5 py-3.5"><MiniBar value={row.env} color="bg-emerald-500" /></td>
                <td className="px-5 py-3.5"><MiniBar value={row.social} color="bg-blue-500" /></td>
                <td className="px-5 py-3.5"><MiniBar value={row.gov} color="bg-violet-500" /></td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-bold ${row.overall >= 85 ? 'text-emerald-400' : row.overall >= 75 ? 'text-yellow-400' : row.overall >= 65 ? 'text-orange-400' : 'text-red-400'}`}>
                    {row.overall}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
