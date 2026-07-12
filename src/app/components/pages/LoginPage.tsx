import { useState } from 'react';
import { Leaf, Eye, EyeOff, CheckCircle2, Shield, User } from 'lucide-react';
import type { UserRole } from '../../context/RoleContext';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

// Two demo accounts — credentials determine the role
const DEMO_ACCOUNTS = {
  employee: {
    email: 'sarah.chen@acmecorp.com',
    password: 'employee123',
    label: 'Employee',
    Icon: User,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    desc: 'Personal ESG score, challenges & CSR activities',
  },
  manager: {
    email: 'john.doe@acmecorp.com',
    password: 'manager123',
    label: 'Manager / Admin',
    Icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    desc: 'Full org KPIs, approvals, reports & settings',
  },
} as const;

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isEmployee =
      email === DEMO_ACCOUNTS.employee.email &&
      password === DEMO_ACCOUNTS.employee.password;
    const isManager =
      email === DEMO_ACCOUNTS.manager.email &&
      password === DEMO_ACCOUNTS.manager.password;

    if (!isEmployee && !isManager) {
      setError('Invalid credentials. Use a demo account below to fill in.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(isEmployee ? 'employee' : 'manager');
    }, 800);
  };

  const fill = (role: UserRole) => {
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword(DEMO_ACCOUNTS[role].password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex font-[Geist,sans-serif]">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 bg-[#0d1222] border-r border-[#1a2035] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-semibold text-white">EcoSphere</div>
            <div className="text-xs text-gray-600">ESG Management Platform</div>
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Trusted by 2,400+ companies</span>
          </div>
          <h1 className="text-[32px] font-bold text-white leading-tight mb-4">
            Manage your ESG<br />
            <span className="text-emerald-400">performance</span> at scale
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            One platform, role-based experiences. Employees track personal impact while managers oversee org-wide sustainability performance.
          </p>
          <div className="space-y-3 mb-8">
            {[
              'Real-time carbon emission tracking',
              'Employee CSR engagement & gamification',
              'Governance policy management',
              'GRI / TCFD aligned reporting',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs text-gray-400">{f}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Companies', value: '2,400+' },
              { label: 'Employees', value: '1.2M+' },
              { label: 'CO₂ Saved', value: '48K t' },
            ].map((s) => (
              <div key={s.label} className="bg-[#111827] border border-[#1a2035] rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">{s.value}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-700 relative">© 2026 EcoSphere Technologies. All rights reserved.</div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-base font-semibold text-white">EcoSphere</span>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="your@acmecorp.com"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3.5 py-2.5 bg-red-500/8 border border-red-500/20 rounded-xl text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in to EcoSphere'
              )}
            </button>
          </form>

          {/* Demo account quick-fill cards */}
          <div className="mt-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-[#1a2035]" />
              <span className="text-[10px] text-gray-700 uppercase tracking-wide">Demo accounts</span>
              <div className="flex-1 h-px bg-[#1a2035]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.entries(DEMO_ACCOUNTS) as [UserRole, typeof DEMO_ACCOUNTS[UserRole]][]).map(
                ([role, cred]) => {
                  const { Icon } = cred;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => fill(role)}
                      className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border transition-all text-left hover:brightness-110 ${cred.bg} ${cred.border}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cred.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${cred.color}`} />
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${cred.color}`}>{cred.label}</div>
                        <div className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">{cred.desc}</div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
