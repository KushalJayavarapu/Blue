import { useState } from 'react';
import { Search, Plus, FileText, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type GovTab = 'policies' | 'acknowledgements' | 'audits' | 'compliance';

type Policy = {
  id: number;
  name: string;
  category: string;
  updated: string;
  required: boolean;
  ackRate: number;
  total: number;
};

type ComplianceIssue = {
  id: number;
  issue: string;
  severity: string;
  owner: string;
  dueDate: string;
  status: string;
};

const initialPolicies: Policy[] = [
  { id: 1, name: 'Environmental Policy v3.1', category: 'Environmental', updated: '2026-06-01', required: true, ackRate: 94, total: 166 },
  { id: 2, name: 'Data Privacy Policy v2.0', category: 'Governance', updated: '2026-07-01', required: true, ackRate: 72, total: 166 },
  { id: 3, name: 'Code of Ethics', category: 'Governance', updated: '2026-01-15', required: true, ackRate: 98, total: 166 },
  { id: 4, name: 'Anti-Corruption Policy', category: 'Governance', updated: '2025-12-01', required: true, ackRate: 89, total: 166 },
  { id: 5, name: 'Health & Safety Policy', category: 'Social', updated: '2026-03-10', required: true, ackRate: 97, total: 166 },
  { id: 6, name: 'Supplier Code of Conduct', category: 'Governance', updated: '2025-11-20', required: false, ackRate: 61, total: 166 },
];

const audits = [
  { id: 1, audit: 'ISO 14001 Environmental', dept: 'Operations', auditor: 'PwC', date: '2026-11-15', findings: 3, status: 'in-progress' },
  { id: 2, audit: 'SOC 2 Type II Security', dept: 'Engineering', auditor: 'Deloitte', date: '2026-10-01', findings: 0, status: 'completed' },
  { id: 3, audit: 'GDPR Compliance Review', dept: 'All Departments', auditor: 'Internal', date: '2026-12-01', findings: 2, status: 'scheduled' },
  { id: 4, audit: 'Financial Controls Audit', dept: 'Finance', auditor: 'KPMG', date: '2026-09-30', findings: 1, status: 'completed' },
  { id: 5, audit: 'ESG Disclosure Audit', dept: 'All Departments', auditor: 'EY', date: '2027-01-15', findings: 0, status: 'scheduled' },
];

const initialIssues: ComplianceIssue[] = [
  { id: 1, issue: 'Outdated Privacy Policy', severity: 'high', owner: 'Legal Dept', dueDate: '2026-12-15', status: 'open' },
  { id: 2, issue: 'Missing Carbon Data Q3', severity: 'medium', owner: 'Operations', dueDate: '2026-11-30', status: 'in-progress' },
  { id: 3, issue: 'Training Completion Gap (12%)', severity: 'low', owner: 'HR', dueDate: '2026-12-31', status: 'in-progress' },
  { id: 4, issue: 'Supplier ESG Assessment Overdue', severity: 'high', owner: 'Procurement', dueDate: '2027-01-10', status: 'open' },
  { id: 5, issue: 'Board Diversity Report Missing', severity: 'medium', owner: 'Legal Dept', dueDate: '2027-02-01', status: 'resolved' },
  { id: 6, issue: 'GDPR Consent Records Gap', severity: 'high', owner: 'Engineering', dueDate: '2026-11-01', status: 'open' },
];

function SeverityBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
    medium: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] border capitalize ${map[s]}`}>{s}</span>;
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    open: 'text-red-400 bg-red-500/10 border-red-500/20',
    'in-progress': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    scheduled: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  };
  const labels: Record<string, string> = { 'in-progress': 'In Progress' };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] border capitalize ${map[s] || ''}`}>{labels[s] || s}</span>;
}

type NewPolicyForm = { name: string; category: string; required: boolean };
const emptyPolicy: NewPolicyForm = { name: '', category: 'Governance', required: true };

function PolicyModal({ onClose, onSave }: { onClose: () => void; onSave: (data: NewPolicyForm) => void }) {
  const [form, setForm] = useState<NewPolicyForm>(emptyPolicy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Policy name is required'); return; }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-[#0d1222] border border-[#1a2035] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">New Policy</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Policy Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Whistleblower Protection Policy"
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-violet-500/40"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-violet-500/40"
            >
              <option>Environmental</option>
              <option>Social</option>
              <option>Governance</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="required-check"
              checked={form.required}
              onChange={e => setForm(p => ({ ...p, required: e.target.checked }))}
              className="w-4 h-4 accent-violet-500 rounded"
            />
            <label htmlFor="required-check" className="text-xs text-gray-300 cursor-pointer">Required — all employees must acknowledge</label>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors">Create Policy</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IssueDrawer({
  issue,
  onClose,
  onResolve,
}: {
  issue: ComplianceIssue;
  onClose: () => void;
  onResolve: (id: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="w-96 bg-[#0d1222] border-l border-[#1a2035] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">Issue Details</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div>
            <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Issue</p>
            <p className="text-sm font-semibold text-gray-100">{issue.issue}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-2">Severity</p>
              <SeverityBadge s={issue.severity} />
            </div>
            <div>
              <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-2">Status</p>
              <StatusBadge s={issue.status} />
            </div>
          </div>
          <div>
            <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Owner</p>
            <p className="text-sm text-gray-300">{issue.owner}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-1">Due Date</p>
            <p className="text-sm text-gray-300">{issue.dueDate}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-2">Resolution Steps</p>
            <div className="space-y-2">
              {['Identify root cause', 'Assign remediation owner', 'Implement fix', 'Verify and close'].map((step, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${i < 2 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-[#1a2035] text-gray-600'}`}>
                    {i < 2 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${i < 2 ? 'text-gray-400 line-through' : 'text-gray-300'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#1a2035] flex gap-2">
          {issue.status !== 'resolved' ? (
            <button
              className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors"
              onClick={() => { onResolve(issue.id); onClose(); }}
            >
              Mark Resolved
            </button>
          ) : (
            <div className="flex-1 py-2 text-center text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">Already Resolved</div>
          )}
          <button
            className="flex-1 py-2 bg-[#111827] border border-[#1a2035] text-gray-400 hover:text-gray-200 text-xs rounded-xl transition-colors"
            onClick={() => { toast.success(`Reassignment request sent for "${issue.issue}"`); onClose(); }}
          >
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
}

export function GovernancePage() {
  const [activeTab, setActiveTab] = useState<GovTab>('policies');
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [issues, setIssues] = useState<ComplianceIssue[]>(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<ComplianceIssue | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPolicies = policies.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'policies' as GovTab, label: 'Policies' },
    { id: 'acknowledgements' as GovTab, label: 'Policy Acknowledgements' },
    { id: 'audits' as GovTab, label: 'Audits' },
    { id: 'compliance' as GovTab, label: 'Compliance Issues' },
  ];

  const handleSavePolicy = (data: NewPolicyForm) => {
    const today = new Date().toISOString().slice(0, 10);
    const newPolicy: Policy = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      updated: today,
      required: data.required,
      ackRate: 0,
      total: 166,
    };
    setPolicies(prev => [...prev, newPolicy]);
    toast.success(`Policy "${data.name}" created`);
  };

  const handleDeletePolicy = (id: number, name: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
    toast.success(`"${name}" deleted`);
  };

  const handleResolveIssue = (id: number) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
    const issue = issues.find(i => i.id === id);
    toast.success(`"${issue?.issue}" marked as resolved`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Governance</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage policies, audits, and compliance tracking across the organization</p>
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

      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search policies..."
                className="w-full pl-9 pr-4 py-2 bg-[#0d1222] border border-[#1a2035] rounded-xl text-xs text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-[#2a3550]"
              />
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setShowPolicyModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Policy
            </button>
          </div>
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2035]">
                  {['Policy Name', 'Category', 'Last Updated', 'Required', 'Acknowledgement Rate', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((p) => (
                  <tr key={p.id} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-200">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        p.category === 'Environmental' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        p.category === 'Social' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                        'text-violet-400 bg-violet-500/10 border-violet-500/20'
                      }`}>{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{p.updated}</td>
                    <td className="px-5 py-3.5">
                      {p.required
                        ? <span className="text-[11px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">Required</span>
                        : <span className="text-[11px] text-gray-600 bg-[#1a2035] px-2 py-0.5 rounded-full">Optional</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.ackRate >= 90 ? 'bg-emerald-500' : p.ackRate >= 75 ? 'bg-rose-500' : 'bg-red-500'}`} style={{ width: `${p.ackRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{p.ackRate}%</span>
                        <span className="text-[11px] text-gray-600">{Math.round(p.total * p.ackRate / 100)}/{p.total}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toast.info(`Editing "${p.name}"...`); }}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#1a2035] text-gray-600 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePolicy(p.id, p.name); }}
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

      {activeTab === 'acknowledgements' && (
        <div className="grid grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-4 hover:border-violet-500/30 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-gray-200">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-600">Updated {p.updated}</span>
                    {p.required && <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Required</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-2 bg-[#1a2035] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.ackRate >= 90 ? 'bg-emerald-500' : p.ackRate >= 75 ? 'bg-rose-500' : 'bg-red-500'}`} style={{ width: `${p.ackRate}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-200 shrink-0">{p.ackRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-gray-600">
                  {Math.round(p.total * p.ackRate / 100)} of {p.total} employees acknowledged
                </p>
                <button
                  onClick={() => toast.info(`Sending reminder for "${p.name}"...`)}
                  className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audits' && (
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2035]">
                {['Audit', 'Department', 'Auditor', 'Date', 'Findings', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audits.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors cursor-pointer"
                  onClick={() => toast.info(`Opening ${a.audit} details...`)}
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{a.audit}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{a.dept}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-300">{a.auditor}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{a.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${a.findings === 0 ? 'text-emerald-400' : a.findings <= 2 ? 'text-rose-400' : 'text-red-400'}`}>
                      {a.findings} {a.findings === 1 ? 'finding' : 'findings'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge s={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2035]">
                {['Issue', 'Severity', 'Owner', 'Due Date', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors cursor-pointer"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-200">{issue.issue}</td>
                  <td className="px-5 py-3.5"><SeverityBadge s={issue.severity} /></td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{issue.owner}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{issue.dueDate}</td>
                  <td className="px-5 py-3.5"><StatusBadge s={issue.status} /></td>
                  <td className="px-5 py-3.5 text-[11px] text-violet-400 hover:text-violet-300">View →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedIssue && (
        <IssueDrawer
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onResolve={handleResolveIssue}
        />
      )}
      {showPolicyModal && <PolicyModal onClose={() => setShowPolicyModal(false)} onSave={handleSavePolicy} />}
    </div>
  );
}
