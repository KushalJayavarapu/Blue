import { useState } from 'react';
import { Leaf, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  const features = [
    'Real-time carbon emission tracking',
    'Employee CSR engagement & gamification',
    'Governance policy management',
    'GRI / TCFD aligned reporting',
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex font-[Inter,sans-serif]">
      {/* Left panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 bg-[#0d1222] border-r border-[#1a2035] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-semibold text-white">EcoSphere</div>
            <div className="text-xs text-gray-600">ESG Management Platform</div>
          </div>
        </div>

        {/* Hero text */}
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
            Track environmental impact, drive social initiatives, and ensure governance compliance — all in one unified platform built for Fortune 500 enterprises.
          </p>

          <div className="space-y-3 mb-8">
            {features.map((f) => (
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
            ].map((stat) => (
              <div key={stat.label} className="bg-[#111827] border border-[#1a2035] rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-emerald-400">{stat.value}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-700 relative">
          © 2026 EcoSphere Technologies. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-base font-semibold text-white">EcoSphere</span>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@acmecorp.com"
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#1a2035] bg-[#111827] accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Remember me</span>
              </label>
              <button type="button" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 mt-1"
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

          <div className="mt-4 p-3 bg-[#111827] border border-[#1a2035] rounded-xl">
            <p className="text-[10px] text-gray-600 text-center">
              Demo — use any email/password to sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
