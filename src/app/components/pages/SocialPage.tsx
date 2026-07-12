import { useState } from 'react';
import { Users, UserCheck, BarChart3, Check, X } from 'lucide-react';
import { toast } from 'sonner';

type SocialTab = 'csr' | 'participation' | 'diversity';

type ParticipationStatus = 'pending' | 'approved' | 'rejected';

type Participant = {
  id: number;
  employee: string;
  dept: string;
  activity: string;
  evidence: string;
  status: ParticipationStatus;
};

const csrActivities = [
  { id: 1, title: 'Community Tree Planting', desc: 'Plant 500 trees in the local park with residents and volunteers.', participants: 24, points: 150, category: 'Environment', emoji: '🌳' },
  { id: 2, title: 'Blood Donation Drive', desc: 'Quarterly blood donation campaign with the Red Cross.', participants: 41, points: 200, category: 'Health', emoji: '🩸' },
  { id: 3, title: 'STEM Mentorship Program', desc: 'Mentor underprivileged students in STEM fields weekly.', participants: 18, points: 300, category: 'Education', emoji: '📚' },
  { id: 4, title: 'Annual Beach Cleanup', desc: 'Annual coastal cleanup of the local shoreline.', participants: 56, points: 100, category: 'Environment', emoji: '🏖️' },
  { id: 5, title: 'Food Bank Volunteer', desc: 'Help distribute food packages at local homeless shelters.', participants: 33, points: 175, category: 'Community', emoji: '🍱' },
  { id: 6, title: 'Digital Literacy Workshop', desc: 'Tech skills training sessions for senior citizens.', participants: 12, points: 250, category: 'Education', emoji: '💻' },
];

const initialParticipation: Participant[] = [
  { id: 1, employee: 'Sarah Chen', dept: 'HR', activity: 'Community Tree Planting', evidence: 'photo_proof.jpg', status: 'pending' },
  { id: 2, employee: 'Marcus Johnson', dept: 'Engineering', activity: 'Blood Donation Drive', evidence: 'donation_cert.pdf', status: 'approved' },
  { id: 3, employee: 'Emma Williams', dept: 'Marketing', activity: 'STEM Mentorship Program', evidence: 'attendance_form.pdf', status: 'pending' },
  { id: 4, employee: 'James Lee', dept: 'Engineering', activity: 'Annual Beach Cleanup', evidence: 'group_photo.jpg', status: 'rejected' },
  { id: 5, employee: 'Aria Patel', dept: 'HR', activity: 'Food Bank Volunteer', evidence: 'volunteer_hours.pdf', status: 'pending' },
  { id: 6, employee: 'David Kim', dept: 'Finance', activity: 'Digital Literacy Workshop', evidence: 'facilitator_sign.pdf', status: 'approved' },
];

const divGenderData = [
  { label: 'Female', value: 44, color: 'bg-blue-500' },
  { label: 'Male', value: 52, color: 'bg-violet-500' },
  { label: 'Non-binary', value: 4, color: 'bg-orange-500' },
];

const deptDiversity = [
  { name: 'HR', female: 71 }, { name: 'Marketing', female: 62 }, { name: 'Finance', female: 45 },
  { name: 'Operations', female: 35 }, { name: 'Sales', female: 40 }, { name: 'Engineering', female: 28 },
];

function EmployeeDrawer({ employee, onClose }: { employee: Participant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="w-80 bg-[#0d1222] border-l border-[#1a2035] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">Employee Profile</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1a2035] text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 p-5">
          <div className="flex flex-col items-center py-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-xl font-bold text-blue-400 mb-3">
              {employee.employee.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-sm font-semibold text-white">{employee.employee}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Senior Specialist · {employee.dept}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'CSR Points', value: '1,240', color: 'text-orange-400' },
              { label: 'Activities', value: '8', color: 'text-blue-400' },
              { label: 'Badges', value: '5', color: 'text-violet-400' },
              { label: 'Participation', value: '92%', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#111827] border border-[#1a2035] rounded-xl p-3 text-center">
                <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Recent Activities</h4>
            {[employee.activity, 'Blood Donation Drive', 'Annual Beach Cleanup'].map((a, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2 border-b border-[#1a2035] last:border-0">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-xs text-gray-300">{a}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-[#1a2035]">
          <button
            onClick={() => { toast.success(`Sending message to ${employee.employee}...`); onClose(); }}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export function SocialPage() {
  const [activeTab, setActiveTab] = useState<SocialTab>('csr');
  const [selectedEmployee, setSelectedEmployee] = useState<Participant | null>(null);
  const [participation, setParticipation] = useState<Participant[]>(initialParticipation);
  const [activityCounts, setActivityCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(csrActivities.map(a => [a.id, a.participants]))
  );
  const [joinedActivities, setJoinedActivities] = useState<Set<number>>(new Set());

  const tabs = [
    { id: 'csr' as SocialTab, label: 'CSR Activities', icon: Users },
    { id: 'participation' as SocialTab, label: 'Employee Participation', icon: UserCheck },
    { id: 'diversity' as SocialTab, label: 'Diversity Dashboard', icon: BarChart3 },
  ];

  const handleJoin = (activityId: number, title: string) => {
    if (joinedActivities.has(activityId)) {
      setJoinedActivities(prev => { const n = new Set(prev); n.delete(activityId); return n; });
      setActivityCounts(prev => ({ ...prev, [activityId]: prev[activityId] - 1 }));
      toast.info(`Left "${title}"`);
    } else {
      setJoinedActivities(prev => new Set([...prev, activityId]));
      setActivityCounts(prev => ({ ...prev, [activityId]: prev[activityId] + 1 }));
      toast.success(`Joined "${title}"! +${csrActivities.find(a => a.id === activityId)?.points ?? 0} pts`);
    }
  };

  const handleApprove = (id: number, name: string) => {
    setParticipation(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    toast.success(`Approved ${name}'s participation`);
  };

  const handleReject = (id: number, name: string) => {
    setParticipation(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    toast.error(`Rejected ${name}'s participation`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-white">Social</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage CSR activities, track employee participation, and monitor diversity metrics</p>
      </div>

      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id ? 'bg-blue-600/90 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'csr' && (
        <div className="grid grid-cols-3 gap-4">
          {csrActivities.map(act => {
            const joined = joinedActivities.has(act.id);
            return (
              <div key={act.id} className={`bg-[#0d1222] border rounded-2xl p-4 transition-all ${joined ? 'border-blue-500/40' : 'border-[#1a2035] hover:border-blue-500/30'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{act.emoji}</div>
                  <span className="text-[11px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">{act.category}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mb-1">{act.title}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{act.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Users className="w-3 h-3" /> {activityCounts[act.id]}
                    </span>
                    <span className="text-[11px] text-orange-400 font-semibold">+{act.points} pts</span>
                  </div>
                  <button
                    onClick={() => handleJoin(act.id, act.title)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${joined ? 'bg-[#1a2035] text-gray-400 hover:text-red-400 border border-[#2a3550]' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    {joined ? 'Leave' : 'Join'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'participation' && (
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2035]">
                {['Employee', 'Activity', 'Evidence', 'Approval Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participation.map(row => (
                <tr key={row.id} className="border-b border-[#1a2035] hover:bg-[#111827] transition-colors">
                  <td className="px-5 py-3.5">
                    <button
                      className="flex items-center gap-2.5 text-left"
                      onClick={() => setSelectedEmployee(row)}
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-[11px] font-semibold shrink-0 text-blue-400">
                        {row.employee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-200 hover:text-blue-400 transition-colors">{row.employee}</div>
                        <div className="text-[10px] text-gray-600">{row.dept}</div>
                      </div>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-300">{row.activity}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toast.info(`Opening ${row.evidence}...`)}
                      className="text-xs text-blue-400 underline cursor-pointer hover:text-blue-300 transition-colors"
                    >
                      {row.evidence}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border capitalize ${
                      row.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      row.status === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                      'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    }`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {row.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(row.id, row.employee)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(row.id, row.employee)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'diversity' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Gender Distribution</h3>
            <p className="text-xs text-gray-500 mb-5">Across all departments — FY 2026</p>
            <div className="space-y-4 mb-6">
              {divGenderData.map(d => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">{d.label}</span>
                    <span className="text-xs font-semibold text-gray-200">{d.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1a2035] rounded-full overflow-hidden">
                    <div className={`h-full ${d.color} rounded-full transition-all duration-700`} style={{ width: `${d.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg Tenure', value: '3.4 yrs', color: 'text-blue-400' },
                { label: 'Women in Leadership', value: '38%', color: 'text-violet-400' },
                { label: 'Pay Equity Ratio', value: '0.97', color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#111827] border border-[#1a2035] rounded-xl p-3 text-center">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Department Diversity</h3>
            <p className="text-xs text-gray-500 mb-5">Female representation by dept</p>
            <div className="space-y-3.5">
              {deptDiversity.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{d.name}</span>
                    <span className="text-xs text-blue-400 font-medium">{d.female}%</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-violet-500/30">
                    <div className="bg-blue-500 rounded-full" style={{ width: `${d.female}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEmployee && <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
    </div>
  );
}
