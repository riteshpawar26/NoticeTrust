import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { db } from '../lib/db';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (fullName: string, email: string, role: UserRole, department?: string, semester?: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  canPublish: boolean;
  canModerate: boolean;
  isSuperAdmin: boolean;
}

const AUTH_USER_KEY = 'noticetrust_current_user_id';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    // Load persisted user or default to Student Priya Sharma for immediate showcase
    const savedUserId = localStorage.getItem(AUTH_USER_KEY);
    const profiles = db.getProfiles();
    if (savedUserId) {
      const found = profiles.find(p => p.id === savedUserId);
      if (found) {
        setUser(found);
        return;
      }
    }
    // Default to Student Priya Sharma
    const defaultStudent = profiles.find(p => p.role === 'student') || profiles[0];
    setUser(defaultStudent);
    localStorage.setItem(AUTH_USER_KEY, defaultStudent.id);
  }, []);

  const login = async (email: string, selectedRole?: UserRole) => {
    const profiles = db.getProfiles();
    let found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found && selectedRole) {
      found = profiles.find(p => p.role === selectedRole);
    }
    if (found) {
      setUser(found);
      localStorage.setItem(AUTH_USER_KEY, found.id);
    } else {
      // Create user on the fly if unknown
      const newProfile: Profile = {
        id: crypto.randomUUID(),
        email,
        full_name: email.split('@')[0],
        role: selectedRole || 'student',
        institution_id: db.getInstitution().id,
        department: 'Computer Science & Engineering',
        semester: 'Semester 6',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const store = db.getStore();
      store.profiles.push(newProfile);
      localStorage.setItem('noticetrust_db_store_v1', JSON.stringify(store));
      setUser(newProfile);
      localStorage.setItem(AUTH_USER_KEY, newProfile.id);
    }
  };

  const register = async (fullName: string, email: string, role: UserRole, department?: string, semester?: string) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      email,
      full_name: fullName,
      role,
      institution_id: db.getInstitution().id,
      department: department || 'General Engineering',
      semester: semester || 'Semester 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const store = db.getStore();
    store.profiles.push(newProfile);
    localStorage.setItem('noticetrust_db_store_v1', JSON.stringify(store));
    setUser(newProfile);
    localStorage.setItem(AUTH_USER_KEY, newProfile.id);
  };

  const logout = () => {
    // Return to public or student
    const profiles = db.getProfiles();
    const student = profiles.find(p => p.role === 'student') || null;
    setUser(student);
    if (student) {
      localStorage.setItem(AUTH_USER_KEY, student.id);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    const profiles = db.getProfiles();
    const targetProfile = profiles.find(p => p.role === newRole);
    if (targetProfile) {
      setUser(targetProfile);
      localStorage.setItem(AUTH_USER_KEY, targetProfile.id);
    }
  };

  const role: UserRole = user?.role || 'student';
  const canPublish = role === 'publisher' || role === 'admin' || role === 'super_admin';
  const canModerate = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoRole,
        canPublish,
        canModerate,
        isSuperAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
