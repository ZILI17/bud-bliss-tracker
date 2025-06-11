
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  consumption_goal?: string;
  medical_conditions?: string[];
  medications?: string[];
  default_herbe_quantity?: number;
  default_hash_quantity?: number;
  default_cigarette_quantity?: number;
  profile_completed?: boolean;
  onboarding_completed?: boolean;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const needsOnboarding = () => {
    return !profile?.onboarding_completed;
  };

  const getDefaultQuantity = (type: 'herbe' | 'hash' | 'cigarette') => {
    if (!profile) {
      return type === 'herbe' ? '0.5g' : type === 'hash' ? '0.3g' : '1 cig';
    }
    
    switch (type) {
      case 'herbe':
        return `${profile.default_herbe_quantity || 0.5}g`;
      case 'hash':
        return `${profile.default_hash_quantity || 0.3}g`;
      case 'cigarette':
        return `${profile.default_cigarette_quantity || 1} cig`;
      default:
        return '1 dose';
    }
  };

  return {
    profile,
    loading,
    needsOnboarding,
    getDefaultQuantity,
    refetch: fetchProfile
  };
};
