import { useState } from 'react';
import { Plus, Edit2, Trash2, Download, Search, Filter, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type EnvTab = 'goals' | 'transactions' | 'emissions' | 'profiles';

type Goal = {
  id: number;
  name: string;
  dept: string;
  target: number;
  current: number;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'completed' | 'overdue';
};

type Transaction = {
  id: number;
  source: string;
  category: string;
  dept: string;
  factor: string;
  carbon: string;
  timestamp: string;
};

const initialGoals: Goal[] = [
  { id: 1, name: 'Reduce Office Energy', dept: 'Operations', target: 500, current: 320, deadline: '2026-12-31', status: 'on-track' },
  { id: 2, name: 'Zero Plastic Waste', dept: 'Marketing', target: 100, current: 45, deadline: '2026-09-30', status: 'at-risk' },
  { id: 3, name: 'Fleet Electrification', dept: 'Operations', target: 1200, current: 1200, deadline: '2026-06-30', status: 'completed' },
  { id: 4, name: 'Data Center Carbon Neutral', dept: 'Engineering', target: 800, current: 210, deadline: '2027-03-31', status: 'on-track' },
  { id: 5, name: 'Supply Chain Audit', dept: 'Finance', target: 300, current: 285, deadline: '2026-11-30', status: 'on-track' },
  { id: 6, name: 'Renewable Energy 50%', dept: 'Operations', target: 50, current: 41, deadline: '2026-12-31', status: 'at-risk' },
];

const initialTransactions: Transaction[] = [
  { id: 1, source: 'Office HVAC System', category: 'Energy', dept: 'Operations', factor: '0.42 kg/kWh', carbon: '84.0 kg', timestamp: '2026-07-11 14:32' },
  { id: 2, source: 'Company Fleet (12 vehicles)', category: 'Transportation', dept: 'Sales', factor: '0.21 kg/km', carbon: '126.0 kg', timestamp: '2026-07-11 11:15' },
  { id: 3, source: 'Data Center Cooling', category: 'Energy', dept: 'Engineering', factor: '0.38 kg/kWh', carbon: '228.0 kg', timestamp: '2026-07-10 16:44' },
  { id: 4, source: 'Business Travel — Flights', category: 'Transportation', dept: 'Finance', factor: '0.18 kg/km', carbon: '72.0 kg', timestamp: '2026-07-10 09:22' },
  { id: 5, source: 'Manufacturing Line B', category: 'Process', dept: 'Operations', factor: '1.20 kg/unit', carbon: '360.0 kg', timestamp: '2026-07-09 12:00' },
  { id: 6, source: 'Office Heating', category: 'Energy', dept: 'HR', factor: '0.55 kg/kWh', carbon: '55.0 kg', timestamp: '2026-07-09 08:30' },
];

const DEPTS = ['Engineering', 'Marketing', 'Operations', 'Finance', 'HR', 'Sales'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'on-track': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'at-risk': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    'completed': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'overdue': 'text-red-400 bg-red-500/10 border-red-500/20',
  };
  const labels: Record<string, string> = { 'on-track': 'On Track', 'at-risk': 'At Risk' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border capitalize ${map[status] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
      {labels[status] || status}
    </span>
  );
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(Math.round((current / target) * 100), 100);
  const color = pct >= 95 ? 'bg-blue-500' : pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-rose-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-500 shrink-0 w-8 text-right">{pct}%</span>
    </div>
  );
}

type ModalMode = 'new-goal' | 'edit-goal' | 'new-transaction' | null;

function GoalModal({ mode, goal, onClose, onSave }: {
  mode: 'new-goal' | 'edit-goal';
  goal: Partial<Goal>;
  onClose: () => void;
  onSave: (data: Partial<Goal>) => void;
}) {
  const [form, setForm] = useState<Partial<Goal>>({
    name: goal.name ?? '',
    dept: goal.dept ?? DEPTS[0],
    target: goal.target ?? 0,
    current: goal.current ?? 0,
    deadline: goal.deadline ?? '',
    status: goal.status ?? 'on-track',
  });
  const set = (k: keyof Goal, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">{mode === 'edit-goal' ? 'Edit Goal' : 'New Environmental Goal'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Goal Name</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50"
              placeholder="e.g. Reduce Office Energy"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Department</label>
            <select
              value={form.dept}
              onChange={e => set('dept', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
            >
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Target CO₂ (tonnes)</label>
              <input
                type="number"
                value={form.target}
                onChange={e => set('target', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Current CO₂ (tonnes)</label>
              <input
                type="number"
                value={form.current}
                onChange={e => set('current', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as Goal['status'])}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
          <button
            onClick={() => { if (!form.name?.trim()) { toast.error('Goal name is required'); return; } onSave(form); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            {mode === 'edit-goal' ? 'Save Changes' : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionModal({ onClose, onSave }: { onClose: () => void; onSave: (tx: Omit<Transaction, 'id'>) => void }) {
  const [form, setForm] = useState({ source: '', category: 'Energy', dept: DEPTS[0], factor: '', carbon: '', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ') });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">Log Carbon Transaction</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Source</label>
            <input value={form.source} onChange={e => set('source', e.target.value)} placeholder="e.g. Office HVAC System" className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50">
                {['Energy', 'Transportation', 'Process', 'Waste'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)} className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50">
                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Emission Factor</label>
              <input value={form.factor} onChange={e => set('factor', e.target.value)} placeholder="e.g. 0.42 kg/kWh" className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Carbon Produced</label>
              <input value={form.carbon} onChange={e => set('carbon', e.target.value)} placeholder="e.g. 84.0 kg" className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
          <button
            onClick={() => { if (!form.source.trim()) { toast.error('Source is required'); return; } onSave(form); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Log Transaction
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalDrawer({ goal, onClose, onEdit }: { goal: Goal; onClose: () => void; onEdit: () => void }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="w-96 bg-[#0d1222] border-l border-[#1a2035] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">Goal Details</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div><p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Goal Name</p><p className="text-sm font-semibold text-gray-100">{goal.name}</p></div>
          <div><p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Department</p><p className="text-sm text-gray-300">{goal.dept}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827] border border-[#1a2035] rounded-xl p-3">
              <p className="text-[10px] text-gray-600 mb-1">Target CO₂</p>
              <p className="text-lg font-bold text-gray-100">{goal.target}</p>
              <p className="text-[10px] text-gray-600">tonnes</p>
            </div>
            <div className="bg-[#111827] border border-[#1a2035] rounded-xl p-3">
              <p className="text-[10px] text-gray-600 mb-1">Current CO₂</p>
              <p className="text-lg font-bold text-emerald-400">{goal.current}</p>
              <p className="text-[10px] text-gray-600">tonnes</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-gray-600 uppercase tracking-wide">Progress</p>
              <span className="text-sm font-semibold text-gray-200">{pct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#1a2035] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${pct >= 95 ? 'bg-blue-500' : pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-rose-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Deadline</p><p className="text-sm text-gray-300">{goal.deadline}</p></div>
            <div><p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Status</p><StatusBadge status={goal.status} /></div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#1a2035] flex gap-2">
          <button onClick={onEdit} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors">Edit Goal</button>
          <button onClick={onClose} className="flex-1 py-2 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

export function EnvironmentalPage() {
  const [activeTab, setActiveTab] = useState<EnvTab>('goals');
  const [search, setSearch] = useState('');
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingGoal, setEditingGoal] = useState<Partial<Goal>>({});
  const [drawerGoal, setDrawerGoal] = useState<Goal | null>(null);

  const tabs = [
    { id: 'goals' as EnvTab, label: 'Environmental Goals' },
    { id: 'transactions' as EnvTab, label: 'Carbon Transactions' },
    { id: 'emissions' as EnvTab, label: 'Emission Factors' },
    { id: 'profiles' as EnvTab, label: 'Product ESG Profiles' },
  ];

  const filteredGoals = goals.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.dept.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredGoals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGoals.map(g => g.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) { toast.error('Select at least one goal to delete'); return; }
    setGoals(prev => prev.filter(g => !selectedIds.has(g.id)));
    setSelectedIds(new Set());
    toast.success(`Deleted ${selectedIds.size} goal${selectedIds.size > 1 ? 's' : ''}`);
  };

  const handleDeleteGoal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals(prev => prev.filter(g => g.id !== id));
    toast.success('Goal deleted');
  };

  const handleEditGoal = (goal: Goal, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingGoal(goal);
    setModalMode('edit-goal');
    setDrawerGoal(null);
  };

  const handleSaveGoal = (data: Partial<Goal>) => {
    if (modalMode === 'edit-goal' && editingGoal.id) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...data } as Goal : g));
      toast.success('Goal updated successfully');
    } else {
      const newGoal: Goal = { id: Date.now(), name: data.name!, dept: data.dept!, target: data.target!, current: data.current ?? 0, deadline: data.deadline!, status: data.status! };
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Goal created successfully');
    }
    setModalMode(null);
    setEditingGoal({});
  };

  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...data, id: Date.now() }, ...prev]);
    setModalMode(null);
    toast.success('Carbon transaction logged');
  };

  const handleExport = () => {
    toast.success('Goals exported to CSV');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Environmental</h1>
        <p className="text-xs text-gray-500 mt-0.5">Monitor carbon emissions, set reduction goals, and track environmental performance</p>
      </div>

      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-emerald-600/90 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setEditingGoal({}); setModalMode('new-goal'); }}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Goal
            </button>
            <button
              onClick={() => {
                if (selectedIds.size !== 1) { toast.error('Select exactly one goal to edit'); return; }
                const id = [...selectedIds][0];
                const goal = goals.find(g => g.id === id);
                if (goal) handleEditGoal(goal);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-[#0d1222] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-3 py-2 bg-[#0d1222] border border-[#1a2035] text-red-400/70 hover:text-red-400 text-xs rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-[#0d1222] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search goals..."
                className="pl-9 pr-4 py-2 bg-[#0d1222] border border-[#1a2035] rounded-xl text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-[#2a3550] w-52"
              />
            </div>
          </div>

          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  <th className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      className="accent-emerald-500"
                      checked={selectedIds.size === filteredGoals.length && filteredGoals.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  {['Goal Name', 'Department', 'Target CO₂', 'Current CO₂', 'Progress', 'Deadline', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGoals.map(goal => (
                  <tr
                    key={goal.id}
                    className={`border-b border-[#1a2035] hover:bg-[#111827] transition-colors cursor-pointer ${selectedIds.has(goal.id) ? 'bg-emerald-500/5' : ''}`}
                    onClick={() => setDrawerGoal(goal)}
                  >
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="accent-emerald-500" checked={selectedIds.has(goal.id)} onChange={() => toggleSelect(goal.id)} />
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-200">{goal.name}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{goal.dept}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-300">{goal.target} t</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-emerald-400">{goal.current} t</td>
                    <td className="px-4 py-3.5 min-w-[120px]"><ProgressBar current={goal.current} target={goal.target} /></td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{goal.deadline}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={goal.status} /></td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button onClick={e => handleEditGoal(goal, e)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-blue-400 transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={e => handleDeleteGoal(goal.id, e)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGoals.length === 0 && (
              <div className="py-16 text-center"><p className="text-sm text-gray-500">No goals match your search</p></div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input placeholder="Search transactions..." className="pl-9 pr-4 py-2 bg-[#0d1222] border border-[#1a2035] rounded-xl text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-[#2a3550] w-52" />
            </div>
            <button
              onClick={() => toast.info('Filter panel coming soon')}
              className="flex items-center gap-2 px-3 py-2 bg-[#0d1222] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl"
            >
              <Filter className="w-3.5 h-3.5" /> Filter <ChevronDown className="w-3 h-3" />
            </button>
            <input type="date" className="px-3.5 py-2 bg-[#0d1222] border border-[#1a2035] rounded-xl text-xs text-gray-400 focus:outline-none focus:border-[#2a3550]" />
            <div className="flex-1" />
            <button
              onClick={() => setModalMode('new-transaction')}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log Transaction
            </button>
          </div>

          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {['Source', 'Category', 'Department', 'Emission Factor', 'Carbon Produced', 'Timestamp'].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-200">{tx.source}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{tx.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{tx.dept}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">{tx.factor}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-orange-400">{tx.carbon}</td>
                    <td className="px-4 py-3.5 text-[11px] text-gray-600">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'emissions' || activeTab === 'profiles') && (
        <div className="flex flex-col items-center justify-center h-64 bg-[#0d1222] border border-[#1a2035] rounded-2xl">
          <div className="w-12 h-12 bg-[#1a2035] rounded-xl flex items-center justify-center mb-3">
            <Search className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-400">No {activeTab === 'emissions' ? 'emission factors' : 'product profiles'} yet</p>
          <p className="text-xs text-gray-600 mt-1 mb-4">Add entries to start tracking</p>
          <button
            onClick={() => toast.info('This feature is coming soon')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>
      )}

      {drawerGoal && (
        <GoalDrawer
          goal={drawerGoal}
          onClose={() => setDrawerGoal(null)}
          onEdit={() => { handleEditGoal(drawerGoal); setDrawerGoal(null); }}
        />
      )}

      {(modalMode === 'new-goal' || modalMode === 'edit-goal') && (
        <GoalModal
          mode={modalMode}
          goal={editingGoal}
          onClose={() => { setModalMode(null); setEditingGoal({}); }}
          onSave={handleSaveGoal}
        />
      )}

      {modalMode === 'new-transaction' && (
        <TransactionModal
          onClose={() => setModalMode(null)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
}
