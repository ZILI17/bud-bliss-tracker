
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoSection from './profile/PersonalInfoSection';
import HealthActivitySection from './profile/HealthActivitySection';
import ConsumptionGoalsSection from './profile/ConsumptionGoalsSection';
import DefaultQuantitiesSection from './profile/DefaultQuantitiesSection';
import ProfileDebugInfo from './profile/ProfileDebugInfo';

const UserProfile = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    weight_kg: '',
    height_cm: '',
    activity_level: '',
    consumption_goal: '',
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

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileDebugInfo profile={profile} />
      
      <PersonalInfoSection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <HealthActivitySection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <ConsumptionGoalsSection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <DefaultQuantitiesSection 
        formData={formData} 
        setFormData={setFormData} 
      />

      <Button onClick={handleSave} className="w-full glass-button neon-glow">
        💾 Sauvegarder toutes les modifications
      </Button>
    </div>
  );
};

export default UserProfile;
