import { createContext, useContext } from 'react';
import type { Page } from '../components/layout/Sidebar';

export type UserRole = 'employee' | 'manager';

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  roleIcon: string;
  dept: string;
  points: number;
  xp: number;
  level: number;
  badges: number;
  avatarUrl?: string;
}

export const EMPLOYEE_PROFILE: UserProfile = {
  name: 'Sarah Chen',
  initials: 'SC',
  email: 'sarah.chen@acmecorp.com',
  role: 'employee',
  roleLabel: 'Employee',
  roleIcon: '👤',
  dept: 'Engineering',
  points: 1240,
  xp: 3480,
  level: 7,
  badges: 5,
};

export const MANAGER_PROFILE: UserProfile = {
  name: 'John Doe',
  initials: 'JD',
  email: 'john.doe@acmecorp.com',
  role: 'manager',
  roleLabel: 'ESG Manager',
  roleIcon: '🛡',
  dept: 'Operations',
  points: 4820,
  xp: 12600,
  level: 15,
  badges: 18,
};

interface RoleContextValue {
  user: UserProfile;
  isManager: boolean;
  isEmployee: boolean;
  onNavigate: (page: Page) => void;
  onUpdateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'email' | 'dept' | 'avatarUrl'>>) => void;
}

export const RoleContext = createContext<RoleContextValue>({
  user: MANAGER_PROFILE,
  isManager: true,
  isEmployee: false,
  onNavigate: () => {},
  onUpdateProfile: () => {},
});

export function useRole() {
  return useContext(RoleContext);
}
