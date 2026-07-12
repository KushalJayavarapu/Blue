import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

type SettingsTab = 'departments' | 'categories' | 'config' | 'notifications';

type Department = {
  id: number;
  name: string;
  code: string;
  head: string;
  parent: string;
  count: number;
  active: boolean;
};

type Category = {
  id: number;
  name: string;
  module: string;
  unit: string;
  color: string;
};

const initialDepartments: Department[] = [
  { id: 1, name: 'Engineering', code: 'ENG', head: 'Alice Wang', parent: '—', count: 48, active: true },
  { id: 2, name: 'Marketing', code: 'MKT', head: 'Robert Davis', parent: '—', count: 22, active: true },
  { id: 3, name: 'Operations', code: 'OPS', head: 'Linda Chen', parent: '—', count: 35, active: true },
  { id: 4, name: 'Finance', code: 'FIN', head: 'Mark Johnson', parent: '—', count: 18, active: true },
  { id: 5, name: 'HR', code: 'HR', head: 'Sarah Martinez', parent: '—', count: 12, active: true },
  { id: 6, name: 'Sales', code: 'SLS', head: 'Tom Wilson', parent: '—', count: 31, active: true },
  { id: 7, name: 'Engineering — Frontend', code: 'ENG-FE', head: 'Jake Park', parent: 'Engineering', count: 14, active: true },
  { id: 8, name: 'Engineering — Backend', code: 'ENG-BE', head: 'Mia Zhang', parent: 'Engineering', count: 16, active: false },
];

const initialCategories: Category[] = [
  { id: 1, name: 'Energy Consumption', module: 'Environmental', unit: 'per kWh', color: 'emerald' },
  { id: 2, name: 'Transportation', module: 'Environmental', unit: 'per km', color: 'emerald' },
  { id: 3, name: 'Process Emissions', module: 'Environmental', unit: 'per unit', color: 'emerald' },
  { id: 4, name: 'Waste Generation', module: 'Environmental', unit: 'per kg', color: 'emerald' },
  { id: 5, name: 'CSR Participation', module: 'Social', unit: 'per activity', color: 'blue' },
  { id: 6, name: 'Employee Training', module: 'Social', unit: 'per hour', color: 'blue' },
  { id: 7, name: 'Policy Documents', module: 'Governance', unit: 'per document', color: 'violet' },
  { id: 8, name: 'Audit Findings', module: 'Governance', unit: 'per finding', color: 'violet' },
];

const moduleColorMap: Record<string, string> = { Environmental: 'emerald', Social: 'blue', Governance: 'violet' };

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative rounded-full transition-all duration-200 shrink-0 ${on ? 'bg-emerald-600' : 'bg-[#1a2035]'}`}
      style={{ height: 22, width: 40 }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </button>
  );
}

type DeptForm = { name: string; code: string; head: string; parent: string; active: boolean };
const emptyDept: DeptForm = { name: '', code: '', head: '', parent: '—', active: true };

function DeptModal({
  initial,
  onClose,
  onSave,
  mode,
}: {
  initial?: DeptForm;
  onClose: () => void;
  onSave: (data: DeptForm) => void;
  mode: 'add' | 'edit';
}) {
  const [form, setForm] = useState<DeptForm>(initial ?? emptyDept);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Department name is required'); return; }
    if (!form.code.trim()) { toast.error('Code is required'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">{mode === 'add' ? 'Add Department' : 'Edit Department'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Department Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Product Design"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-slate-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Code *</label>
              <input
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. PDX"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 font-mono focus:outline-none focus:border-slate-500/40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Parent</label>
              <select
                value={form.parent}
                onChange={e => setForm(p => ({ ...p, parent: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-slate-500/40"
              >
                <option value="—">— None —</option>
                {['Engineering', 'Marketing', 'Operations', 'Finance', 'HR', 'Sales'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Department Head</label>
            <input
              value={form.head}
              onChange={e => setForm(p => ({ ...p, head: e.target.value }))}
              placeholder="e.g. Jane Smith"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-slate-500/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <ToggleSwitch on={form.active} onChange={() => setForm(p => ({ ...p, active: !p.active }))} />
            <label className="text-xs text-gray-300 cursor-pointer" onClick={() => setForm(p => ({ ...p, active: !p.active }))}>
              {form.active ? 'Active' : 'Inactive'}
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold rounded-xl transition-colors">
              {mode === 'add' ? 'Add Department' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type CatForm = { name: string; module: string; unit: string };
const emptyCat: CatForm = { name: '', module: 'Environmental', unit: '' };

function CategoryModal({
  initial,
  onClose,
  onSave,
  mode,
}: {
  initial?: CatForm;
  onClose: () => void;
  onSave: (data: CatForm) => void;
  mode: 'add' | 'edit';
}) {
  const [form, setForm] = useState<CatForm>(initial ?? emptyCat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    if (!form.unit.trim()) { toast.error('Unit is required'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">{mode === 'add' ? 'Add Category' : 'Edit Category'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Category Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Water Consumption"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-slate-500/40"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Module</label>
            <select
              value={form.module}
              onChange={e => setForm(p => ({ ...p, module: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-slate-500/40"
            >
              <option>Environmental</option>
              <option>Social</option>
              <option>Governance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Unit *</label>
            <input
              value={form.unit}
              onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
              placeholder="e.g. per litre"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 font-mono focus:outline-none focus:border-slate-500/40"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold rounded-xl transition-colors">
              {mode === 'add' ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('departments');
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [deptModal, setDeptModal] = useState<{ mode: 'add' | 'edit'; dept?: Department } | null>(null);
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; cat?: Category } | null>(null);

  const [cfg, setCfg] = useState({
    autoEmission: true,
    requireEvidence: true,
    autoAwardBadges: false,
    emailCompliance: true,
    weeklyDigest: true,
    activityNotifs: false,
    challengeReminders: true,
    deadlineAlerts: true,
    goalNotifs: false,
  });

  const toggle = (k: keyof typeof cfg) => setCfg(p => ({ ...p, [k]: !p[k] }));

  const tabs = [
    { id: 'departments' as SettingsTab, label: 'Departments' },
    { id: 'categories' as SettingsTab, label: 'Categories' },
    { id: 'config' as SettingsTab, label: 'ESG Configuration' },
    { id: 'notifications' as SettingsTab, label: 'Notification Settings' },
  ];

  const handleSaveDept = (data: DeptForm) => {
    if (deptModal?.mode === 'add') {
      setDepartments(prev => [...prev, { ...data, id: Date.now(), count: 0 }]);
      toast.success(`Department "${data.name}" added`);
    } else if (deptModal?.dept) {
      setDepartments(prev => prev.map(d => d.id === deptModal.dept!.id ? { ...d, ...data } : d));
      toast.success(`Department "${data.name}" updated`);
    }
  };

  const handleDeleteDept = (d: Department) => {
    setDepartments(prev => prev.filter(x => x.id !== d.id));
    toast.success(`"${d.name}" deleted`);
  };

  const handleSaveCat = (data: CatForm) => {
    const color = moduleColorMap[data.module] ?? 'emerald';
    if (catModal?.mode === 'add') {
      setCategories(prev => [...prev, { ...data, id: Date.now(), color }]);
      toast.success(`Category "${data.name}" added`);
    } else if (catModal?.cat) {
      setCategories(prev => prev.map(c => c.id === catModal.cat!.id ? { ...c, ...data, color } : c));
      toast.success(`Category "${data.name}" updated`);
    }
  };

  const handleDeleteCat = (cat: Category) => {
    setCategories(prev => prev.filter(x => x.id !== cat.id));
    toast.success(`"${cat.name}" deleted`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Configure departments, categories, ESG rules, and notification preferences</p>
      </div>

      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-slate-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setDeptModal({ mode: 'add' })}
              className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Department
            </button>
          </div>
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {['Name', 'Code', 'Department Head', 'Parent', 'Employees', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{d.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">{d.code}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{d.head || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{d.parent}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-300">{d.count}</td>
                    <td className="px-5 py-3.5">
                      {d.active
                        ? <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
                        : <span className="text-[11px] text-gray-600 bg-[#1a2035] px-2 py-0.5 rounded-full">Inactive</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setDeptModal({ mode: 'edit', dept: d })}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteDept(d)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCatModal({ mode: 'add' })}
              className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {['Category Name', 'Module', 'Unit', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{cat.name}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        cat.color === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        cat.color === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                        'text-violet-400 bg-violet-500/10 border-violet-500/20'
                      }`}>{cat.module}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{cat.unit}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCatModal({ mode: 'edit', cat })}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="max-w-2xl space-y-4">
          <p className="text-xs text-gray-500 mb-2">Configure global ESG rules and automation settings</p>
          {[
            { key: 'autoEmission' as const, label: 'Auto Emission Calculation', desc: 'Automatically calculate carbon emissions based on logged activity data using preset emission factors' },
            { key: 'requireEvidence' as const, label: 'Require Evidence for CSR Activities', desc: 'Employees must upload photographic or documentary evidence before CSR activity credit is awarded' },
            { key: 'autoAwardBadges' as const, label: 'Auto-Award Badges', desc: 'Automatically grant achievement badges when all criteria conditions are met, without manual review' },
            { key: 'emailCompliance' as const, label: 'Email Compliance Alerts', desc: 'Send automated email notifications to owners when compliance issue deadlines are approaching within 14 days' },
          ].map((c) => (
            <div key={c.key} className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-200">{c.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</p>
              </div>
              <div className="mt-0.5 shrink-0"><ToggleSwitch on={cfg[c.key]} onChange={() => toggle(c.key)} /></div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-1">Email Notifications</h3>
            <p className="text-xs text-gray-600 mb-3">Control which emails you receive from EcoSphere</p>
            <div className="space-y-3">
              {[
                { key: 'weeklyDigest' as const, label: 'Weekly ESG Digest', desc: 'A weekly summary of ESG scores, top activities, and key changes' },
                { key: 'emailCompliance' as const, label: 'Compliance Deadline Alerts', desc: 'Get notified 14 days before compliance issue due dates' },
                { key: 'deadlineAlerts' as const, label: 'Environmental Goal Reminders', desc: 'Reminders when your assigned goals are nearing their deadline' },
              ].map((n) => (
                <div key={n.key} className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{n.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                  </div>
                  <div className="mt-0.5 shrink-0"><ToggleSwitch on={cfg[n.key]} onChange={() => toggle(n.key)} /></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-1">In-App Notifications</h3>
            <p className="text-xs text-gray-600 mb-3">Control your notification bell activity</p>
            <div className="space-y-3">
              {[
                { key: 'activityNotifs' as const, label: 'CSR Activity Notifications', desc: 'Get notified when employees join or complete your CSR activities' },
                { key: 'challengeReminders' as const, label: 'Challenge Progress Reminders', desc: 'Reminders for active challenges you have joined' },
                { key: 'goalNotifs' as const, label: 'Goal Progress Updates', desc: 'Weekly updates on your assigned environmental goals' },
              ].map((n) => (
                <div key={n.key} className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{n.label}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                  </div>
                  <div className="mt-0.5 shrink-0"><ToggleSwitch on={cfg[n.key]} onChange={() => toggle(n.key)} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {deptModal && (
        <DeptModal
          mode={deptModal.mode}
          initial={deptModal.dept ? { name: deptModal.dept.name, code: deptModal.dept.code, head: deptModal.dept.head, parent: deptModal.dept.parent, active: deptModal.dept.active } : undefined}
          onClose={() => setDeptModal(null)}
          onSave={handleSaveDept}
        />
      )}
      {catModal && (
        <CategoryModal
          mode={catModal.mode}
          initial={catModal.cat ? { name: catModal.cat.name, module: catModal.cat.module, unit: catModal.cat.unit } : undefined}
          onClose={() => setCatModal(null)}
          onSave={handleSaveCat}
        />
      )}
    </div>
  );
}
