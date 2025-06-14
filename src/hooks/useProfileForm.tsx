
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

export const useProfileForm = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    weight_kg: '',
    height_cm: '',
    activity_level: '',
    consumption_goal: '',
    goal_timeline: '',
    goal_motivation: '',
    goal_description: '',
    triggers_moments: [] as string[],
    triggers_specific: [] as string[],
    motivation_reasons: [] as string[],
    motivation_personal: '',
    support_entourage: undefined as boolean | undefined,
    support_preference: '',
    alternative_activities: [] as string[],
    wants_daily_suggestions: true,
    medical_conditions: [] as string[],
    medications: [] as string[],
    default_herbe_quantity: 0.5,
    default_hash_quantity: 0.3,
    default_cigarette_quantity: 1,
    default_herbe_price: 10,
    default_hash_price: 15,
    default_cigarette_price: 0.5,
  });

  // Synchroniser les données du profil avec le formulaire
  useEffect(() => {
    console.log('Profile data changed:', profile);
    if (profile) {
      setFormData({
        username: profile.username || '',
        age: profile.age?.toString() || '',
        weight_kg: profile.weight_kg?.toString() || '',
        height_cm: profile.height_cm?.toString() || '',
        activity_level: profile.activity_level || '',
        consumption_goal: profile.consumption_goal || '',
        goal_timeline: profile.goal_timeline || '',
        goal_motivation: profile.goal_motivation || '',
        goal_description: profile.goal_description || '',
        triggers_moments: profile.triggers_moments || [],
        triggers_specific: profile.triggers_specific || [],
        motivation_reasons: profile.motivation_reasons || [],
        motivation_personal: profile.motivation_personal || '',
        support_entourage: profile.support_entourage,
        support_preference: profile.support_preference || '',
        alternative_activities: profile.alternative_activities || [],
        wants_daily_suggestions: profile.wants_daily_suggestions !== false,
        medical_conditions: profile.medical_conditions || [],
        medications: profile.medications || [],
        default_herbe_quantity: profile.default_herbe_quantity || 0.5,
        default_hash_quantity: profile.default_hash_quantity || 0.3,
        default_cigarette_quantity: profile.default_cigarette_quantity || 1,
        default_herbe_price: profile.default_herbe_price || 10,
        default_hash_price: profile.default_hash_price || 15,
        default_cigarette_price: profile.default_cigarette_price || 0.5,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    console.log('Saving profile with form data:', formData);
    try {
      await updateProfile({
        username: formData.username || undefined,
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg.toString()) : undefined,
        height_cm: formData.height_cm ? parseInt(formData.height_cm.toString()) : undefined,
        activity_level: formData.activity_level || undefined,
        consumption_goal: formData.consumption_goal || undefined,
        goal_timeline: formData.goal_timeline || undefined,
        goal_motivation: formData.goal_motivation || undefined,
        goal_description: formData.goal_description || undefined,
        triggers_moments: formData.triggers_moments.length > 0 ? formData.triggers_moments : undefined,
        triggers_specific: formData.triggers_specific.length > 0 ? formData.triggers_specific : undefined,
        motivation_reasons: formData.motivation_reasons.length > 0 ? formData.motivation_reasons : undefined,
        motivation_personal: formData.motivation_personal || undefined,
        support_entourage: formData.support_entourage,
        support_preference: formData.support_preference || undefined,
        alternative_activities: formData.alternative_activities.length > 0 ? formData.alternative_activities : undefined,
        wants_daily_suggestions: formData.wants_daily_suggestions,
        medical_conditions: formData.medical_conditions.length > 0 ? formData.medical_conditions : undefined,
        medications: formData.medications.length > 0 ? formData.medications : undefined,
        default_herbe_quantity: parseFloat(formData.default_herbe_quantity.toString()),
        default_hash_quantity: parseFloat(formData.default_hash_quantity.toString()),
        default_cigarette_quantity: parseInt(formData.default_cigarette_quantity.toString()),
        default_herbe_price: parseFloat(formData.default_herbe_price.toString()),
        default_hash_price: parseFloat(formData.default_hash_price.toString()),
        default_cigarette_price: parseFloat(formData.default_cigarette_price.toString()),
        profile_completed: true,
      });
      
      toast({
        title: "✅ Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder le profil.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    setFormData,
    handleSave,
    loading,
    profile
  };
};
