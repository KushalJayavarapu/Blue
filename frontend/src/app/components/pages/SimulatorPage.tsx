import { useState, useCallback } from 'react';
import { FlaskConical, User, Sliders, TrendingDown, TrendingUp, Zap, Car, Plane, Leaf, RotateCcw, ChevronDown, Info } from 'lucide-react';
import { toast } from 'sonner';

// ─── Shared slider+text input ────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  color?: string;
  onChange: (v: number) => void;
  formatDisplay?: (v: number) => string;
}

function SliderInput({
  label, value, min, max, step = 1, unit = '', hint, color = '#10b981',
  onChange, formatDisplay,
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatDisplay ? formatDisplay(value) : String(value);

  const handleText = (raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-300">{label}</span>
          {hint && (
            <span className="group relative">
              <Info className="w-3 h-3 text-gray-700 cursor-help" />
              <span className="pointer-events-none absolute left-5 -top-1 z-10 w-44 bg-[#111827] border border-[#2a3550] rounded-lg px-2.5 py-1.5 text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                {hint}
              </span>
            </span>
          )}
        </div>
        {/* Editable text input */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={display}
            min={min}
            max={max}
            step={step}
            onChange={e => handleText(e.target.value)}
            className="w-16 text-right px-2 py-0.5 bg-[#111827] border border-[#1a2035] rounded-lg text-xs text-gray-200 font-mono focus:outline-none focus:border-[#2a3550] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && <span className="text-[11px] text-gray-600 min-w-[28px]">{unit}</span>}
        </div>
      </div>

      {/* Custom slider */}
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-[#1a2035] rounded-full" />
        <div
          className="absolute h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        {/* Thumb */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md transition-all pointer-events-none"
          style={{ left: `calc(${pct}% - 7px)`, background: color }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-700">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Donut ring ──────────────────────────────────────────────────────────────

function Ring({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = size * 0.38, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2035" strokeWidth={size * 0.1} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={size * 0.1}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
    </svg>
  );
}

// ─── Comparison bar ──────────────────────────────────────────────────────────

function CompareBar({ before, after, max, label, unit, color }: { before: number; after: number; max: number; label: string; unit: string; color: string }) {
  const bPct = Math.min((before / max) * 100, 100);
  const aPct = Math.min((after / max) * 100, 100);
  const delta = after - before;
  const deltaPct = before > 0 ? Math.round((delta / before) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-[11px] font-semibold ${delta < 0 ? 'text-emerald-400' : delta > 0 ? 'text-red-400' : 'text-gray-500'}`}>
          {delta < 0 ? '↓' : delta > 0 ? '↑' : ''}{Math.abs(deltaPct)}% {delta < 0 ? 'reduction' : delta > 0 ? 'increase' : 'no change'}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 w-10 text-right shrink-0">Before</span>
          <div className="flex-1 h-3 bg-[#1a2035] rounded-full overflow-hidden">
            <div className="h-full bg-[#2a3550] rounded-full transition-all duration-700" style={{ width: `${bPct}%` }} />
          </div>
          <span className="text-[11px] text-gray-500 w-20 shrink-0 font-mono">{before.toLocaleString()} {unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 w-10 text-right shrink-0">After</span>
          <div className="flex-1 h-3 bg-[#1a2035] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${aPct}%`, background: color }} />
          </div>
          <span className="text-[11px] font-semibold w-20 shrink-0 font-mono" style={{ color }}>{after.toLocaleString()} {unit}</span>
        </div>
      </div>
    </div>
  );
}

// ─── User Impact ─────────────────────────────────────────────────────────────

const COMMUTE_FACTORS: Record<string, number> = {
  'Private Car': 0.171,   // kg CO₂ per km
  'Electric Car': 0.053,
  'Train / Metro': 0.041,
  'Bus': 0.089,
  'Cycling / Walking': 0,
};

const ROLE_MULTIPLIERS: Record<string, number> = {
  'Individual Contributor': 1.0,
  'Manager': 1.3,
  'Director': 1.7,
  'Executive': 2.4,
};

const DEPTS = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations'];

const DEPT_AVGS: Record<string, number> = {
  Engineering: 2840, Marketing: 3120, HR: 2100, Finance: 3450, Sales: 4200, Operations: 2680,
};

function UserImpactTab() {
  const [role, setRole] = useState('Individual Contributor');
  const [dept, setDept] = useState('Engineering');
  const [commuteDays, setCommuteDays] = useState(3);
  const [commuteDist, setCommuteDist] = useState(18);
  const [commuteMode, setCommuteMode] = useState('Private Car');
  const [flightDays, setFlightDays] = useState(4);
  const [paperSheets, setPaperSheets] = useState(20);
  const [deviceHours, setDeviceHours] = useState(8);

  // Annual carbon calculation (kg)
  const commuteCarbon = commuteDays * 52 * commuteDist * 2 * COMMUTE_FACTORS[commuteMode];
  const flightCarbon = flightDays * 280; // avg short-haul
  const paperCarbon = paperSheets * 240 * 0.005;
  const deviceCarbon = deviceHours * 240 * 0.04;
  const baseCarbon = commuteCarbon + flightCarbon + paperCarbon + deviceCarbon;
  const totalCarbon = Math.round(baseCarbon * ROLE_MULTIPLIERS[role]);

  const deptAvg = DEPT_AVGS[dept];
  const vsAvg = Math.round(((totalCarbon - deptAvg) / deptAvg) * 100);
  const treesNeeded = Math.round(totalCarbon / 21.7);
  const orgShare = ((totalCarbon / 180000) * 100).toFixed(2);
  const ringPct = Math.min(Math.round((totalCarbon / 6000) * 100), 100);
  const ringColor = totalCarbon < 2500 ? '#10b981' : totalCarbon < 4000 ? '#eab308' : '#ef4444';

  const handleReset = () => {
    setCommuteDays(3); setCommuteDist(18); setCommuteMode('Private Car');
    setFlightDays(4); setPaperSheets(20); setDeviceHours(8);
    toast.success('Reset to default values');
  };

  return (
    <div className="grid grid-cols-5 gap-5">
      {/* Controls */}
      <div className="col-span-3 space-y-5">
        {/* Profile */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-blue-400" /> Your Profile
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5">Role Level</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550] appearance-none"
                >
                  {Object.keys(ROLE_MULTIPLIERS).map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5">Department</label>
              <div className="relative">
                <select
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className="w-full px-3 py-2 bg-[#111827] border border-[#1a2035] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#2a3550] appearance-none"
                >
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Commute */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-white mb-4 flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-orange-400" /> Commute
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1.5">Transport Mode</label>
              <div className="grid grid-cols-5 gap-1.5">
                {Object.keys(COMMUTE_FACTORS).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCommuteMode(mode)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all border ${
                      commuteMode === mode
                        ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                        : 'bg-[#111827] border-[#1a2035] text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {mode.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <SliderInput
              label="Days in office per week"
              value={commuteDays}
              min={0} max={5}
              unit=" days"
              color="#f97316"
              hint="Days you physically commute to the office each week"
              onChange={setCommuteDays}
            />
            <SliderInput
              label="One-way commute distance"
              value={commuteDist}
              min={0} max={100}
              unit=" km"
              color="#f97316"
              hint="Distance from home to office (one way)"
              onChange={setCommuteDist}
            />
          </div>
        </div>

        {/* Travel & Office */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-white mb-4 flex items-center gap-2">
            <Plane className="w-3.5 h-3.5 text-blue-400" /> Travel & Office Usage
          </h3>
          <div className="space-y-5">
            <SliderInput
              label="Business flight days per year"
              value={flightDays}
              min={0} max={60}
              unit=" days"
              color="#3b82f6"
              hint="Total days spent flying for work annually. Avg short-haul = 280 kg CO₂"
              onChange={setFlightDays}
            />
            <SliderInput
              label="Paper usage"
              value={paperSheets}
              min={0} max={200}
              unit=" sheets/day"
              color="#8b5cf6"
              hint="Sheets of paper printed daily on average"
              onChange={setPaperSheets}
            />
            <SliderInput
              label="Device usage"
              value={deviceHours}
              min={1} max={16}
              unit=" hrs/day"
              color="#06b6d4"
              hint="Hours of laptop/monitor use per working day"
              onChange={setDeviceHours}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 bg-[#111827] border border-[#1a2035] text-gray-500 hover:text-gray-300 text-xs rounded-xl transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset to defaults
          </button>
        </div>
      </div>

      {/* Results panel */}
      <div className="col-span-2 space-y-4">
        {/* Main metric */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5 text-center">
          <p className="text-[11px] text-gray-500 mb-3">Your Estimated Annual Carbon Footprint</p>
          <div className="relative inline-flex items-center justify-center mb-3">
            <Ring pct={ringPct} color={ringColor} size={100} />
            <div className="absolute text-center">
              <div className="text-lg font-bold text-white">{(totalCarbon / 1000).toFixed(1)}</div>
              <div className="text-[10px] text-gray-600">tCO₂e</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-600">
            {totalCarbon < 2500 ? '🟢 Below average — great job!' : totalCarbon < 4000 ? '🟡 Near average — room to improve' : '🔴 Above average — consider changes'}
          </p>
        </div>

        {/* Breakdown */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-white mb-3">Emission Breakdown</h4>
          <div className="space-y-2.5">
            {[
              { label: 'Commute', value: Math.round(commuteCarbon), color: '#f97316', icon: '🚗' },
              { label: 'Business Travel', value: Math.round(flightCarbon), color: '#3b82f6', icon: '✈️' },
              { label: 'Paper & Printing', value: Math.round(paperCarbon), color: '#8b5cf6', icon: '📄' },
              { label: 'Devices & Equipment', value: Math.round(deviceCarbon), color: '#06b6d4', icon: '💻' },
            ].map(row => {
              const pct = totalCarbon > 0 ? Math.round((row.value / totalCarbon) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-400">{row.icon} {row.label}</span>
                    <span className="text-[11px] text-gray-300 font-mono">{row.value.toLocaleString()} kg · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: row.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Context stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'vs Dept Average',
              value: `${vsAvg > 0 ? '+' : ''}${vsAvg}%`,
              sub: `${dept} avg: ${(deptAvg / 1000).toFixed(1)} t`,
              color: vsAvg <= 0 ? 'text-emerald-400' : 'text-red-400',
              bg: vsAvg <= 0 ? 'bg-emerald-500/8 border-emerald-500/15' : 'bg-red-500/8 border-red-500/15',
            },
            {
              label: 'Trees to Offset',
              value: treesNeeded.toLocaleString(),
              sub: 'trees absorb ~21.7 kg/yr',
              color: 'text-green-400',
              bg: 'bg-green-500/8 border-green-500/15',
            },
            {
              label: 'Org Contribution',
              value: `${orgShare}%`,
              sub: 'of company total (est.)',
              color: 'text-blue-400',
              bg: 'bg-blue-500/8 border-blue-500/15',
            },
            {
              label: 'Role Multiplier',
              value: `×${ROLE_MULTIPLIERS[role]}`,
              sub: role,
              color: 'text-violet-400',
              bg: 'bg-violet-500/8 border-violet-500/15',
            },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-3 ${s.bg}`}>
              <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-gray-700 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Top tip */}
        {commuteCarbon > flightCarbon && commuteCarbon > 500 && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-300">
              Switching to <strong>Train / Metro</strong> would cut your commute emissions by ~{Math.round((1 - COMMUTE_FACTORS['Train / Metro'] / Math.max(COMMUTE_FACTORS[commuteMode], 0.001)) * 100)}% — saving ~{Math.round((commuteCarbon - commuteDays * 52 * commuteDist * 2 * COMMUTE_FACTORS['Train / Metro']) / 1000 * 10) / 10} tCO₂e/yr.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scenario Simulator ──────────────────────────────────────────────────────

type ScenarioPreset = {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
  params: ScenarioParam[];
  compute: (vals: Record<string, number>) => ScenarioResult;
};

type ScenarioParam = {
  key: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit: string;
  default: number;
  hint?: string;
  color: string;
};

type ScenarioResult = {
  carbonBefore: number;
  carbonAfter: number;
  costSaving: number;
  timeToROI: number;
  unit: string;
  extras: { label: string; value: string; color: string }[];
};

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'renewable',
    label: 'Switch to Renewables',
    icon: '⚡',
    desc: 'Replace grid electricity with solar/wind for office operations',
    color: '#eab308',
    params: [
      { key: 'energyMWh', label: 'Annual energy consumption', min: 50, max: 2000, step: 10, unit: 'MWh', default: 400, hint: 'Total electricity used by offices per year', color: '#eab308' },
      { key: 'renewablePct', label: 'Renewable transition %', min: 10, max: 100, unit: '%', default: 60, hint: 'Percentage of electricity shifted to renewables', color: '#10b981' },
      { key: 'installCost', label: 'Installation cost', min: 50, max: 2000, step: 10, unit: 'k$', default: 350, hint: 'Upfront investment for solar/wind installation', color: '#3b82f6' },
    ],
    compute: (v) => {
      const gridFactor = 0.42; // kg CO₂/kWh
      const before = v.energyMWh * 1000 * gridFactor;
      const after = before * (1 - v.renewablePct / 100);
      const annualSaving = (v.energyMWh * (v.renewablePct / 100)) * 0.18 * 1000; // $0.18/kWh saved
      const roi = (v.installCost * 1000) / annualSaving;
      return {
        carbonBefore: Math.round(before / 1000),
        carbonAfter: Math.round(after / 1000),
        costSaving: Math.round(annualSaving),
        timeToROI: Math.round(roi * 10) / 10,
        unit: 'tCO₂e',
        extras: [
          { label: 'kWh offset per year', value: `${Math.round(v.energyMWh * (v.renewablePct / 100) * 1000).toLocaleString()}`, color: '#eab308' },
          { label: 'Annual $ savings', value: `$${annualSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10b981' },
          { label: 'ROI timeline', value: `${roi.toFixed(1)} years`, color: '#3b82f6' },
          { label: 'Carbon certificates', value: `${Math.round((before - after) / 1000 * 25).toLocaleString()} credits`, color: '#8b5cf6' },
        ],
      };
    },
  },
  {
    id: 'fleet',
    label: 'Fleet Electrification',
    icon: '🚗',
    desc: 'Replace internal combustion vehicles with EVs across the company fleet',
    color: '#10b981',
    params: [
      { key: 'fleetSize', label: 'Fleet size', min: 1, max: 200, unit: 'vehicles', default: 25, hint: 'Total number of company-owned vehicles', color: '#10b981' },
      { key: 'avgKmPerYear', label: 'Avg km per vehicle/year', min: 5000, max: 80000, step: 500, unit: 'km', default: 25000, hint: 'Average annual distance driven per vehicle', color: '#f97316' },
      { key: 'evPct', label: 'EV transition %', min: 10, max: 100, unit: '%', default: 50, color: '#3b82f6' },
      { key: 'costPerEV', label: 'Cost per EV', min: 20, max: 120, step: 1, unit: 'k$', default: 45, hint: 'Purchase price per electric vehicle', color: '#8b5cf6' },
    ],
    compute: (v) => {
      const iceFactor = 0.171; // kg CO₂/km
      const evFactor = 0.053;
      const before = v.fleetSize * v.avgKmPerYear * iceFactor;
      const evCount = Math.round(v.fleetSize * v.evPct / 100);
      const after = (v.fleetSize - evCount) * v.avgKmPerYear * iceFactor + evCount * v.avgKmPerYear * evFactor;
      const fuelSaving = evCount * v.avgKmPerYear * (0.12 - 0.035); // fuel vs electric cost
      const capex = evCount * v.costPerEV * 1000;
      const roi = fuelSaving > 0 ? capex / fuelSaving : 99;
      return {
        carbonBefore: Math.round(before / 1000),
        carbonAfter: Math.round(after / 1000),
        costSaving: Math.round(fuelSaving),
        timeToROI: Math.round(roi * 10) / 10,
        unit: 'tCO₂e',
        extras: [
          { label: 'EVs converted', value: `${evCount} vehicles`, color: '#10b981' },
          { label: 'Annual fuel savings', value: `$${fuelSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#eab308' },
          { label: 'Capex required', value: `$${(capex / 1000).toFixed(0)}k`, color: '#3b82f6' },
          { label: 'ROI payback', value: `${roi.toFixed(1)} yrs`, color: '#8b5cf6' },
        ],
      };
    },
  },
  {
    id: 'remote',
    label: 'Remote Work Policy',
    icon: '🏠',
    desc: 'Increase work-from-home days to reduce commute and office energy emissions',
    color: '#3b82f6',
    params: [
      { key: 'employees', label: 'Eligible employees', min: 10, max: 5000, step: 10, unit: 'people', default: 300, color: '#3b82f6' },
      { key: 'currentDays', label: 'Current office days/week', min: 1, max: 5, unit: 'days', default: 4, color: '#f97316' },
      { key: 'targetDays', label: 'Target office days/week', min: 0, max: 4, unit: 'days', default: 2, hint: 'Days per week employees come into the office after policy change', color: '#10b981' },
      { key: 'avgCommute', label: 'Avg commute distance', min: 5, max: 80, unit: 'km', default: 22, color: '#8b5cf6' },
    ],
    compute: (v) => {
      const factor = 0.171;
      const weeksPerYear = 48;
      const before = v.employees * v.currentDays * weeksPerYear * v.avgCommute * 2 * factor;
      const after = v.employees * v.targetDays * weeksPerYear * v.avgCommute * 2 * factor;
      const officeSaving = (v.currentDays - v.targetDays) / v.currentDays * 0.3; // 30% of office costs
      const annualOfficeCost = v.employees * 8000;
      const costSaving = annualOfficeCost * officeSaving;
      return {
        carbonBefore: Math.round(before / 1000),
        carbonAfter: Math.round(after / 1000),
        costSaving: Math.round(costSaving),
        timeToROI: 0,
        unit: 'tCO₂e',
        extras: [
          { label: 'Office days reduced', value: `${v.currentDays - v.targetDays} days/wk`, color: '#3b82f6' },
          { label: 'Annual office savings', value: `$${costSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10b981' },
          { label: 'Commute hours saved', value: `${Math.round(v.employees * (v.currentDays - v.targetDays) * weeksPerYear * 1.2).toLocaleString()} hrs`, color: '#eab308' },
          { label: 'Emissions per employee', value: `${((before - after) / v.employees / 1000).toFixed(2)} t saved`, color: '#8b5cf6' },
        ],
      };
    },
  },
  {
    id: 'supply',
    label: 'Sustainable Supply Chain',
    icon: '🔗',
    desc: 'Shift procurement toward low-carbon, certified suppliers',
    color: '#8b5cf6',
    params: [
      { key: 'spendM', label: 'Annual procurement spend', min: 1, max: 100, unit: 'M$', default: 12, hint: 'Total annual spend with external suppliers', color: '#8b5cf6' },
      { key: 'currentScope3', label: 'Current Scope 3 intensity', min: 50, max: 500, step: 5, unit: 'tCO₂/$M', default: 180, hint: 'Estimated tonnes CO₂ per $M spend from supply chain', color: '#f97316' },
      { key: 'greenPct', label: 'Green supplier switch %', min: 5, max: 80, unit: '%', default: 30, color: '#10b981' },
      { key: 'premiumPct', label: 'Green premium', min: 0, max: 25, unit: '%', default: 8, hint: 'Extra cost of certified sustainable suppliers vs standard', color: '#eab308' },
    ],
    compute: (v) => {
      const before = v.spendM * v.currentScope3;
      const reducedFactor = v.currentScope3 * (1 - v.greenPct / 100 * 0.65);
      const after = v.spendM * reducedFactor;
      const extraCost = v.spendM * 1_000_000 * (v.greenPct / 100) * (v.premiumPct / 100);
      return {
        carbonBefore: Math.round(before),
        carbonAfter: Math.round(after),
        costSaving: -Math.round(extraCost),
        timeToROI: 0,
        unit: 'tCO₂e',
        extras: [
          { label: 'Scope 3 reduction', value: `${Math.round(((before - after) / before) * 100)}%`, color: '#8b5cf6' },
          { label: 'Additional annual cost', value: `$${(extraCost / 1000).toFixed(0)}k`, color: '#f97316' },
          { label: 'tCO₂e avoided', value: `${Math.round(before - after).toLocaleString()} t`, color: '#10b981' },
          { label: 'Cost per tCO₂e', value: `$${extraCost > 0 ? (extraCost / (before - after)).toFixed(0) : '—'}`, color: '#eab308' },
        ],
      };
    },
  },
];

function ScenarioSimulatorTab() {
  const [activeId, setActiveId] = useState<string>('renewable');
  const scenario = SCENARIO_PRESETS.find(s => s.id === activeId)!;

  const defaultVals = useCallback(() =>
    Object.fromEntries(scenario.params.map(p => [p.key, p.default])),
    [scenario]
  );

  const [vals, setVals] = useState<Record<string, number>>(defaultVals());
  const set = (key: string, v: number) => setVals(prev => ({ ...prev, [key]: v }));

  const result = scenario.compute(vals);
  const carbonDelta = result.carbonAfter - result.carbonBefore;
  const reductionPct = result.carbonBefore > 0 ? Math.abs(Math.round((carbonDelta / result.carbonBefore) * 100)) : 0;
  const maxCarbon = Math.max(result.carbonBefore, result.carbonAfter, 1);

  const handlePresetChange = (id: string) => {
    setActiveId(id);
    const next = SCENARIO_PRESETS.find(s => s.id === id)!;
    setVals(Object.fromEntries(next.params.map(p => [p.key, p.default])));
  };

  const handleReset = () => {
    setVals(defaultVals());
    toast.success('Reset to default values');
  };

  const handleSave = () => {
    toast.success(`Scenario "${scenario.label}" saved to Reports`);
  };

  return (
    <div className="grid grid-cols-5 gap-5">
      {/* Left: scenario selector + params */}
      <div className="col-span-3 space-y-4">
        {/* Scenario preset pills */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-4">
          <p className="text-[11px] text-gray-500 mb-3">Select a scenario template</p>
          <div className="grid grid-cols-2 gap-2">
            {SCENARIO_PRESETS.map(s => (
              <button
                key={s.id}
                onClick={() => handlePresetChange(s.id)}
                className={`flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-all border ${
                  activeId === s.id
                    ? 'border-opacity-40 bg-opacity-10'
                    : 'border-[#1a2035] bg-[#111827] hover:border-[#2a3550]'
                }`}
                style={activeId === s.id ? { borderColor: s.color + '66', background: s.color + '12' } : {}}
              >
                <span className="text-lg leading-none mt-0.5">{s.icon}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color: activeId === s.id ? s.color : '#d1d5db' }}>{s.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">{scenario.icon}</span>
            <div>
              <h3 className="text-xs font-semibold text-white">{scenario.label}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">{scenario.desc}</p>
            </div>
          </div>
          <div className="space-y-6">
            {scenario.params.map(p => (
              <SliderInput
                key={p.key}
                label={p.label}
                value={vals[p.key] ?? p.default}
                min={p.min}
                max={p.max}
                step={p.step}
                unit={` ${p.unit}`}
                hint={p.hint}
                color={p.color}
                onChange={v => set(p.key, v)}
              />
            ))}
          </div>
          <div className="flex justify-between mt-5 pt-4 border-t border-[#1a2035]">
            <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 bg-[#111827] border border-[#1a2035] text-gray-500 hover:text-gray-300 text-xs rounded-xl transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-white text-xs font-semibold rounded-xl transition-colors" style={{ background: scenario.color }}>
              Save Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Right: projected results */}
      <div className="col-span-2 space-y-4">
        {/* Hero metric */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5 text-center"
          style={{ borderColor: scenario.color + '33' }}>
          <p className="text-[11px] text-gray-500 mb-1">Projected Carbon Reduction</p>
          <div className="text-3xl font-bold mb-1" style={{ color: scenario.color }}>
            {carbonDelta < 0 ? '-' : '+'}{reductionPct}%
          </div>
          <p className="text-xs text-gray-500">
            {Math.abs(carbonDelta).toLocaleString()} {result.unit} {carbonDelta < 0 ? 'saved' : 'added'} annually
          </p>
          {result.costSaving > 0 && (
            <div className="mt-3 pt-3 border-t border-[#1a2035] flex items-center justify-center gap-2">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">${result.costSaving.toLocaleString()} / yr in savings</span>
            </div>
          )}
          {result.costSaving < 0 && (
            <div className="mt-3 pt-3 border-t border-[#1a2035] flex items-center justify-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-orange-400 font-semibold">${Math.abs(result.costSaving).toLocaleString()} / yr additional cost</span>
            </div>
          )}
        </div>

        {/* Before / After comparison */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-white mb-4">Before vs After</h4>
          <CompareBar
            before={result.carbonBefore}
            after={result.carbonAfter}
            max={maxCarbon * 1.15}
            label={`Annual CO₂ (${result.unit})`}
            unit={result.unit}
            color={scenario.color}
          />
        </div>

        {/* Key metrics */}
        <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-white mb-3">Key Metrics</h4>
          <div className="grid grid-cols-2 gap-2.5">
            {result.extras.map(e => (
              <div key={e.label} className="bg-[#111827] border border-[#1a2035] rounded-xl p-3">
                <div className="text-sm font-bold" style={{ color: e.color }}>{e.value}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{e.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline bar */}
        {result.timeToROI > 0 && result.timeToROI < 30 && (
          <div className="bg-[#0d1222] border border-[#1a2035] rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-white mb-3">ROI Timeline</h4>
            <div className="relative h-8 bg-[#111827] rounded-xl overflow-hidden border border-[#1a2035]">
              <div
                className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-700"
                style={{ width: `${Math.min((result.timeToROI / 15) * 100, 100)}%`, background: scenario.color + '60', borderRight: `2px solid ${scenario.color}` }}
              >
                <span className="text-[11px] font-semibold text-white">{result.timeToROI}y</span>
              </div>
              <div className="absolute inset-0 flex items-center px-3">
                <span className="text-[11px] text-gray-600">Break-even at {result.timeToROI} years</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-700 mt-1 px-0.5">
              <span>Now</span><span>5y</span><span>10y</span><span>15y+</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type SimTab = 'impact' | 'scenarios';

export function SimulatorPage() {
  const [tab, setTab] = useState<SimTab>('impact');

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-violet-400" />
            ESG Simulator
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Model individual impact and simulate org-level sustainability scenarios with live projections</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 bg-[#111827] border border-[#1a2035] px-3 py-1.5 rounded-xl">
          <Zap className="w-3 h-3 text-yellow-500" /> Live calculations — adjust any slider to update
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#0d1222] border border-[#1a2035] p-1 rounded-xl w-fit">
        {[
          { id: 'impact' as SimTab, label: 'User Impact', icon: User },
          { id: 'scenarios' as SimTab, label: 'Scenario Simulator', icon: Sliders },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.id ? 'bg-violet-600/90 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300 hover:bg-[#111827]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'impact' && <UserImpactTab />}
      {tab === 'scenarios' && <ScenarioSimulatorTab />}
    </div>
  );
}
