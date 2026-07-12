import { useState, useEffect, useRef } from 'react';
import { X, Save, Camera, Star, Zap, Award, Shield, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRole } from '../context/RoleContext';

const DEPT_OPTIONS = [
  'Engineering', 'Operations', 'HR', 'Finance', 'Marketing', 'Sales', 'Legal', 'Product',
];

interface ProfileModalProps {
  onClose: () => void;
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, isManager, onUpdateProfile } = useRole();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dept, setDept] = useState(user.dept);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl ?? null);
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isDirty =
    name !== user.name ||
    email !== user.email ||
    dept !== user.dept ||
    avatarPreview !== (user.avatarUrl ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be smaller than 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    if (!email.trim() || !email.includes('@')) { toast.error('Enter a valid email address'); return; }
    setSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        name: name.trim(),
        email: email.trim(),
        dept,
        avatarUrl: avatarPreview ?? undefined,
      });
      setSaving(false);
      toast.success('Profile updated successfully');
      onClose();
    }, 600);
  };

  const avatarColor = isManager
    ? { ring: 'border-emerald-500/40', bg: 'bg-emerald-500/15', text: 'text-emerald-400' }
    : { ring: 'border-blue-500/40', bg: 'bg-blue-500/15', text: 'text-blue-400' };

  const liveInitials = name.trim().split(/\s+/).map(p => p[0] ?? '').join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onMouseDown={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-full max-w-md bg-[#0d1222] border border-[#1a2035] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a2035]">
          <h2 className="text-sm font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#1a2035] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar area */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-4">
          <div className="relative shrink-0">
            {/* Avatar circle */}
            <div className={`w-16 h-16 rounded-full border-2 ${avatarColor.ring} ${avatarColor.bg} flex items-center justify-center overflow-hidden`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className={`text-xl font-bold ${avatarColor.text}`}>{liveInitials}</span>
              )}
            </div>

            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1a2035] border border-[#2a3550] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all"
              title="Upload photo"
            >
              <Camera className="w-3 h-3" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{name || user.name}</div>
            <div className={`flex items-center gap-1.5 mt-1 text-[11px] font-medium px-2 py-0.5 rounded-full border w-fit ${
              isManager
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            }`}>
              {isManager ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
              {user.roleLabel}
            </div>
            {/* Upload hint / remove */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                {avatarPreview ? 'Change photo' : 'Upload photo'}
              </button>
              {avatarPreview && (
                <>
                  <span className="text-gray-700 text-[11px]">·</span>
                  <button
                    onClick={() => setAvatarPreview(null)}
                    className="text-[11px] text-red-500 hover:text-red-400 transition-colors flex items-center gap-0.5"
                  >
                    <Trash2 className="w-2.5 h-2.5" /> Remove
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mx-6 mb-5 grid grid-cols-3 gap-2 bg-[#111827] border border-[#1a2035] rounded-xl p-3">
          {[
            { label: 'Points', value: user.points.toLocaleString(), icon: Star, color: 'text-yellow-400' },
            { label: `Level ${user.level}`, value: `${user.xp.toLocaleString()} XP`, icon: Zap, color: 'text-blue-400' },
            { label: 'Badges', value: String(user.badges), icon: Award, color: 'text-violet-400' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
                <span className="text-[10px] text-gray-600">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/15 transition-all"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/15 transition-all"
              placeholder="your@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Department</label>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111827] border border-[#1a2035] rounded-xl text-sm text-gray-200 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/15 transition-all appearance-none cursor-pointer"
            >
              {DEPT_OPTIONS.map(d => (
                <option key={d} value={d} style={{ background: '#111827' }}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
            <div className="px-3.5 py-2.5 bg-[#0b0f1a] border border-[#1a2035] rounded-xl text-sm text-gray-500 select-none">
              {user.roleLabel} <span className="text-[11px] text-gray-700 ml-1">(cannot be changed here)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-transparent border border-[#1a2035] hover:border-[#2a3550] text-gray-400 hover:text-gray-200 text-sm font-medium rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
