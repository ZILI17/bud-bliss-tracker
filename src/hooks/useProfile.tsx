
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  username?: string;
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
  default_herbe_price?: number;
  default_hash_price?: number;
  default_cigarette_price?: number;
  profile_completed?: boolean;
  onboarding_completed?: boolean;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching profile for:', user.id);
      fetchProfile();
    } else {
      console.log('No user authenticated');
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      console.log('No user available for profile fetch');
      return;
    }

    console.log('Fetching profile for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      console.log('Setting profile data:', data);
      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.log('No user available for profile update');
      return;
    }

    console.log('Updating profile with data:', updates);
    console.log('Current user ID:', user.id);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      console.log('Profile update result:', { data, error });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully, new data:', data);
      setProfile(data);
      
      // Force refetch to ensure data consistency
      setTimeout(() => {
        console.log('Refetching profile after update');
        fetchProfile();
      }, 100);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
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
    updateProfile,
    needsOnboarding,
    getDefaultQuantity,
    refetch: fetchProfile
  };
};
