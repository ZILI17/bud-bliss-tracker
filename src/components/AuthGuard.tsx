
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Auth from '@/pages/Auth';
import Onboarding from '@/components/Onboarding';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, needsOnboarding } = useProfile();

  if (authLoading || profileLoading) {
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

  if (needsOnboarding()) {
    return <Onboarding />;
  }

  return <>{children}</>;
};

export default AuthGuard;
