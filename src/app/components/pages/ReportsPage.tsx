import { useState } from 'react';
import { Download, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type ReportTab = 'environmental' | 'social' | 'governance' | 'summary' | 'builder';

const reportCards = [
  {
    id: 'environmental' as ReportTab,
    label: 'Environmental Report',
    desc: 'Carbon emissions, energy usage, goals, and environmental KPIs',
    emoji: '🌿',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    btn: 'bg-emerald-600 hover:bg-emerald-500',
    lastGen: 'Jul 1, 2026',
  },
  {
    id: 'social' as ReportTab,
    label: 'Social Report',
    desc: 'CSR activities, employee participation, diversity & inclusion metrics',
    emoji: '👥',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    btn: 'bg-blue-600 hover:bg-blue-500',
    lastGen: 'Jul 1, 2026',
  },
  {
    id: 'governance' as ReportTab,
    label: 'Governance Report',
    desc: 'Policy compliance, audit results, compliance issue tracking',
    emoji: '🛡️',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    btn: 'bg-violet-600 hover:bg-violet-500',
    lastGen: 'Jun 30, 2026',
  },
  {
    id: 'summary' as ReportTab,
    label: 'ESG Summary Report',
    desc: 'Comprehensive ESG performance overview for board & stakeholders',
    emoji: '📊',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    btn: 'bg-orange-600 hover:bg-orange-500',
    lastGen: 'Jul 1, 2026',
  },
];

const envData = [
  { metric: 'Total CO₂ Emissions', q1: '420 t', q2: '310 t', ytd: '730 t', target: '800 t', pct: 91, ok: true },
  { metric: 'Energy Consumption', q1: '1,200 MWh', q2: '980 MWh', ytd: '2,180 MWh', target: '2,400 MWh', pct: 91, ok: true },
  { metric: 'Renewable Energy %', q1: '32%', q2: '41%', ytd: '36.5%', target: '50%', pct: 73, ok: false },
  { metric: 'Waste Diverted', q1: '68%', q2: '72%', ytd: '70%', target: '75%', pct: 93, ok: false },
];

const socialData = [
  { metric: 'CSR Participation Rate', q1: '74%', q2: '81%', ytd: '77.5%', target: '80%', pct: 97, ok: true },
  { metric: 'Training Hours', q1: '2,140 hrs', q2: '2,380 hrs', ytd: '4,520 hrs', target: '5,000 hrs', pct: 90, ok: true },
  { metric: 'Gender Pay Gap', q1: '3.1%', q2: '2.8%', ytd: '2.95%', target: '<2%', pct: 52, ok: false },
  { metric: 'Safety Incidents', q1: '2', q2: '1', ytd: '3', target: '0', pct: 0, ok: false },
];

const govData = [
  { metric: 'Policy Acknowledgement Rate', q1: '88%', q2: '93%', ytd: '90.5%', target: '100%', pct: 90, ok: false },
  { metric: 'Audit Completion', q1: '2/2', q2: '1/2', ytd: '3/4', target: '4/4', pct: 75, ok: false },
  { metric: 'Open Compliance Issues', q1: '6', q2: '4', ytd: '4', target: '0', pct: 0, ok: false },
  { metric: 'Board Diversity', q1: '33%', q2: '33%', ytd: '33%', target: '40%', pct: 82, ok: false },
];

const summaryData = [
  { metric: 'Overall ESG Score', q1: '74', q2: '77', ytd: '77', target: '85', pct: 91, ok: false },
  { metric: 'Environmental Score', q1: '76', q2: '78', ytd: '78', target: '85', pct: 92, ok: false },
  { metric: 'Social Score', q1: '79', q2: '82', ytd: '82', target: '85', pct: 96, ok: false },
  { metric: 'Governance Score', q1: '66', q2: '71', ytd: '71', target: '85', pct: 84, ok: false },
];

const previewDataMap: Record<ReportTab, typeof envData> = {
  environmental: envData,
  social: socialData,
  governance: govData,
  summary: summaryData,
  builder: envData,
};

function PreviewTable({ tab }: { tab: ReportTab }) {
  const data = previewDataMap[tab] || envData;
  return (
    <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#1a2035] flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400">Report Preview</span>
        <span className="text-[11px] text-gray-600">Q1–Q2 2026 · All Departments</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1a2035]">
            {['Metric', 'Q1 2026', 'Q2 2026', 'YTD 2026', 'Target', 'Progress', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
              <td className="px-4 py-3 text-xs font-medium text-gray-200">{row.metric}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{row.q1}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{row.q2}</td>
              <td className="px-4 py-3 text-xs font-semibold text-gray-200">{row.ytd}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{row.target}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${row.pct >= 90 ? 'bg-emerald-500' : row.pct >= 70 ? 'bg-rose-500' : 'bg-red-500'}`} style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-500">{row.pct}%</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${row.pct >= 90 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : row.pct >= 70 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
                  {row.pct >= 90 ? 'On Track' : row.pct >= 70 ? 'At Risk' : 'Off Track'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('environmental');
  const [generating, setGenerating] = useState<ReportTab | null>(null);
  const [runningBuilder, setRunningBuilder] = useState(false);
  const [lastGenDates, setLastGenDates] = useState<Partial<Record<ReportTab, string>>>({});

  const tabs = [
    { id: 'environmental' as ReportTab, label: 'Environmental' },
    { id: 'social' as ReportTab, label: 'Social' },
    { id: 'governance' as ReportTab, label: 'Governance' },
    { id: 'summary' as ReportTab, label: 'ESG Summary' },
    { id: 'builder' as ReportTab, label: 'Custom Builder' },
  ];

  const currentCard = reportCards.find(r => r.id === activeTab);

  const handleGenerate = (tab: ReportTab, label: string) => {
    if (generating === tab) return;
    setGenerating(tab);
    setTimeout(() => {
      setGenerating(null);
      const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setLastGenDates(prev => ({ ...prev, [tab]: now }));
      toast.success(`${label} generated successfully`);
    }, 1800);
  };

  const handleExport = (format: string, label: string) => {
    toast.success(`Exporting ${label} as ${format}...`);
  };

  const handleRunBuilder = () => {
    if (runningBuilder) return;
    setRunningBuilder(true);
    setTimeout(() => {
      setRunningBuilder(false);
      toast.success('Custom report generated — 6 rows returned');
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Reports</h1>
        <p className="text-xs text-gray-500 mt-0.5">Generate, customize, and export ESG performance reports</p>
      </div>

      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-violet-600/90 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'builder' && currentCard && (
        <div className="space-y-4">
          <div className={`bg-[#0d1222] border ${currentCard.border} rounded-2xl p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`text-4xl w-14 h-14 ${currentCard.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  {currentCard.emoji}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{currentCard.label}</h2>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">{currentCard.desc}</p>
                  <p className="text-[11px] text-gray-600 mt-2">
                    Last generated: {lastGenDates[activeTab] ?? currentCard.lastGen}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleExport('PDF', currentCard.label)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button
                  onClick={() => handleGenerate(activeTab, currentCard.label)}
                  disabled={generating === activeTab}
                  className={`flex items-center gap-2 px-3.5 py-2 ${currentCard.btn} text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-70`}
                >
                  {generating === activeTab ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Play className="w-3.5 h-3.5" /> Generate Report</>
                  )}
                </button>
              </div>
            </div>
          </div>
          <PreviewTable tab={activeTab} />
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="space-y-4">
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Report Configuration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Date Range — From</label>
                <input type="date" defaultValue="2026-01-01" className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Date Range — To</label>
                <input type="date" defaultValue="2026-12-31" className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Department</label>
                <select className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]">
                  <option value="">All Departments</option>
                  {['Engineering', 'Marketing', 'Operations', 'Finance', 'HR', 'Sales'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">ESG Category</label>
                <select className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]">
                  <option value="">All Categories</option>
                  <option>Environmental</option>
                  <option>Social</option>
                  <option>Governance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Module</label>
                <select className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]">
                  <option value="">All Modules</option>
                  <option>Carbon Emissions</option>
                  <option>CSR Activities</option>
                  <option>Policy Compliance</option>
                  <option>Gamification</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Employee</label>
                <input placeholder="Search employee..." className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-[#2a3550]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Challenge</label>
                <select className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550]">
                  <option value="">All Challenges</option>
                  <option>Zero Waste Week</option>
                  <option>Bike to Work Month</option>
                  <option>Tree Planting Drive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={handleRunBuilder}
                disabled={runningBuilder}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-70"
              >
                {runningBuilder ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Run Report</>
                )}
              </button>
              {['PDF', 'Excel', 'CSV'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt, 'Custom Report')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1a2035]">
              <span className="text-xs font-semibold text-gray-400">Report Preview</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {['Date', 'Department', 'Category', 'Metric', 'Value', 'Employee'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '2026-07-11', dept: 'Operations', cat: 'Environmental', metric: 'CO₂ Emissions', value: '84 kg', emp: 'System' },
                  { date: '2026-07-11', dept: 'HR', cat: 'Social', metric: 'CSR Participation', value: '92%', emp: 'Sarah Chen' },
                  { date: '2026-07-10', dept: 'Engineering', cat: 'Environmental', metric: 'Energy Usage', value: '228 kWh', emp: 'System' },
                  { date: '2026-07-10', dept: 'Finance', cat: 'Governance', metric: 'Policy Acknowledgement', value: '88%', emp: 'System' },
                  { date: '2026-07-09', dept: 'Sales', cat: 'Social', metric: 'Training Hours', value: '4 hrs', emp: 'James Lee' },
                  { date: '2026-07-09', dept: 'Marketing', cat: 'Governance', metric: 'Audit Finding', value: '2 findings', emp: 'Deloitte' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                    <td className="px-4 py-3 text-[11px] text-gray-600">{row.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{row.dept}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-gray-400 bg-[#1a2035] px-2 py-0.5 rounded-full">{row.cat}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-200">{row.metric}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-white">{row.value}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{row.emp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
