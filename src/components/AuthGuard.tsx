
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="pulse-ring mb-4"></div>
          <p className="text-primary">Initialisation Agent Quit Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
};

export default AuthGuard;
